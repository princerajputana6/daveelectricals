import nodemailer from "nodemailer";

type SendArgs = {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
};

/**
 * Sends mail via Resend (preferred, if RESEND_API_KEY is set) and falls back
 * to SMTP/nodemailer otherwise. The public `sendMail` signature is unchanged,
 * so every existing caller keeps working.
 */
export async function sendMail(args: SendArgs): Promise<{
  sent: boolean;
  id?: string;
  reason?: string;
}> {
  const from =
    process.env.MAIL_FROM ||
    "Dave Electrical Services <info@daveelectrical.co.uk>";

  // 1) Resend (HTTP API — no extra dependency needed)
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: Array.isArray(args.to) ? args.to : [args.to],
          subject: args.subject,
          text: args.text,
          html: args.html,
          ...(args.replyTo ? { reply_to: args.replyTo } : {}),
        }),
      });
      if (res.ok) {
        const data = (await res.json().catch(() => ({}))) as { id?: string };
        return { sent: true, id: data.id };
      }
      const body = await res.text().catch(() => "");
      return {
        sent: false,
        reason: `Resend error ${res.status}: ${body.slice(0, 400)}`,
      };
    } catch (e) {
      return {
        sent: false,
        reason: `Resend request failed: ${
          e instanceof Error ? e.message : String(e)
        }`,
      };
    }
  }

  // 2) SMTP fallback (nodemailer)
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) {
    return {
      sent: false,
      reason:
        "No mail transport configured — set RESEND_API_KEY (recommended) or SMTP_HOST / SMTP_USER / SMTP_PASS in .env.local",
    };
  }
  const transport = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
  await transport.sendMail({
    from: process.env.SMTP_FROM || from,
    to: args.to,
    subject: args.subject,
    text: args.text,
    html: args.html,
    replyTo: args.replyTo,
  });
  return { sent: true };
}
