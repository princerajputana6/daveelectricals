import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { ordersCol } from "@/lib/orders";
import { getSession, isAdminSession } from "@/lib/auth";

export const runtime = "nodejs";

/**
 * Mark a balance payment as manually received (e.g. customer paid by bank transfer).
 * Sets payments.balance.status = "paid", manual = true, and advances status to completed.
 */
export async function POST(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!isAdminSession(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await ctx.params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid order id" }, { status: 400 });
  }

  const col = await ordersCol();
  const order = await col.findOne({ _id: new ObjectId(id) });
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.paymentMode === "full") {
    return NextResponse.json(
      { error: "Order was paid in full — no balance to mark." },
      { status: 400 },
    );
  }
  if (order.payments?.balance?.status === "paid") {
    return NextResponse.json(
      { error: "Balance already paid." },
      { status: 400 },
    );
  }

  const now = new Date();
  await col.updateOne(
    { _id: order._id },
    {
      $set: {
        "payments.balance": {
          amount: order.balance,
          currency: order.currency,
          status: "paid",
          manual: true,
          createdAt: order.payments?.balance?.createdAt || now,
          paidAt: now,
        },
        status: "completed",
        updatedAt: now,
      },
    },
  );

  return NextResponse.json({ ok: true });
}
