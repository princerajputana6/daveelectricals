import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import OAuthClient from "intuit-oauth";
import { getSession, isAdminSession } from "@/lib/auth";
import { makeOAuthClient, qbConfigured } from "@/lib/quickbooks";

export const runtime = "nodejs";

/** Admin-only: kick off the QuickBooks OAuth consent flow. */
export async function GET(req: Request) {
  const session = await getSession();
  if (!isAdminSession(session)) {
    return NextResponse.redirect(new URL("/login?next=/admin/settings", req.url));
  }
  if (!qbConfigured()) {
    return NextResponse.json(
      {
        error:
          "QuickBooks env not set. Add QB_CLIENT_ID, QB_CLIENT_SECRET, QB_REDIRECT_URI, QB_ENVIRONMENT.",
      },
      { status: 503 },
    );
  }

  const client = makeOAuthClient();
  const state = randomUUID();
  const authUri = client.authorizeUri({
    scope: [OAuthClient.scopes.Accounting],
    state,
  });

  const res = NextResponse.redirect(authUri);
  res.cookies.set("qb_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  return res;
}
