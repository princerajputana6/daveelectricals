import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSession, isAdminSession } from "@/lib/auth";
import { makeOAuthClient, saveQbTokens } from "@/lib/quickbooks";
import { logIntegration } from "@/lib/collections";

export const runtime = "nodejs";

/** Intuit redirects here after consent. Exchange the code for tokens. */
export async function GET(req: Request) {
  const session = await getSession();
  if (!isAdminSession(session)) {
    return NextResponse.redirect(new URL("/login?next=/admin/settings", req.url));
  }

  const url = new URL(req.url);
  const state = url.searchParams.get("state");
  const realmId = url.searchParams.get("realmId");

  const cookieStore = await cookies();
  const expected = cookieStore.get("qb_oauth_state")?.value;
  if (!state || !expected || state !== expected) {
    return NextResponse.redirect(
      new URL("/admin/settings?qb=state_error", req.url),
    );
  }
  if (!realmId) {
    return NextResponse.redirect(
      new URL("/admin/settings?qb=no_realm", req.url),
    );
  }

  try {
    const client = makeOAuthClient();
    const authResponse = await client.createToken(req.url);
    const token = authResponse.getJson() as {
      access_token: string;
      refresh_token: string;
      expires_in: number;
      x_refresh_token_expires_in?: number;
    };

    await saveQbTokens({
      realmId,
      accessToken: token.access_token,
      refreshToken: token.refresh_token,
      expiresInSec: token.expires_in,
      refreshExpiresInSec: token.x_refresh_token_expires_in,
    });
    await logIntegration({
      provider: "quickbooks",
      action: "oauth.connected",
      status: "success",
      response: { realmId },
    });

    const res = NextResponse.redirect(
      new URL("/admin/settings?qb=connected", req.url),
    );
    res.cookies.delete("qb_oauth_state");
    return res;
  } catch (err) {
    await logIntegration({
      provider: "quickbooks",
      action: "oauth.error",
      status: "error",
      response: { error: err instanceof Error ? err.message : String(err) },
    });
    return NextResponse.redirect(
      new URL("/admin/settings?qb=error", req.url),
    );
  }
}
