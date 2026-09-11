import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getSession, isAdminSession } from "@/lib/auth";
import { slotsCol, publicSlot, todayISO, type Slot } from "@/lib/slots";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function checkAuth(req: Request): Promise<boolean> {
  const session = await getSession();
  if (isAdminSession(session)) return true;
  const secret = process.env.ADMIN_SECRET;
  if (secret && req.headers.get("x-admin-secret") === secret) return true;
  return false;
}

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Admin — list all upcoming slots (open, booked and closed). */
export async function GET(req: Request) {
  if (!(await checkAuth(req)))
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  const col = await slotsCol();
  const list = await col
    .find({ date: { $gte: todayISO() } })
    .sort({ date: 1, time: 1 })
    .limit(500)
    .toArray();
  return NextResponse.json({
    slots: list.map((s) => ({
      ...publicSlot(s),
      orderId: s.orderId ?? null,
    })),
  });
}

/** Admin — add one or more time slots to a date. Body: { date, times: [] }. */
export async function POST(req: Request) {
  if (!(await checkAuth(req)))
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  try {
    const body = await req.json();
    const date = String(body?.date || "").trim();
    const times: string[] = Array.isArray(body?.times)
      ? body.times
      : body?.time
        ? [body.time]
        : [];
    if (!DATE_RE.test(date))
      return NextResponse.json({ error: "Invalid date." }, { status: 400 });
    const clean = [...new Set(times.map((t) => String(t).trim()))].filter((t) =>
      TIME_RE.test(t),
    );
    if (clean.length === 0)
      return NextResponse.json(
        { error: "Add at least one valid time (HH:mm)." },
        { status: 400 },
      );
    if (date < todayISO())
      return NextResponse.json(
        { error: "Date is in the past." },
        { status: 400 },
      );

    const col = await slotsCol();
    const now = new Date();
    const docs: Slot[] = clean.map((time) => ({
      _id: new ObjectId(),
      date,
      time,
      status: "open",
      createdAt: now,
      updatedAt: now,
    }));
    // Insert, ignoring duplicates (unique date+time index).
    let added = 0;
    for (const d of docs) {
      try {
        await col.insertOne(d);
        added++;
      } catch {
        /* duplicate slot — skip */
      }
    }
    return NextResponse.json({ ok: true, added });
  } catch (err) {
    console.error("[admin slots POST]", err);
    return NextResponse.json({ error: "Could not add slots." }, { status: 500 });
  }
}
