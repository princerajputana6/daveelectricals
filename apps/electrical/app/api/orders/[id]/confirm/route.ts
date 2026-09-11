import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getSession } from "@/lib/auth";
import { ordersCol } from "@/lib/orders";
import { getStripe } from "@/lib/stripe";
import { runAccountingPipeline } from "@/services/pipeline";

export const runtime = "nodejs";

/**
 * Stripe success redirect lands here: ?session_id={CHECKOUT_SESSION_ID}
 * We retrieve the session from Stripe (authoritative — never trust the
 * redirect alone), confirm it's paid and matches this order, mark the order
 * paid, then bounce the customer to their account page.
 */
export async function GET(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const url = new URL(req.url);
  const origin = url.origin;
  const sessionId = url.searchParams.get("session_id");

  const back = (path: string) => NextResponse.redirect(`${origin}${path}`);

  try {
    const auth = await getSession();
    if (!auth) return back("/login?next=/account");
    if (!ObjectId.isValid(id) || !sessionId) return back("/account?error=1");

    const stripe = getStripe();
    const cs = await stripe.checkout.sessions.retrieve(sessionId);

    if (
      cs.payment_status !== "paid" ||
      cs.metadata?.appOrderId !== id
    ) {
      return back("/account?error=payment");
    }
    const kind = cs.metadata?.kind === "balance" ? "balance" : "deposit";
    const paymentIntentId =
      typeof cs.payment_intent === "string"
        ? cs.payment_intent
        : cs.payment_intent?.id;

    const col = await ordersCol();
    const order = await col.findOne({
      _id: new ObjectId(id),
      userId: auth.uid,
    });
    if (!order) return back("/account?error=notfound");

    // Already processed — just show the account page.
    if (
      (kind === "deposit" && order.payments.deposit?.status === "paid") ||
      (kind === "balance" && order.payments.balance?.status === "paid")
    ) {
      return back(`/account?paid=${id}`);
    }

    const now = new Date();
    const path = `payments.${kind}` as const;
    const set: Record<string, unknown> = {
      [`${path}.status`]: "paid",
      [`${path}.stripePaymentIntentId`]: paymentIntentId,
      [`${path}.paidAt`]: now,
      updatedAt: now,
    };

    if (kind === "deposit") {
      if (order.paymentMode === "full") {
        // Paid in full up front — settle the balance slot too.
        set["payments.balance"] = {
          amount: 0,
          currency: order.currency,
          status: "paid",
          manual: false,
          createdAt: now,
          paidAt: now,
          stripeSessionId: sessionId,
          stripePaymentIntentId: paymentIntentId,
        };
        set.status = "paid_in_full";
      } else {
        set.status = "deposit_paid";
      }
    } else {
      set.status = "completed";
    }

    await col.updateOne({ _id: order._id }, { $set: set });

    // Fallback trigger for the accounting pipeline (idempotent) in case the
    // Stripe webhook is delayed. Best-effort — never block the redirect.
    try {
      await runAccountingPipeline(id, kind === "balance" ? "balance" : "deposit");
    } catch {
      /* webhook remains the primary path; failures are recorded on the order */
    }

    return back(`/account?paid=${id}`);
  } catch (err) {
    console.error("[orders confirm]", err);
    return back("/account?error=1");
  }
}
