import type { Collection } from "mongodb";
import { getDb } from "@/lib/mongodb";

/** Single-document store for site-wide, admin-configurable settings. */
export type AppSettings = {
  _id: string;
  vatRate: number; // percentage, e.g. 20 = 20%
  updatedAt?: Date;
};

const SETTINGS_ID = "app";
export const DEFAULT_VAT_RATE = 20;

async function settingsCol(): Promise<Collection<AppSettings>> {
  const db = await getDb();
  return db.collection<AppSettings>("settings");
}

/** Clamp to a sane 0–100% with 2-decimal precision. */
export function clampVatRate(rate: number): number {
  if (!Number.isFinite(rate)) return DEFAULT_VAT_RATE;
  return Math.min(100, Math.max(0, Math.round(rate * 100) / 100));
}

export async function getVatRate(): Promise<number> {
  const col = await settingsCol();
  const doc = await col.findOne({ _id: SETTINGS_ID });
  return clampVatRate(
    typeof doc?.vatRate === "number" ? doc.vatRate : DEFAULT_VAT_RATE,
  );
}

export async function setVatRate(rate: number): Promise<number> {
  const r = clampVatRate(rate);
  const col = await settingsCol();
  await col.updateOne(
    { _id: SETTINGS_ID },
    { $set: { vatRate: r, updatedAt: new Date() } },
    { upsert: true },
  );
  return r;
}

/**
 * Given an ex-VAT subtotal and a VAT %, returns the VAT amount, the
 * VAT-inclusive total, and the 50%/50% deposit + balance split (all rounded
 * to pennies). Single source of truth for money maths across the app.
 */
export function computeTotals(subtotal: number, vatRate: number) {
  const sub = +subtotal.toFixed(2);
  const rate = clampVatRate(vatRate);
  const vatAmount = +((sub * rate) / 100).toFixed(2);
  const total = +(sub + vatAmount).toFixed(2);
  const deposit = +(total / 2).toFixed(2);
  const balance = +(total - deposit).toFixed(2);
  return { subtotal: sub, vatRate: rate, vatAmount, total, deposit, balance };
}
