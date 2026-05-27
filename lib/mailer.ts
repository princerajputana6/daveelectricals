import nodemailer from "nodemailer";

type SendArgs = {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
};

let cached: nodemailer.Transporter | null = null;

function getTransport(): nodemailer.Transporter | null {
  if (cached) return cached;
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;
  cached = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
  return cached;
}

export async function sendMail(args: SendArgs): Promise<{
  sent: boolean;
  reason?: string;
}> {
  const transport = getTransport();
  if (!transport) {
    return {
      sent: false,
      reason: "SMTP not configured — set SMTP_HOST / SMTP_USER / SMTP_PASS in .env.local",
    };
  }
  const from =
    process.env.SMTP_FROM ||
    `Dave Electrical Website <${process.env.SMTP_USER}>`;
  await transport.sendMail({
    from,
    to: args.to,
    subject: args.subject,
    text: args.text,
    html: args.html,
    replyTo: args.replyTo,
  });
  return { sent: true };
}
