import { qboFetch } from "@/lib/quickbooks";
import {
  customersCol,
  integrationsCol,
  logIntegration,
} from "@/lib/collections";

const SERVICE_ITEM_NAME = "Electrical Service";

/** QBO query strings escape single quotes with a backslash. */
function esc(v: string) {
  return v.replace(/'/g, "\\'");
}

type QBRef = { value: string };

/**
 * Find a QuickBooks customer by email, or create one. Result is cached in the
 * local `customers` collection so we avoid repeat lookups.
 */
export async function findOrCreateCustomer(input: {
  name: string;
  email: string;
  phone?: string;
}): Promise<string> {
  const email = input.email.toLowerCase();
  const cust = await customersCol();

  const cached = await cust.findOne({ email });
  if (cached?.quickbooksCustomerId) return cached.quickbooksCustomerId;

  // Search QBO by email
  const q = `select * from Customer where PrimaryEmailAddr = '${esc(email)}'`;
  const found = (await qboFetch(`query?query=${encodeURIComponent(q)}`)) as {
    QueryResponse?: { Customer?: { Id: string }[] };
  };
  let qbId = found.QueryResponse?.Customer?.[0]?.Id;

  if (!qbId) {
    const [firstName, ...rest] = input.name.trim().split(" ");
    const lastName = rest.join(" ");
    const created = (await qboFetch("customer", {
      method: "POST",
      body: JSON.stringify({
        DisplayName: `${input.name} (${email})`,
        GivenName: firstName || input.name,
        FamilyName: lastName || undefined,
        PrimaryEmailAddr: { Address: email },
        ...(input.phone
          ? { PrimaryPhone: { FreeFormNumber: input.phone } }
          : {}),
      }),
    })) as { Customer?: { Id: string } };
    qbId = created.Customer?.Id;
    if (!qbId) throw new Error("QBO customer create returned no Id");
  }

  await cust.updateOne(
    { email },
    {
      $set: {
        email,
        quickbooksCustomerId: qbId,
        phone: input.phone,
        updatedAt: new Date(),
      },
      $setOnInsert: { createdAt: new Date() },
    },
    { upsert: true },
  );
  await logIntegration({
    provider: "quickbooks",
    action: "findOrCreateCustomer",
    request: { email },
    response: { qbId },
    status: "success",
  });
  return qbId;
}

/**
 * Ensure the single reusable "Electrical Service" item exists; cache its id in
 * the integrations config. Requires an Income account (uses the first one).
 */
export async function ensureServiceItem(): Promise<string> {
  const col = await integrationsCol();
  const cfg = await col.findOne({ _id: "quickbooks" });
  if (cfg?.serviceItemId) return cfg.serviceItemId;

  const q = `select * from Item where Name = '${SERVICE_ITEM_NAME}'`;
  const found = (await qboFetch(`query?query=${encodeURIComponent(q)}`)) as {
    QueryResponse?: { Item?: { Id: string }[] };
  };
  let itemId = found.QueryResponse?.Item?.[0]?.Id;

  if (!itemId) {
    const acctRes = (await qboFetch(
      `query?query=${encodeURIComponent(
        "select * from Account where AccountType = 'Income'",
      )}`,
    )) as { QueryResponse?: { Account?: { Id: string }[] } };
    const incomeAccountId = acctRes.QueryResponse?.Account?.[0]?.Id;
    if (!incomeAccountId)
      throw new Error("No Income account found to attach the service item to");

    const created = (await qboFetch("item", {
      method: "POST",
      body: JSON.stringify({
        Name: SERVICE_ITEM_NAME,
        Type: "Service",
        IncomeAccountRef: { value: incomeAccountId } as QBRef,
      }),
    })) as { Item?: { Id: string } };
    itemId = created.Item?.Id;
    if (!itemId) throw new Error("QBO item create returned no Id");
  }

  await col.updateOne(
    { _id: "quickbooks" },
    { $set: { serviceItemId: itemId, updatedAt: new Date() } },
    { upsert: true },
  );
  return itemId;
}

/**
 * Create a QBO invoice for the full order total. Amount is VAT-inclusive; the
 * VAT breakdown is noted in the line description to avoid QBO tax-code setup.
 */
export async function createInvoice(input: {
  customerId: string;
  invoiceNumber: string;
  description: string;
  total: number;
}): Promise<string> {
  const itemId = await ensureServiceItem();
  const created = (await qboFetch("invoice", {
    method: "POST",
    body: JSON.stringify({
      CustomerRef: { value: input.customerId } as QBRef,
      DocNumber: input.invoiceNumber,
      Line: [
        {
          Amount: +input.total.toFixed(2),
          DetailType: "SalesItemLineDetail",
          Description: input.description,
          SalesItemLineDetail: {
            ItemRef: { value: itemId } as QBRef,
            Qty: 1,
            UnitPrice: +input.total.toFixed(2),
          },
        },
      ],
    }),
  })) as { Invoice?: { Id: string } };
  const id = created.Invoice?.Id;
  if (!id) throw new Error("QBO invoice create returned no Id");
  await logIntegration({
    provider: "quickbooks",
    action: "createInvoice",
    request: { invoiceNumber: input.invoiceNumber, total: input.total },
    response: { invoiceId: id },
    status: "success",
  });
  return id;
}

/** Record a payment against an invoice (marks it Paid when fully covered). */
export async function recordPayment(input: {
  customerId: string;
  invoiceId: string;
  amount: number;
}): Promise<string> {
  const created = (await qboFetch("payment", {
    method: "POST",
    body: JSON.stringify({
      CustomerRef: { value: input.customerId } as QBRef,
      TotalAmt: +input.amount.toFixed(2),
      Line: [
        {
          Amount: +input.amount.toFixed(2),
          LinkedTxn: [{ TxnId: input.invoiceId, TxnType: "Invoice" }],
        },
      ],
    }),
  })) as { Payment?: { Id: string } };
  const id = created.Payment?.Id;
  if (!id) throw new Error("QBO payment create returned no Id");
  await logIntegration({
    provider: "quickbooks",
    action: "recordPayment",
    request: { invoiceId: input.invoiceId, amount: input.amount },
    response: { paymentId: id },
    status: "success",
  });
  return id;
}
