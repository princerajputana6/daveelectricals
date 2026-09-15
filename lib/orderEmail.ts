import type { Order } from "@/lib/orders";
import { formatGBP } from "@/lib/products";

/**
 * Builds the "new booking" notification that goes to the business inbox
 * whenever a customer places an order. Includes every detail the office needs
 * to action the job: customer contact, service address, items, totals, access
 * details and any booked slot.
 */
export function orderNotificationEmail(order: Order): {
  subject: string;
  text: string;
  html: string;
} {
  const ref = order._id.toString().slice(-6).toUpperCase();
  const c = order.customer;

  // Render an ISO yyyy-mm-dd date as dd-mm-yyyy (leaves anything else as-is).
  const ukDate = (d?: string) =>
    d && /^\d{4}-\d{2}-\d{2}$/.test(d)
      ? `${d.slice(8, 10)}-${d.slice(5, 7)}-${d.slice(0, 4)}`
      : d || "";

  const itemsText = order.items
    .map(
      (i) =>
        `  • ${i.qty} × ${i.name}${
          i.variantLabel ? ` (${i.variantLabel})` : ""
        } — ${formatGBP(i.lineTotal)}`,
    )
    .join("\n");

  const grandTotal = order.total ?? order.subtotal;
  const payLine =
    order.paymentMode === "full"
      ? `Pay in full: ${formatGBP(grandTotal)}`
      : `50% deposit: ${formatGBP(order.deposit)} now, ${formatGBP(
          order.balance,
        )} on completion`;

  const bookingLine = order.booking
    ? `Booked slot: ${ukDate(order.booking.date)} ${order.booking.time}\n`
    : "";

  const lines = [
    `New booking #${ref}`,
    "",
    "CUSTOMER",
    `  Name:  ${c.name}`,
    `  Email: ${c.email}`,
    `  Phone: ${c.phone}`,
    "",
    "SERVICE",
    `  Address:        ${c.address}`,
    `  Preferred date: ${ukDate(c.preferredDate)}`,
    bookingLine ? `  ${bookingLine.trim()}` : "",
    c.notes ? `  Notes:          ${c.notes}` : "",
    c.accessDetails ? `  Access details: ${c.accessDetails}` : "",
    c.keyCollection ? `  Key collection: ${c.keyCollection}` : "",
    "",
    "ITEMS",
    itemsText,
    "",
    `Subtotal (ex VAT): ${formatGBP(order.subtotal)}`,
    `VAT (${order.vatRate ?? 0}%): ${formatGBP(order.vatAmount ?? 0)}`,
    `Total (inc VAT): ${formatGBP(grandTotal)}`,
    payLine,
    "",
    `Placed: ${new Date(order.createdAt).toLocaleString("en-GB")}`,
    `Status: ${order.status}`,
  ].filter((l) => l !== "");

  const text = lines.join("\n");

  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const row = (label: string, value: string) =>
    `<tr><td style="padding:4px 12px 4px 0;color:#666;white-space:nowrap;vertical-align:top">${label}</td><td style="padding:4px 0;color:#111">${esc(
      value,
    )}</td></tr>`;

  const itemsHtml = order.items
    .map(
      (i) =>
        `<tr><td style="padding:6px 0;border-bottom:1px solid #eee">${i.qty} × ${esc(
          i.name,
        )}${
          i.variantLabel
            ? ` <span style="color:#888">(${esc(i.variantLabel)})</span>`
            : ""
        }</td><td style="padding:6px 0;border-bottom:1px solid #eee;text-align:right;white-space:nowrap">${formatGBP(
          i.lineTotal,
        )}</td></tr>`,
    )
    .join("");

  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;color:#111">
    <div style="background:#0a0a0a;padding:18px 24px;border-radius:10px 10px 0 0">
      <span style="color:#e2e61f;font-size:13px;letter-spacing:2px;text-transform:uppercase">New booking</span>
      <h1 style="color:#fff;margin:6px 0 0;font-size:22px">Order #${ref}</h1>
    </div>
    <div style="border:1px solid #eee;border-top:none;border-radius:0 0 10px 10px;padding:24px">
      <h2 style="font-size:14px;text-transform:uppercase;color:#888;margin:0 0 8px">Customer</h2>
      <table style="font-size:14px;border-collapse:collapse">
        ${row("Name", c.name)}
        ${row("Email", c.email)}
        ${row("Phone", c.phone)}
      </table>

      <h2 style="font-size:14px;text-transform:uppercase;color:#888;margin:20px 0 8px">Service</h2>
      <table style="font-size:14px;border-collapse:collapse">
        ${row("Address", c.address)}
        ${row("Preferred date", ukDate(c.preferredDate))}
        ${order.booking ? row("Booked slot", `${ukDate(order.booking.date)} ${order.booking.time}`) : ""}
        ${c.notes ? row("Notes", c.notes) : ""}
        ${c.accessDetails ? row("Access details", c.accessDetails) : ""}
        ${c.keyCollection ? row("Key collection", c.keyCollection) : ""}
      </table>

      <h2 style="font-size:14px;text-transform:uppercase;color:#888;margin:20px 0 8px">Items</h2>
      <table style="width:100%;font-size:14px;border-collapse:collapse">
        ${itemsHtml}
        <tr><td style="padding:10px 0 0">Subtotal (ex VAT)</td><td style="padding:10px 0 0;text-align:right">${formatGBP(
          order.subtotal,
        )}</td></tr>
        <tr><td style="padding:2px 0;color:#666">VAT (${order.vatRate ?? 0}%)</td><td style="padding:2px 0;text-align:right;color:#666">${formatGBP(
          order.vatAmount ?? 0,
        )}</td></tr>
        <tr><td style="padding:2px 0;font-weight:bold">Total (inc VAT)</td><td style="padding:2px 0;text-align:right;font-weight:bold">${formatGBP(
          grandTotal,
        )}</td></tr>
      </table>
      <p style="font-size:14px;color:#333;margin:14px 0 0">${esc(payLine)}</p>
      <p style="font-size:12px;color:#999;margin:18px 0 0">Placed ${new Date(
        order.createdAt,
      ).toLocaleString("en-GB")} · status: ${order.status}</p>
    </div>
  </div>`;

  return { subject: `New booking #${ref} — ${c.name}`, text, html };
}
