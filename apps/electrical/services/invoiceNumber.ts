import { countersCol } from "@/lib/collections";

/**
 * Atomically generate the next sequential invoice number for the given year,
 * formatted DE-YYYY-000001. Uses a per-year counter doc with findOneAndUpdate
 * $inc + upsert, so concurrent webhooks can never produce a duplicate.
 */
export async function nextInvoiceNumber(date = new Date()): Promise<string> {
  const year = date.getFullYear();
  const col = await countersCol();
  const res = await col.findOneAndUpdate(
    { _id: `invoice-${year}` },
    { $inc: { seq: 1 } },
    { upsert: true, returnDocument: "after" },
  );
  const seq = res?.seq ?? 1;
  return `DE-${year}-${String(seq).padStart(6, "0")}`;
}
