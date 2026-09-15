import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getStripe } from "@/lib/stripe";
import { ordersCol } from "@/lib/orders";
import { markOrderPaid } from "@/services/markPaid";
import { runAccountingPipeline } from "@/services/pipeline";
import { logIntegration } from "@/lib/collections";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Allow the sweep enough time to process a batch of orders (Vercel: Hobby ≤60s).
export const maxDuration = 60;

/**
 * Webhook-free payment reconciliation.
 *
 * Polls Stripe directly for recently *paid* Checkout Sessions and runs the
 * accounting pipeline (invoice number → QuickBooks → PDF → email) for any order
 * that hasn't been fully processed yet. Everything is idempotent, so it's safe
 * to run on a schedule (every few minutes) or to hit manually on demand.
 *
 * This is the reliable alternative to the Stripe webhook: it catches payments
 * even when the customer never returns to the success page.
 *
 * Auth: send the CRON_SECRET either as `Authorization: Bearer <secret>` or as
 * `?key=<secret>`. If CRON_SECRET is unset the endpoint refuses to run so it can
 * never be left open.
 *
 * Optional query params:
 *   ?hours=N   how far back to look (default 72, max 720)
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "CRON_SECRET not configured — refusing to run." },
      { status: 500 },
    );
  }

  const url = new URL(req.url);
  const bearer = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const provided = bearer || url.searchParams.get("key");
  if (provided !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const hours = Math.min(
    Math.max(Number(url.searchParams.get("hours")) || 72, 1),
    720,
  );
  const gte = Math.floor(Date.now() / 1000) - hours * 3600;

  const stripe = getStripe();
  const col = await ordersCol();

  const summary = {
    scanned: 0,
    paid: 0,
    processed: [] as string[],
    alreadyDone: 0,
    skipped: 0,
    errors: [] as { orderId: string; error: string }[],
  };

  try {
    // Auto-paginates through every Checkout Session in the window.
    for await (const cs of stripe.checkout.sessions.list({
      created: { gte },
      limit: 100,
    })) {
      summary.scanned++;

      if (cs.payment_status !== "paid") continue;
      const appOrderId = cs.metadata?.appOrderId;
      const kind = (cs.metadata?.kind || "deposit") as
        | "deposit"
        | "full"
        | "balance";
      if (!appOrderId || !ObjectId.isValid(appOrderId)) continue;
      summary.paid++;

      const order = await col.findOne({ _id: new ObjectId(appOrderId) });
      if (!order) {
        summary.skipped++;
        continue;
      }

      // Fully processed already (processedAt is only stamped on full success).
      const slotPaid =
        kind === "balance"
          ? order.payments.balance?.status === "paid"
          : order.payments.deposit?.status === "paid";
      if (slotPaid && order.accounting?.processedAt) {
        summary.alreadyDone++;
        continue;
      }

      const paymentIntentId =
        typeof cs.payment_intent === "string"
          ? cs.payment_intent
          : cs.payment_intent?.id;

      try {
        // 1) Idempotently mark paid (covers the case the browser never returned).
        await markOrderPaid(order, kind, {
          sessionId: cs.id,
          paymentIntentId,
        });
        // 2) Idempotently run the invoice pipeline (each step self-guards).
        const result = await runAccountingPipeline(appOrderId, kind);
        if (result.ok) {
          summary.processed.push(appOrderId);
        } else {
          summary.errors.push({
            orderId: appOrderId,
            error: result.error || "pipeline returned not-ok",
          });
        }
      } catch (e) {
        summary.errors.push({
          orderId: appOrderId,
          error: e instanceof Error ? e.message : String(e),
        });
      }
    }

    await logIntegration({
      provider: "stripe",
      action: "cron.reconcile",
      status: summary.errors.length ? "error" : "success",
      response: {
        hours,
        scanned: summary.scanned,
        paid: summary.paid,
        processed: summary.processed.length,
        alreadyDone: summary.alreadyDone,
        errors: summary.errors.length,
      },
    });

    return NextResponse.json({ ok: true, ...summary });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "reconcile failed", ...summary },
      { status: 500 },
    );
  }
}
