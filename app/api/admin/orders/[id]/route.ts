import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { ordersCol, type OrderStatus, type Certificate } from "@/lib/orders";
import { getSession, isAdminSession } from "@/lib/auth";

export const runtime = "nodejs";

const VALID_STATUSES: OrderStatus[] = [
  "pending_deposit",
  "pending_payment",
  "deposit_paid",
  "paid_in_full",
  "in_progress",
  "ready_for_balance",
  "completed",
  "cancelled",
];

async function checkAuth(req: Request): Promise<boolean> {
  // Either a logged-in admin user, or the x-admin-secret header (for back-office curl)
  const session = await getSession();
  if (isAdminSession(session)) return true;
  const secret = process.env.ADMIN_SECRET;
  if (secret && req.headers.get("x-admin-secret") === secret) return true;
  return false;
}

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  if (!(await checkAuth(req))) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  const { id } = await ctx.params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid order id" }, { status: 400 });
  }

  const body = await req.json();
  const update: Record<string, unknown> = { updatedAt: new Date() };

  if (body.status) {
    if (!VALID_STATUSES.includes(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    update.status = body.status;
  }

  if (body.certificate) {
    const c = body.certificate;
    if (!c.number || !c.type) {
      return NextResponse.json(
        { error: "Certificate requires number and type." },
        { status: 400 },
      );
    }
    const cert: Certificate = {
      number: String(c.number),
      type: String(c.type),
      issuedAt: c.issuedAt ? new Date(c.issuedAt) : new Date(),
      expiresAt: c.expiresAt ? new Date(c.expiresAt) : undefined,
      notes: c.notes ? String(c.notes) : undefined,
      fileUrl: c.fileUrl ? String(c.fileUrl) : undefined,
    };
    update.certificate = cert;
    // When a cert is issued and status not already past, advance to ready_for_balance
    if (!body.status) update.status = "ready_for_balance";
  }

  const col = await ordersCol();
  const result = await col.updateOne(
    { _id: new ObjectId(id) },
    { $set: update },
  );

  if (result.matchedCount === 0) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
