import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ordersCol } from "@/lib/orders";
import { getSession, isAdminSession } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const session = await getSession();
  if (!isAdminSession(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const db = await getDb();
  const orders = await ordersCol();

  const [
    totalOrders,
    pendingDeposits,
    inProgress,
    readyForBalance,
    completed,
    cancelled,
    totalCustomers,
    totalEnquiries,
    allOrders,
  ] = await Promise.all([
    orders.countDocuments({}),
    orders.countDocuments({
      status: { $in: ["pending_deposit", "pending_payment"] },
    }),
    orders.countDocuments({
      status: { $in: ["deposit_paid", "paid_in_full", "in_progress"] },
    }),
    orders.countDocuments({ status: "ready_for_balance" }),
    orders.countDocuments({ status: "completed" }),
    orders.countDocuments({ status: "cancelled" }),
    db.collection("users").countDocuments({}),
    db.collection("contacts").countDocuments({}),
    orders.find({}).toArray(),
  ]);

  let revenuePaid = 0;
  let revenueOwed = 0;
  for (const o of allOrders) {
    const depositPaid = o.payments?.deposit?.status === "paid";
    const balancePaid = o.payments?.balance?.status === "paid";
    if (depositPaid) revenuePaid += o.payments?.deposit?.amount || 0;
    if (balancePaid) revenuePaid += o.payments?.balance?.amount || 0;
    if (o.paymentMode !== "full" && !balancePaid && depositPaid) {
      revenueOwed += o.balance || 0;
    }
  }

  // Last 7 days, by day
  const today = new Date();
  const days: { date: string; count: number; revenue: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    const next = new Date(d);
    next.setDate(next.getDate() + 1);
    const inDay = allOrders.filter((o) => {
      const c = new Date(o.createdAt);
      return c >= d && c < next;
    });
    days.push({
      date: d.toISOString().slice(0, 10),
      count: inDay.length,
      revenue: +inDay
        .reduce(
          (s, o) =>
            s +
            (o.payments?.deposit?.status === "paid"
              ? o.payments.deposit.amount
              : 0) +
            (o.payments?.balance?.status === "paid"
              ? o.payments.balance.amount
              : 0),
          0,
        )
        .toFixed(2),
    });
  }

  return NextResponse.json({
    totals: {
      orders: totalOrders,
      pending: pendingDeposits,
      inProgress,
      readyForBalance,
      completed,
      cancelled,
      customers: totalCustomers,
      enquiries: totalEnquiries,
    },
    revenue: {
      paid: +revenuePaid.toFixed(2),
      owed: +revenueOwed.toFixed(2),
      currency: "GBP",
    },
    last7days: days,
  });
}
