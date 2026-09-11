import { ObjectId } from "mongodb";
import { ordersCol, type Order } from "@/lib/orders";
import { logIntegration } from "@/lib/collections";
import { nextInvoiceNumber } from "@/services/invoiceNumber";
import { renderInvoicePdf } from "@/services/invoicePdf";
import { uploadRawBuffer, isCloudinaryConfigured } from "@/lib/cloudinary";
import { sendMail } from "@/lib/mailer";
import { isQuickBooksConnected } from "@/lib/quickbooks";
import {
  findOrCreateCustomer,
  createInvoice,
  recordPayment,
} from "@/services/quickbooks";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Run `fn` up to `attempts` times with exponential backoff. */
async function withRetry<T>(
  label: string,
  fn: () => Promise<T>,
  attempts = 3,
  baseMs = 400,
): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      if (i < attempts - 1) await sleep(baseMs * 2 ** i);
    }
  }
  throw new Error(
    `${label} failed after ${attempts} attempts: ${
      lastErr instanceof Error ? lastErr.message : String(lastErr)
    }`,
  );
}

const gbp = (n: number) => `£${(n ?? 0).toFixed(2)}`;

/**
 * The full post-payment accounting pipeline. Idempotent at every step — safe to
 * re-run (Stripe retries, the confirm-route fallback, or a manual admin re-run).
 * QuickBooks steps are skipped gracefully until QB is connected.
 *
 * `kind` is which Stripe payment fired: "deposit" | "full" | "balance".
 */
export async function runAccountingPipeline(
  orderId: string,
  kind: "deposit" | "full" | "balance",
): Promise<{ ok: boolean; error?: string }> {
  const col = await ordersCol();
  const _id = new ObjectId(orderId);
  let order = await col.findOne({ _id });
  if (!order) return { ok: false, error: "order not found" };

  const total = order.total ?? order.subtotal;

  try {
    // 1) Invoice number (once)
    if (!order.invoiceNumber) {
      const invoiceNumber = await nextInvoiceNumber(order.createdAt);
      await col.updateOne(
        { _id },
        { $set: { invoiceNumber, updatedAt: new Date() } },
      );
      order = { ...order, invoiceNumber };
    }

    // 2–4) QuickBooks (skip gracefully if not connected)
    const qbOn = await isQuickBooksConnected();
    if (qbOn) {
      // Customer
      let customerId = order.quickbooks?.customerId;
      if (!customerId) {
        customerId = await withRetry("QB customer", () =>
          findOrCreateCustomer({
            name: order!.customer.name,
            email: order!.customer.email,
            phone: order!.customer.phone,
          }),
        );
        await col.updateOne(
          { _id },
          { $set: { "quickbooks.customerId": customerId, updatedAt: new Date() } },
        );
      }
      // Invoice (once)
      let invoiceId = order.quickbooks?.invoiceId;
      if (!invoiceId) {
        const description = order.items
          .map((i) => `${i.qty}× ${i.name}`)
          .join(", ")
          .concat(
            ` — subtotal ${gbp(order!.subtotal)}, VAT ${
              order!.vatRate ?? 0
            }% ${gbp(order!.vatAmount ?? 0)}, total ${gbp(total)}`,
          );
        invoiceId = await withRetry("QB invoice", () =>
          createInvoice({
            customerId: customerId!,
            invoiceNumber: order!.invoiceNumber!,
            description,
            total,
          }),
        );
        await col.updateOne(
          { _id },
          { $set: { "quickbooks.invoiceId": invoiceId, updatedAt: new Date() } },
        );
      }
      // Payment (guard per kind)
      const isBalance = kind === "balance";
      const guardField = isBalance
        ? "quickbooks.balancePaymentId"
        : "quickbooks.depositPaymentId";
      const already = isBalance
        ? order.quickbooks?.balancePaymentId
        : order.quickbooks?.depositPaymentId;
      if (!already) {
        const amount = isBalance
          ? order.balance
          : order.paymentMode === "full"
            ? total
            : order.deposit;
        const paymentId = await withRetry("QB payment", () =>
          recordPayment({ customerId: customerId!, invoiceId: invoiceId!, amount }),
        );
        await col.updateOne(
          { _id },
          { $set: { [guardField]: paymentId, updatedAt: new Date() } },
        );
      }
      // refresh local copy of quickbooks refs
      order = (await col.findOne({ _id }))!;
    } else {
      await logIntegration({
        provider: "quickbooks",
        action: "pipeline",
        status: "skipped",
        orderId,
        response: { reason: "QuickBooks not connected" },
      });
    }

    // 5) Render the PDF once (deterministic from the order); reuse for both the
    // Cloudinary archive and the email attachment — no re-fetch, no dependency
    // on Cloudinary's raw-delivery setting.
    const needPdf =
      !order.invoicePdf?.url || !order.accounting?.invoiceEmailedAt;
    let pdfBuf: Buffer | null = null;
    if (needPdf) {
      pdfBuf = await withRetry("PDF render", () => renderInvoicePdf(order!));
    }

    // 6) Archive the PDF to Cloudinary (once)
    if (!order.invoicePdf?.url && pdfBuf && isCloudinaryConfigured()) {
      const year = new Date(order.createdAt).getFullYear();
      const publicId = `${year}/${order.invoiceNumber}`;
      const up = await withRetry("Cloudinary upload", () =>
        uploadRawBuffer(pdfBuf!, publicId, "invoices"),
      );
      await col.updateOne(
        { _id },
        {
          $set: {
            invoicePdf: { url: up.url, publicId: up.publicId },
            updatedAt: new Date(),
          },
        },
      );
      order = { ...order, invoicePdf: { url: up.url, publicId: up.publicId } };
    }

    // 7) Email the invoice to the customer (once) — attach the buffer directly
    // and link to our own always-available invoice route.
    if (!order.accounting?.invoiceEmailedAt && pdfBuf) {
      const appUrl = (
        process.env.NEXT_PUBLIC_APP_URL || "https://daveelectrical.co.uk"
      ).replace(/\/$/, "");
      const downloadLink = `${appUrl}/api/invoices/${orderId}`;
      const serviceNames = order.items.map((i) => i.name).join(", ");
      const amountPaid = gbp(order.paymentMode === "full" ? total : order.deposit);
      const html = `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#111">
          <div style="background:#0a0a0a;color:#e2e61f;padding:16px 22px;font-weight:800">Dave Electrical Services — Invoice</div>
          <div style="border:1px solid #eee;border-top:0;padding:22px;line-height:1.55">
            <p>Hi ${order.customer.name.split(" ")[0]},</p>
            <p>Thank you for your payment. Your invoice is attached.</p>
            <table style="font-size:14px;border-collapse:collapse;margin:14px 0">
              <tr><td style="color:#666;padding:3px 12px 3px 0">Invoice</td><td><strong>${order.invoiceNumber}</strong></td></tr>
              <tr><td style="color:#666;padding:3px 12px 3px 0">Service</td><td>${serviceNames}</td></tr>
              <tr><td style="color:#666;padding:3px 12px 3px 0">Amount paid</td><td><strong>${amountPaid}</strong></td></tr>
            </table>
            <p><a href="${downloadLink}" style="display:inline-block;background:#e2e61f;color:#050505;padding:11px 20px;border-radius:999px;text-decoration:none;font-weight:700">Download invoice (PDF)</a></p>
          </div>
        </div>`;
      const mail = await withRetry("Invoice email", async () => {
        const res = await sendMail({
          to: order!.customer.email,
          subject: "Invoice from Dave Electrical",
          text: `Hi ${order!.customer.name},\n\nThank you for your payment. Invoice ${order!.invoiceNumber} for ${serviceNames}.\nAmount paid: ${amountPaid}\nDownload: ${downloadLink}\n\nDave Electrical Services`,
          html,
          attachments: [
            {
              filename: `${order!.invoiceNumber}.pdf`,
              content: pdfBuf!.toString("base64"),
              contentType: "application/pdf",
            },
          ],
        });
        if (!res.sent) throw new Error(res.reason || "email failed");
        return res;
      });
      if (mail.sent) {
        await col.updateOne(
          { _id },
          { $set: { "accounting.invoiceEmailedAt": new Date() } },
        );
      }
    }

    // 8) Stamp completion
    await col.updateOne(
      { _id },
      {
        $set: { "accounting.processedAt": new Date(), "accounting.lastError": "" },
      },
    );
    await logIntegration({
      provider: "stripe",
      action: "pipeline.complete",
      status: "success",
      orderId,
      response: { invoiceNumber: order.invoiceNumber, qb: qbOn },
    });
    return { ok: true };
  } catch (e) {
    const error = e instanceof Error ? e.message : String(e);
    await col.updateOne(
      { _id },
      { $set: { "accounting.lastError": error, updatedAt: new Date() } },
    );
    await logIntegration({
      provider: "stripe",
      action: "pipeline.error",
      status: "error",
      orderId,
      response: { error },
    });
    return { ok: false, error };
  }
}
