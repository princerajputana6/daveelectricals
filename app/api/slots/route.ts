import { NextResponse } from "next/server";
import { slotsCol, publicSlot, todayISO } from "@/lib/slots";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Public — list bookable same-day slots from today onwards. Returns open and
 * booked slots (booked shown as "Not available"); closed slots are hidden.
 */
export async function GET() {
  try {
    const col = await slotsCol();
    const today = todayISO();
    const list = await col
      .find({ date: { $gte: today }, status: { $in: ["open", "booked"] } })
      .sort({ date: 1, time: 1 })
      .limit(400)
      .toArray();
    return NextResponse.json({ slots: list.map(publicSlot) });
  } catch (err) {
    console.error("[slots GET]", err);
    return NextResponse.json({ slots: [] });
  }
}
