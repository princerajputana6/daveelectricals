import { NextResponse } from "next/server";
import { ordersCol, publicOrder, type OrderStatus } from "@/lib/orders";
import { getSession, isAdminSession } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const session = await getSession();
  if (!isAdminSession(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") as OrderStatus | null;
  const search = searchParams.get("q")?.toLowerCase();

  const col = await ordersCol();
  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { "customer.name": { $regex: search, $options: "i" } },
      { "customer.email": { $regex: search, $options: "i" } },
      { "customer.phone": { $regex: search, $options: "i" } },
    ];
  }

  const list = await col
    .find(filter)
    .sort({ createdAt: -1 })
    .limit(200)
    .toArray();

  return NextResponse.json({ orders: list.map(publicOrder) });
}
