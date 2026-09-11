import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getSession, isAdminSession } from "@/lib/auth";
import { slotsCol, type SlotStatus } from "@/lib/slots";

export const runtime = "nodejs";

async function checkAuth(req: Request): Promise<boolean> {
  const session = await getSession();
  if (isAdminSession(session)) return true;
  const secret = process.env.ADMIN_SECRET;
  if (secret && req.headers.get("x-admin-secret") === secret) return true;
  return false;
}

/** Admin — open / close / re-open a slot. Body: { status: "open" | "closed" }. */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await checkAuth(req)))
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  const { id } = await params;
  if (!ObjectId.isValid(id))
    return NextResponse.json({ error: "Bad id." }, { status: 400 });
  const body = await req.json().catch(() => ({}));
  const status = body?.status as SlotStatus;
  if (status !== "open" && status !== "closed")
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  const col = await slotsCol();
  // Don't let admin silently override a paid booking here.
  const res = await col.updateOne(
    { _id: new ObjectId(id), status: { $in: ["open", "closed"] } },
    { $set: { status, updatedAt: new Date() } },
  );
  if (res.matchedCount === 0)
    return NextResponse.json(
      { error: "Slot is booked or not found." },
      { status: 409 },
    );
  return NextResponse.json({ ok: true });
}

/** Admin — delete a slot (only if not booked). */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await checkAuth(req)))
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  const { id } = await params;
  if (!ObjectId.isValid(id))
    return NextResponse.json({ error: "Bad id." }, { status: 400 });
  const col = await slotsCol();
  const res = await col.deleteOne({
    _id: new ObjectId(id),
    status: { $ne: "booked" },
  });
  if (res.deletedCount === 0)
    return NextResponse.json(
      { error: "Cannot delete a booked slot." },
      { status: 409 },
    );
  return NextResponse.json({ ok: true });
}
