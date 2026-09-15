import { NextResponse } from "next/server";
import { getVatRate } from "@/lib/settings";

export const runtime = "nodejs";

/** Public: the current VAT rate, so the cart/checkout can show live totals. */
export async function GET() {
  const vatRate = await getVatRate();
  return NextResponse.json({ vatRate });
}
