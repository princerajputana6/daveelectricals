import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";
import type { Order } from "@/lib/orders";
import { INVOICE_LOGO_DATA_URI } from "@/lib/invoiceLogo";

const company = {
  name: process.env.COMPANY_NAME || "Dave Electrical Services",
  legalName:
    process.env.COMPANY_LEGAL_NAME ||
    process.env.COMPANY_NAME ||
    "Dave Electrical Services Limited",
  email: process.env.COMPANY_EMAIL || "info@daveelectrical.co.uk",
  phone: process.env.COMPANY_PHONE || "02035244041",
  address:
    process.env.COMPANY_ADDRESS || "7 Nursery Gardens, Hounslow, London TW4 5EY",
  // Website logo, embedded as a data URI. An env override still wins if set.
  logo: process.env.COMPANY_LOGO_URL || INVOICE_LOGO_DATA_URI,
  // Optional — only rendered when set. Required for a valid UK VAT invoice.
  vatNumber: process.env.COMPANY_VAT_NUMBER || "",
  regNumber: process.env.COMPANY_REG_NUMBER || "",
};

const gbp = (n: number) => `£${(n ?? 0).toFixed(2)}`;

const BOLT = "#e2e61f";
const INK = "#0a0a0a";

const s = StyleSheet.create({
  page: {
    paddingHorizontal: 44,
    paddingTop: 40,
    paddingBottom: 70,
    fontSize: 10,
    color: "#1a1a1a",
    fontFamily: "Helvetica",
    lineHeight: 1.4,
  },
  headerBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  brandBlock: { flexDirection: "row", alignItems: "center" },
  logoMark: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: INK,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  logoMonogram: { color: BOLT, fontSize: 13, fontFamily: "Helvetica-Bold" },
  logoImg: { width: 124, height: 64, objectFit: "contain" },
  brandName: { fontSize: 15, fontFamily: "Helvetica-Bold", color: INK },
  brandSub: { fontSize: 8, color: "#777", marginTop: 1 },
  invoiceTitle: {
    fontSize: 26,
    fontFamily: "Helvetica-Bold",
    color: INK,
    textAlign: "right",
    letterSpacing: 1,
  },
  statusPaid: {
    marginTop: 6,
    alignSelf: "flex-end",
    backgroundColor: "#e6f4ea",
    color: "#137333",
    borderWidth: 1,
    borderColor: "#8fce9f",
    paddingVertical: 3,
    paddingHorizontal: 9,
    borderRadius: 20,
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
  },
  statusPartial: {
    marginTop: 6,
    alignSelf: "flex-end",
    backgroundColor: "#fff4e5",
    color: "#8a5a00",
    borderWidth: 1,
    borderColor: "#e6c07a",
    paddingVertical: 3,
    paddingHorizontal: 9,
    borderRadius: 20,
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
  },
  rule: { height: 3, backgroundColor: BOLT, marginTop: 14, marginBottom: 18 },
  cols: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 22,
  },
  col: { width: "48%" },
  label: {
    fontSize: 7.5,
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  strong: { fontFamily: "Helvetica-Bold", color: INK, marginBottom: 2 },
  muted: { color: "#666", marginBottom: 1 },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  metaKey: { color: "#666" },
  metaVal: { fontFamily: "Helvetica-Bold", color: INK },
  tHead: {
    flexDirection: "row",
    backgroundColor: INK,
    color: "#fff",
    paddingVertical: 7,
    paddingHorizontal: 9,
    fontFamily: "Helvetica-Bold",
    fontSize: 8.5,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 9,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  cNo: { width: 22 },
  cDesc: { flex: 1 },
  cQty: { width: 34, textAlign: "center" },
  cUnit: { width: 70, textAlign: "right" },
  cVat: { width: 44, textAlign: "right" },
  cAmt: { width: 72, textAlign: "right" },
  totals: { marginTop: 16, marginLeft: "auto", width: 240 },
  tLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  grand: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: INK,
    color: "#fff",
    borderRadius: 6,
    marginTop: 6,
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
  },
  payLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    marginTop: 2,
  },
  notesBox: {
    marginTop: 28,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 6,
    padding: 12,
    backgroundColor: "#fafafa",
  },
  notesTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    marginBottom: 4,
    color: INK,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 44,
    right: 44,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 8,
    fontSize: 7.5,
    color: "#999",
    textAlign: "center",
  },
});

function InvoiceDoc({ order }: { order: Order }) {
  const paidAt = order.payments.deposit?.paidAt || order.createdAt;
  const invoiceDate = new Date(paidAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const total = order.total ?? order.subtotal;

  const depositPaid = order.payments.deposit?.status === "paid";
  const balancePaid = order.payments.balance?.status === "paid";
  const fullyPaid = order.paymentMode === "full" ? depositPaid : balancePaid;
  const amountPaid = fullyPaid
    ? total
    : depositPaid
      ? order.deposit
      : 0;
  const balanceDue = Math.max(0, total - amountPaid);
  const statusLabel = fullyPaid
    ? "PAID IN FULL"
    : depositPaid
      ? "DEPOSIT PAID"
      : "UNPAID";

  const stripeTxn =
    order.payments.deposit?.stripePaymentIntentId ||
    order.payments.deposit?.stripeSessionId ||
    "—";

  const footerBits = [
    company.legalName,
    company.address,
    company.phone,
    company.email,
    company.vatNumber ? `VAT ${company.vatNumber}` : "",
  ].filter(Boolean);

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.headerBar}>
          <View style={s.brandBlock}>
            {company.logo ? (
              <Image src={company.logo} style={s.logoImg} />
            ) : (
              <>
                <View style={s.logoMark}>
                  <Text style={s.logoMonogram}>DE</Text>
                </View>
                <View>
                  <Text style={s.brandName}>{company.name}</Text>
                  <Text style={s.brandSub}>NAPIT Registered Electricians</Text>
                </View>
              </>
            )}
          </View>
          <View>
            <Text style={s.invoiceTitle}>INVOICE</Text>
            <Text style={fullyPaid ? s.statusPaid : s.statusPartial}>
              {statusLabel}
            </Text>
          </View>
        </View>
        <View style={s.rule} />

        {/* From / Bill-to / meta */}
        <View style={s.cols}>
          <View style={s.col}>
            <Text style={s.label}>From</Text>
            <Text style={s.strong}>{company.legalName}</Text>
            <Text style={s.muted}>{company.address}</Text>
            <Text style={s.muted}>Tel: {company.phone}</Text>
            <Text style={s.muted}>{company.email}</Text>
            {company.vatNumber ? (
              <Text style={[s.muted, { marginTop: 4 }]}>
                VAT Reg No: {company.vatNumber}
              </Text>
            ) : null}
            {company.regNumber ? (
              <Text style={s.muted}>Company Reg No: {company.regNumber}</Text>
            ) : null}
          </View>
          <View style={s.col}>
            <View style={s.metaRow}>
              <Text style={s.metaKey}>Invoice number</Text>
              <Text style={s.metaVal}>{order.invoiceNumber || "—"}</Text>
            </View>
            <View style={s.metaRow}>
              <Text style={s.metaKey}>Invoice date</Text>
              <Text style={s.metaVal}>{invoiceDate}</Text>
            </View>
            <View style={s.metaRow}>
              <Text style={s.metaKey}>Tax point</Text>
              <Text style={s.metaVal}>{invoiceDate}</Text>
            </View>
            <View style={s.metaRow}>
              <Text style={s.metaKey}>Payment method</Text>
              <Text style={s.metaVal}>Card (Stripe)</Text>
            </View>
            <View style={[s.metaRow, { marginTop: 8 }]}>
              <Text style={s.label}>Bill to</Text>
            </View>
            <Text style={s.strong}>{order.customer.name}</Text>
            <Text style={s.muted}>{order.customer.address}</Text>
            <Text style={s.muted}>{order.customer.email}</Text>
            <Text style={s.muted}>{order.customer.phone}</Text>
          </View>
        </View>

        {/* Items */}
        <View style={s.tHead}>
          <Text style={s.cNo}>#</Text>
          <Text style={s.cDesc}>Description</Text>
          <Text style={s.cQty}>Qty</Text>
          <Text style={s.cUnit}>Unit price</Text>
          <Text style={s.cVat}>VAT</Text>
          <Text style={s.cAmt}>Amount</Text>
        </View>
        {order.items.map((it, i) => (
          <View style={s.tRow} key={i}>
            <Text style={s.cNo}>{i + 1}</Text>
            <Text style={s.cDesc}>
              {it.name}
              {it.variantLabel ? ` — ${it.variantLabel}` : ""}
            </Text>
            <Text style={s.cQty}>{it.qty}</Text>
            <Text style={s.cUnit}>{gbp(it.unitPrice)}</Text>
            <Text style={s.cVat}>{order.vatRate ?? 0}%</Text>
            <Text style={s.cAmt}>{gbp(it.lineTotal)}</Text>
          </View>
        ))}

        {/* Totals */}
        <View style={s.totals}>
          <View style={s.tLine}>
            <Text style={s.metaKey}>Subtotal (excl. VAT)</Text>
            <Text>{gbp(order.subtotal)}</Text>
          </View>
          <View style={s.tLine}>
            <Text style={s.metaKey}>VAT @ {order.vatRate ?? 0}%</Text>
            <Text>{gbp(order.vatAmount ?? 0)}</Text>
          </View>
          <View style={s.grand}>
            <Text>Total</Text>
            <Text>{gbp(total)}</Text>
          </View>
          <View style={s.payLine}>
            <Text style={s.metaKey}>Amount paid</Text>
            <Text style={{ fontFamily: "Helvetica-Bold", color: "#137333" }}>
              {gbp(amountPaid)}
            </Text>
          </View>
          <View style={s.payLine}>
            <Text style={s.metaKey}>Balance due</Text>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>
              {gbp(balanceDue)}
            </Text>
          </View>
        </View>

        {/* Notes */}
        <View style={s.notesBox}>
          <Text style={s.notesTitle}>Notes</Text>
          <Text style={s.muted}>
            {fullyPaid
              ? "Thank you for your business. This invoice has been paid in full — no action is required. "
              : `Thank you for your business. A deposit of ${gbp(
                  amountPaid,
                )} has been received; the remaining balance of ${gbp(
                  balanceDue,
                )} is due on completion. `}
            All work is covered by our 12-month workmanship guarantee. Please
            retain this invoice for your records.
          </Text>
          <Text style={[s.muted, { marginTop: 6, fontSize: 8 }]}>
            Stripe transaction: {stripeTxn}
            {order.quickbooks?.invoiceId
              ? `   ·   QuickBooks ref: ${order.quickbooks.invoiceId}`
              : ""}
          </Text>
        </View>

        {/* Footer */}
        <Text style={s.footer}>{footerBits.join("  ·  ")}</Text>
      </Page>
    </Document>
  );
}

/** Render the invoice to a PDF Buffer. */
export async function renderInvoicePdf(order: Order): Promise<Buffer> {
  return renderToBuffer(<InvoiceDoc order={order} />);
}
