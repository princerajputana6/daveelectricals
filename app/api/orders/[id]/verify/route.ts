import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getSession } from "@/lib/auth";
import { ordersCol } from "@/lib/orders";
import { verifySignature } from "@/lib/razorpay";

export const runtime = "nodejs";

export async function POST(
  req: Request,
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

    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      type, // "deposit" | "balance"
    } = body || {};

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      (type !== "deposit" && type !== "balance")
    ) {
      return NextResponse.json(
        { error: "Missing payment details." },
        { status: 400 },
      );
    }

    const okSig = verifySignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    });
    if (!okSig) {
      return NextResponse.json(
        { error: "Invalid payment signature." },
        { status: 400 },
      );
    }

    const col = await ordersCol();
    const order = await col.findOne({
      _id: new ObjectId(id),
      userId: session.uid,
    });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const path = `payments.${type}` as const;
    const matching = order.payments[type as "deposit" | "balance"];
    if (!matching || matching.razorpayOrderId !== razorpay_order_id) {
      return NextResponse.json(
        { error: "Payment does not match this order." },
        { status: 400 },
      );
    }

    const now = new Date();
    const nextStatus =
      type === "deposit"
        ? order.status === "pending_deposit"
          ? "deposit_paid"
          : order.status
        : "completed";

    await col.updateOne(
      { _id: order._id },
      {
        $set: {
          [`${path}.status`]: "paid",
          [`${path}.razorpayPaymentId`]: razorpay_payment_id,
          [`${path}.razorpaySignature`]: razorpay_signature,
          [`${path}.paidAt`]: now,
          status: nextStatus,
          updatedAt: now,
        },
      },
    );

    return NextResponse.json({
      ok: true,
      status: nextStatus,
      paidAt: now,
    });
  } catch (err) {
    console.error("[orders verify]", err);
    return NextResponse.json(
      { error: "Could not verify payment." },
      { status: 500 },
    );
  }
}
