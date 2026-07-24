import OAuthClient from "intuit-oauth";
import { integrationsCol, type IntegrationConfig } from "@/lib/collections";

const QB_ID = "quickbooks";

function env() {
  return {
    clientId: process.env.QB_CLIENT_ID || "",
    clientSecret: process.env.QB_CLIENT_SECRET || "",
    redirectUri: process.env.QB_REDIRECT_URI || "",
    environment: (process.env.QB_ENVIRONMENT === "production"
      ? "production"
      : "sandbox") as "sandbox" | "production",
  };
}

export function qbConfigured(): boolean {
  const e = env();
  return !!(e.clientId && e.clientSecret && e.redirectUri);
}

export function makeOAuthClient(): OAuthClient {
  const e = env();
  return new OAuthClient({
    clientId: e.clientId,
    clientSecret: e.clientSecret,
    environment: e.environment,
    redirectUri: e.redirectUri,
  });
}

function apiBase(environment: string) {
  return environment === "production"
    ? "https://quickbooks.api.intuit.com"
    : "https://sandbox-quickbooks.api.intuit.com";
}

export async function loadQbConfig(): Promise<IntegrationConfig | null> {
  const col = await integrationsCol();
  return col.findOne({ _id: QB_ID });
}

export async function saveQbTokens(input: {
  realmId: string;
  accessToken: string;
  refreshToken: string;
  expiresInSec: number;
  refreshExpiresInSec?: number;
}): Promise<void> {
  const col = await integrationsCol();
  const now = Date.now();
  await col.updateOne(
    { _id: QB_ID },
    {
      $set: {
        realmId: input.realmId,
        accessToken: input.accessToken,
        refreshToken: input.refreshToken,
        accessTokenExpiresAt: new Date(now + input.expiresInSec * 1000),
        refreshTokenExpiresAt: input.refreshExpiresInSec
          ? new Date(now + input.refreshExpiresInSec * 1000)
          : undefined,
        environment: env().environment,
        updatedAt: new Date(),
      },
    },
    { upsert: true },
  );
}

export async function isQuickBooksConnected(): Promise<boolean> {
  const cfg = await loadQbConfig();
  return !!(cfg?.refreshToken && cfg?.realmId);
}

/**
 * Return a valid access token + realmId, refreshing automatically when the
 * current access token is expired (or within 60s of expiring). Returns null if
 * QuickBooks has never been connected.
 */
async function getValidToken(): Promise<{
  accessToken: string;
  realmId: string;
} | null> {
  const cfg = await loadQbConfig();
  if (!cfg?.refreshToken || !cfg.realmId) return null;

  const stillValid =
    cfg.accessToken &&
    cfg.accessTokenExpiresAt &&
    new Date(cfg.accessTokenExpiresAt).getTime() - Date.now() > 60_000;

  if (stillValid) {
    return { accessToken: cfg.accessToken!, realmId: cfg.realmId };
  }

  // Refresh
  const client = makeOAuthClient();
  const res = await client.refreshUsingToken(cfg.refreshToken);
  const token = res.getJson() as {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    x_refresh_token_expires_in?: number;
  };
  await saveQbTokens({
    realmId: cfg.realmId,
    accessToken: token.access_token,
    refreshToken: token.refresh_token,
    expiresInSec: token.expires_in,
    refreshExpiresInSec: token.x_refresh_token_expires_in,
  });
  return { accessToken: token.access_token, realmId: cfg.realmId };
}

/**
 * Authenticated call to the QuickBooks Online v3 REST API.
 * `path` is relative to /v3/company/{realmId}/, e.g. "invoice" or
 * "query?query=...". Throws on non-2xx (so callers/withRetry can react).
 */
export async function qboFetch(
  path: string,
  init: RequestInit = {},
): Promise<unknown> {
  const tok = await getValidToken();
  if (!tok) throw new Error("QuickBooks is not connected.");
  const base = apiBase(env().environment);
  const sep = path.includes("?") ? "&" : "?";
  const url = `${base}/v3/company/${tok.realmId}/${path}${sep}minorversion=70`;
  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${tok.accessToken}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  const body = await res.text();
  if (!res.ok) {
    throw new Error(`QBO ${res.status}: ${body.slice(0, 500)}`);
  }
  return body ? JSON.parse(body) : {};
}
