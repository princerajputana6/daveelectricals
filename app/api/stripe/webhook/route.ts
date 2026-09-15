import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { ordersCol } from "@/lib/orders";
import { markOrderPaid } from "@/services/markPaid";
import { runAccountingPipeline } from "@/services/pipeline";
import { logIntegration } from "@/lib/collections";

export const runtime = "nodejs";
// Ensure the raw body is available for signature verification.
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET not configured" },
      { status: 500 },
    );
  }

  const sig = req.headers.get("stripe-signature");
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(rawBody, sig || "", secret);
  } catch (err) {
    // Invalid signature → reject.
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${
        err instanceof Error ? err.message : "unknown"
      }` },
      { status: 400 },
    );
  }

  // We only act on successful checkout completions. payment_intent.succeeded is
  // acknowledged (200) but the checkout session carries our appOrderId/kind.
  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true, ignored: event.type });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  if (session.payment_status !== "paid") {
    return NextResponse.json({ received: true, unpaid: true });
  }

  const appOrderId = session.metadata?.appOrderId;
  const kind = session.metadata?.kind || "deposit";
  if (!appOrderId || !ObjectId.isValid(appOrderId)) {
    return NextResponse.json({ received: true, noOrder: true });
  }

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id;

  try {
    const col = await ordersCol();
    const order = await col.findOne({ _id: new ObjectId(appOrderId) });
    if (!order) {
      return NextResponse.json({ received: true, orderMissing: true });
    }

    // Idempotent: mark paid (no-op if already paid), then run the pipeline
    // (each step guards on its own stored reference).
    await markOrderPaid(order, kind, {
      sessionId: session.id,
      paymentIntentId,
    });

    const result = await runAccountingPipeline(appOrderId, kind as "deposit" | "full" | "balance");

    await logIntegration({
      provider: "stripe",
      action: "webhook.checkout.completed",
      status: result.ok ? "success" : "error",
      orderId: appOrderId,
      request: { eventId: event.id, kind },
      response: result,
    });

    // Always 200 so Stripe doesn't storm retries; failures are recorded on the
    // order (accounting.lastError) for the admin "re-run accounting" action.
    return NextResponse.json({ received: true, pipeline: result });
  } catch (err) {
    // Unexpected error before/around marking paid — let Stripe retry.
    console.error("[stripe webhook]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "webhook error" },
      { status: 500 },
    );
  }
}
