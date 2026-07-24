import { ordersCol, type Order } from "@/lib/orders";

/**
 * Idempotently mark an order's deposit/full/balance payment as paid, mirroring
 * the logic in app/api/orders/[id]/confirm. Returns whether anything changed.
 * `metaKind` is the Stripe metadata `kind` ("deposit" | "full" | "balance").
 */
export async function markOrderPaid(
  order: Order,
  metaKind: string,
  refs: { sessionId?: string; paymentIntentId?: string },
): Promise<{ changed: boolean }> {
  const col = await ordersCol();
  const slot: "deposit" | "balance" = metaKind === "balance" ? "balance" : "deposit";

  const alreadyPaid =
    slot === "deposit"
      ? order.payments.deposit?.status === "paid"
      : order.payments.balance?.status === "paid";
  if (alreadyPaid) return { changed: false };

  const now = new Date();
  const path = `payments.${slot}` as const;
  const set: Record<string, unknown> = {
    [`${path}.status`]: "paid",
    [`${path}.stripePaymentIntentId`]: refs.paymentIntentId,
    [`${path}.paidAt`]: now,
    updatedAt: now,
  };

  if (slot === "deposit") {
    if (order.paymentMode === "full") {
      set["payments.balance"] = {
        amount: 0,
        currency: order.currency,
        status: "paid",
        manual: false,
        createdAt: now,
        paidAt: now,
        stripeSessionId: refs.sessionId,
        stripePaymentIntentId: refs.paymentIntentId,
      };
      set.status = "paid_in_full";
    } else {
      set.status = "deposit_paid";
    }
  } else {
    set.status = "completed";
  }

  await col.updateOne({ _id: order._id }, { $set: set });
  return { changed: true };
}
