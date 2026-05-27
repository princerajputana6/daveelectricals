import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { sendMail } from "@/lib/mailer";
import { getSession, validEmail } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { name, email, phone, service, message } = await req.json();

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Please enter your name." },
        { status: 400 },
      );
    }
    if (!email || !validEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }
    if (!message || typeof message !== "string" || message.trim().length < 5) {
      return NextResponse.json(
        { error: "Please include a short message about what you need." },
        { status: 400 },
      );
    }

    const session = await getSession();
    const submission = {
      name: name.trim(),
      email: email.toLowerCase(),
      phone: typeof phone === "string" ? phone.trim() : "",
      service: typeof service === "string" ? service.trim() : "General enquiry",
      message: message.trim(),
      userId: session?.uid || null,
      submittedAt: new Date(),
      ip: req.headers.get("x-forwarded-for") || null,
      userAgent: req.headers.get("user-agent") || null,
    };

    const db = await getDb();
    const result = await db.collection("contacts").insertOne(submission);

    const to = process.env.CONTACT_TO || "info@daveelectrical.co.uk";
    const subject = `Website enquiry — ${submission.service} — ${submission.name}`;
    const text = `New website enquiry

Name:    ${submission.name}
Email:   ${submission.email}
Phone:   ${submission.phone || "—"}
Service: ${submission.service}

Message:
${submission.message}

— sent from daveelectrical.co.uk
Submission ID: ${result.insertedId.toString()}`;

    const html = `
      <div style="font-family:system-ui,sans-serif;max-width:600px">
        <div style="background:#050505;color:#ffd400;padding:16px 22px;font-weight:700;font-size:18px">
          Dave Electrical — Website Enquiry
        </div>
        <div style="border:1px solid #eee;border-top:0;padding:22px;color:#111">
          <p style="margin:0 0 16px;font-size:15px">You have a new contact form submission.</p>
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:8px 0;color:#666;width:90px">Name</td><td><strong>${submission.name}</strong></td></tr>
            <tr><td style="padding:8px 0;color:#666">Email</td><td><a href="mailto:${submission.email}">${submission.email}</a></td></tr>
            <tr><td style="padding:8px 0;color:#666">Phone</td><td>${submission.phone || "—"}</td></tr>
            <tr><td style="padding:8px 0;color:#666">Service</td><td>${submission.service}</td></tr>
          </table>
          <div style="margin-top:18px;padding:14px;background:#fafafa;border-left:3px solid #ffd400;white-space:pre-wrap">${submission.message}</div>
          <p style="margin:18px 0 0;color:#888;font-size:12px">Submission ID: ${result.insertedId.toString()}</p>
        </div>
      </div>`;

    const mail = await sendMail({
      to,
      subject,
      text,
      html,
      replyTo: submission.email,
    });

    return NextResponse.json({
      ok: true,
      saved: true,
      emailed: mail.sent,
      note: mail.sent ? undefined : mail.reason,
    });
  } catch (err) {
    console.error("[contact] error", err);
    return NextResponse.json(
      { error: "Could not send your message. Please try again or call us." },
      { status: 500 },
    );
  }
}
