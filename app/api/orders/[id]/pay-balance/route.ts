import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getSession } from "@/lib/auth";
import { ordersCol } from "@/lib/orders";
import { getRazorpay } from "@/lib/razorpay";
import { toPence } from "@/lib/products";

export const runtime = "nodejs";

export async function POST(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await ctx.params;
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid order id" }, { status: 400 });
    }
    const col = await ordersCol();
    const order = await col.findOne({
      _id: new ObjectId(id),
      userId: session.uid,
    });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    if (order.payments.balance?.status === "paid") {
      return NextResponse.json(
        { error: "Balance is already paid." },
        { status: 400 },
      );
    }
    if (order.status !== "ready_for_balance" && order.status !== "completed") {
      return NextResponse.json(
        {
          error:
            "Balance is not yet due. We'll notify you once the work is complete.",
        },
        { status: 400 },
      );
    }

    const rzp = getRazorpay();
    const rzpOrder = await rzp.orders.create({
      amount: toPence(order.balance),
      currency: order.currency,
      receipt: `bal_${order._id.toString().slice(-12)}`,
      notes: {
        type: "balance",
        appOrderId: order._id.toString(),
        userId: session.uid,
      },
    });

    await col.updateOne(
      { _id: order._id },
      {
        $set: {
          "payments.balance": {
            razorpayOrderId: rzpOrder.id,
            amount: order.balance,
            currency: order.currency,
            status: "created",
            createdAt: new Date(),
          },
          updatedAt: new Date(),
        },
      },
    );

    return NextResponse.json({
      ok: true,
      razorpay: {
        keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        orderId: rzpOrder.id,
        amount: toPence(order.balance),
        currency: order.currency,
      },
    });
  } catch (err) {
    console.error("[orders pay-balance]", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Could not start balance payment.",
      },
      { status: 500 },
    );
  }
}
