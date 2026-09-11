import { NextResponse } from "next/server";
import { getSession, isAdminSession } from "@/lib/auth";
import { getVatRate, setVatRate } from "@/lib/settings";

export const runtime = "nodejs";

export async function GET() {
  const session = await getSession();
  if (!isAdminSession(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const vatRate = await getVatRate();
  return NextResponse.json({ vatRate });
}

export async function PUT(req: Request) {
  const session = await getSession();
  if (!isAdminSession(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await req.json().catch(() => ({}));
  const rate = Number(body?.vatRate);
  if (!Number.isFinite(rate) || rate < 0 || rate > 100) {
    return NextResponse.json(
      { error: "VAT rate must be a number between 0 and 100." },
      { status: 400 },
    );
  }
  const vatRate = await setVatRate(rate);
  return NextResponse.json({ ok: true, vatRate });
}
