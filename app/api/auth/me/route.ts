import { NextResponse } from "next/server";
import { getSession, isAdminSession } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ user: null });
  return NextResponse.json({
    user: {
      name: session.name,
      email: session.email,
      isAdmin: isAdminSession(session),
    },
  });
}
