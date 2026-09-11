import type { Collection } from "mongodb";
import { getDb } from "@/lib/mongodb";

/** QuickBooks customer mapping, keyed by lower-cased email. */
export type CustomerDoc = {
  _id?: unknown;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  quickbooksCustomerId?: string;
  createdAt: Date;
  updatedAt: Date;
};

/** Audit trail for every external integration call. */
export type IntegrationLog = {
  provider: "quickbooks" | "cloudinary" | "resend" | "stripe";
  action: string;
  request?: unknown;
  response?: unknown;
  status: "success" | "error" | "skipped";
  orderId?: string;
  createdAt: Date;
};

/** Atomic sequence counters (e.g. invoice numbers). */
export type CounterDoc = { _id: string; seq: number };

/** Single-doc store for third-party integration state (QB OAuth tokens). */
export type IntegrationConfig = {
  _id: string; // "quickbooks"
  realmId?: string;
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpiresAt?: Date;
  refreshTokenExpiresAt?: Date;
  environment?: "sandbox" | "production";
  serviceItemId?: string;
  updatedAt?: Date;
};

export async function customersCol(): Promise<Collection<CustomerDoc>> {
  return (await getDb()).collection<CustomerDoc>("customers");
}

export async function integrationLogsCol(): Promise<Collection<IntegrationLog>> {
  return (await getDb()).collection<IntegrationLog>("integration_logs");
}

export async function countersCol(): Promise<Collection<CounterDoc>> {
  return (await getDb()).collection<CounterDoc>("counters");
}

export async function integrationsCol(): Promise<Collection<IntegrationConfig>> {
  return (await getDb()).collection<IntegrationConfig>("integrations");
}

/** Fire-and-forget audit log; never throws. */
export async function logIntegration(
  entry: Omit<IntegrationLog, "createdAt">,
): Promise<void> {
  try {
    const col = await integrationLogsCol();
    // Trim large payloads so logs stay lightweight.
    const trim = (v: unknown) => {
      try {
        const s = JSON.stringify(v);
        return s.length > 4000 ? s.slice(0, 4000) + "…" : JSON.parse(s);
      } catch {
        return String(v);
      }
    };
    await col.insertOne({
      ...entry,
      request: entry.request ? trim(entry.request) : undefined,
      response: entry.response ? trim(entry.response) : undefined,
      createdAt: new Date(),
    });
  } catch {
    /* logging must never break the pipeline */
  }
}
