import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getSession } from "@/lib/auth";
import { ordersCol } from "@/lib/orders";
import { getStripe } from "@/lib/stripe";
import { toPence } from "@/lib/products";

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
    const col = await ordersCol();
    const order = await col.findOne({
      _id: new ObjectId(id),
      userId: session.uid,
    });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    if (order.paymentMode === "full") {
      return NextResponse.json(
        { error: "This order was paid in full — no balance is owed." },
        { status: 400 },
      );
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

    const origin = req.headers.get("origin") || new URL(req.url).origin;
    const stripe = getStripe();
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: order.customer.email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: order.currency.toLowerCase(),
            unit_amount: toPence(order.balance),
            product_data: {
              name: `Dave Electrical — balance for order #${order._id
                .toString()
                .slice(-6)
                .toUpperCase()}`,
            },
          },
        },
      ],
      metadata: {
        appOrderId: order._id.toString(),
        kind: "balance",
        userId: session.uid,
      },
      payment_intent_data: {
        metadata: { appOrderId: order._id.toString(), kind: "balance" },
      },
      success_url: `${origin}/api/orders/${order._id.toString()}/confirm?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/account?cancelled=1`,
    });

    await col.updateOne(
      { _id: order._id },
      {
        $set: {
          "payments.balance": {
            stripeSessionId: checkoutSession.id,
            amount: order.balance,
            currency: order.currency,
            status: "created",
            createdAt: new Date(),
          },
          updatedAt: new Date(),
        },
      },
    );

    return NextResponse.json({ ok: true, checkoutUrl: checkoutSession.url });
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
