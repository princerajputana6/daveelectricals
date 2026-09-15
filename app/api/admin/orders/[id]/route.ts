import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { ordersCol, type OrderStatus, type Certificate } from "@/lib/orders";
import { getSession, isAdminSession } from "@/lib/auth";
import { sendMail } from "@/lib/mailer";
import { company } from "@/lib/content";

export const runtime = "nodejs";

const VALID_STATUSES: OrderStatus[] = [
  "pending_deposit",
  "pending_payment",
  "deposit_paid",
  "paid_in_full",
  "in_progress",
  "ready_for_balance",
  "completed",
  "cancelled",
];

async function checkAuth(req: Request): Promise<boolean> {
  const session = await getSession();
  if (isAdminSession(session)) return true;
  const secret = process.env.ADMIN_SECRET;
  if (secret && req.headers.get("x-admin-secret") === secret) return true;
  return false;
}

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  if (!(await checkAuth(req))) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  const { id } = await ctx.params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid order id" }, { status: 400 });
  }

  const body = await req.json();
  const update: Record<string, unknown> = { updatedAt: new Date() };

  if (body.status) {
    if (!VALID_STATUSES.includes(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    update.status = body.status;
  }

  let issuedCert: Certificate | null = null;
  if (body.certificate) {
    const c = body.certificate;
    if (!c.number || !c.type) {
      return NextResponse.json(
        { error: "Certificate requires number and type." },
        { status: 400 },
      );
    }
    const cert: Certificate = {
      number: String(c.number),
      type: String(c.type),
      issuedAt: c.issuedAt ? new Date(c.issuedAt) : new Date(),
      expiresAt: c.expiresAt ? new Date(c.expiresAt) : undefined,
      notes: c.notes ? String(c.notes) : undefined,
      fileUrl: c.fileUrl ? String(c.fileUrl) : undefined,
    };
    update.certificate = cert;
    issuedCert = cert;
    if (!body.status) {
      // If already paid in full, jump straight to completed; otherwise ready_for_balance
    }
  }

  const col = await ordersCol();

  // Pull the order first so we can email the customer + decide the right status
  const order = await col.findOne({ _id: new ObjectId(id) });
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (issuedCert && !body.status) {
    // If already fully paid (e.g. paid_in_full), advance straight to completed; otherwise ready_for_balance
    update.status =
      order.paymentMode === "full" ||
      order.payments?.balance?.status === "paid"
        ? "completed"
        : "ready_for_balance";
  }

  const result = await col.updateOne(
    { _id: order._id },
    { $set: update },
  );
  if (result.matchedCount === 0) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // Send the customer an email when we issue a certificate
  let emailed: { sent: boolean; reason?: string } | null = null;
  if (issuedCert && order.customer?.email) {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      req.headers.get("origin") ||
      "https://daveelectrical.co.uk";
    const certUrl = `${baseUrl}/account/orders/${id}/certificate`;
    const expires = issuedCert.expiresAt
      ? new Date(issuedCert.expiresAt).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "—";
    const fullyPaid =
      order.paymentMode === "full" ||
      order.payments?.balance?.status === "paid";

    const subject = `Your ${issuedCert.type} has been issued — Dave Electrical`;
    const text = `Hi ${order.customer.name.split(" ")[0]},

Your ${issuedCert.type} (# ${issuedCert.number}) has been issued by Dave Electrical Services.

Issued: ${new Date(issuedCert.issuedAt).toLocaleDateString("en-GB")}
Expires: ${expires}
View it: ${certUrl}

${fullyPaid ? "Your account is fully paid — the certificate is available for download." : `An outstanding balance of £${order.balance.toFixed(2)} is due. Once paid, your certificate will be unlocked for download.`}

Thank you for choosing Dave Electrical Services.
${company.phonePrimary} · ${company.email}`;

    const html = `
      <div style="font-family:system-ui,sans-serif;max-width:600px;margin:auto">
        <div style="background:#050505;color:#e2e61f;padding:18px 24px;font-weight:800;font-size:18px;letter-spacing:.5px">
          DAVE ELECTRICAL · CERTIFICATE ISSUED
        </div>
        <div style="border:1px solid #eee;border-top:0;padding:24px;color:#111;line-height:1.55">
          <p>Hi ${order.customer.name.split(" ")[0]},</p>
          <p>Your <strong>${issuedCert.type}</strong> has been issued by our team.</p>
          <table style="width:100%;border-collapse:collapse;font-size:14px;margin:18px 0">
            <tr><td style="padding:6px 0;color:#666;width:120px">Certificate #</td><td><strong>${issuedCert.number}</strong></td></tr>
            <tr><td style="padding:6px 0;color:#666">Issued</td><td>${new Date(issuedCert.issuedAt).toLocaleDateString("en-GB")}</td></tr>
            <tr><td style="padding:6px 0;color:#666">Expires</td><td>${expires}</td></tr>
            <tr><td style="padding:6px 0;color:#666">Order</td><td>#${id.slice(-6).toUpperCase()}</td></tr>
          </table>
          ${
            fullyPaid
              ? `<p style="background:#ecfdf5;border-left:4px solid #10b981;padding:12px 14px;margin:18px 0">Your account is fully paid — your certificate is ready to download.</p>`
              : `<p style="background:#fffbeb;border-left:4px solid #e2e61f;padding:12px 14px;margin:18px 0"><strong>£${order.balance.toFixed(2)} balance owed.</strong> The certificate is visible (blurred) in your account; download will unlock once the balance is paid.</p>`
          }
          <p><a href="${certUrl}" style="display:inline-block;background:#e2e61f;color:#050505;padding:12px 22px;border-radius:999px;text-decoration:none;font-weight:700">View certificate</a></p>
          <p style="color:#666;font-size:12px;margin-top:24px">Dave Electrical Services Limited · ${company.phonePrimary} · ${company.email}</p>
        </div>
      </div>`;

    emailed = await sendMail({
      to: order.customer.email,
      subject,
      text,
      html,
    });
  }

  return NextResponse.json({
    ok: true,
    certIssued: !!issuedCert,
    emailed: emailed?.sent ?? null,
    emailNote: emailed?.reason,
  });
}
