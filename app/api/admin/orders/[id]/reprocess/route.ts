import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getSession, isAdminSession } from "@/lib/auth";
import { ordersCol } from "@/lib/orders";
import { runAccountingPipeline } from "@/services/pipeline";

export const runtime = "nodejs";

/** Admin-only: manually (re-)run the accounting pipeline for an order. */
export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!isAdminSession(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await ctx.params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid order id" }, { status: 400 });
  }

  const col = await ordersCol();
  const order = await col.findOne({ _id: new ObjectId(id) });
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // Determine which payment kind to record based on what's paid.
  const kind: "deposit" | "full" | "balance" =
    order.paymentMode === "full"
      ? "full"
      : order.payments.balance?.status === "paid"
        ? "balance"
        : "deposit";

  const result = await runAccountingPipeline(id, kind);
  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}
