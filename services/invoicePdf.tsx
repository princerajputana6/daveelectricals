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

const company = {
  name: process.env.COMPANY_NAME || "Dave Electrical Services",
  email: process.env.COMPANY_EMAIL || "info@daveelectrical.co.uk",
  phone: process.env.COMPANY_PHONE || "02035244041",
  address:
    process.env.COMPANY_ADDRESS || "7 Nursery Gardens, Hounslow, London TW4 5EY",
  logo: process.env.COMPANY_LOGO_URL || "",
};

const gbp = (n: number) => `£${(n ?? 0).toFixed(2)}`;

const s = StyleSheet.create({
  page: { padding: 40, fontSize: 10, color: "#111", fontFamily: "Helvetica" },
  row: { flexDirection: "row", justifyContent: "space-between" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 3,
    borderBottomColor: "#e2e61f",
    paddingBottom: 12,
    marginBottom: 20,
  },
  logo: { width: 130, height: 44, objectFit: "contain" },
  brandName: { fontSize: 16, fontFamily: "Helvetica-Bold" },
  muted: { color: "#666" },
  invoiceTitle: { fontSize: 22, fontFamily: "Helvetica-Bold", textAlign: "right" },
  section: { marginBottom: 18 },
  label: {
    fontSize: 8,
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 3,
  },
  tableHead: {
    flexDirection: "row",
    backgroundColor: "#111",
    color: "#fff",
    paddingVertical: 6,
    paddingHorizontal: 8,
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  colDesc: { flex: 1 },
  colQty: { width: 40, textAlign: "center" },
  colAmt: { width: 80, textAlign: "right" },
  totals: { marginTop: 12, marginLeft: "auto", width: 220 },
  totalLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
  },
  grandTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: "#111",
    marginTop: 4,
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
  },
  paidBadge: {
    marginTop: 16,
    alignSelf: "flex-start",
    backgroundColor: "#e6f4ea",
    color: "#137333",
    borderWidth: 1,
    borderColor: "#137333",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
    fontFamily: "Helvetica-Bold",
  },
  meta: { fontSize: 9, marginBottom: 2 },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 8,
    fontSize: 8,
    color: "#999",
    textAlign: "center",
  },
});

function InvoiceDoc({ order }: { order: Order }) {
  const paidAt = order.payments.deposit?.paidAt || order.createdAt;
  const invoiceDate = new Date(paidAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const stripeTxn =
    order.payments.deposit?.stripePaymentIntentId ||
    order.payments.deposit?.stripeSessionId ||
    "—";
  const total = order.total ?? order.subtotal;

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <View>
            {company.logo ? (
              <Image src={company.logo} style={s.logo} />
            ) : (
              <Text style={s.brandName}>{company.name}</Text>
            )}
            <Text style={[s.muted, { marginTop: 6 }]}>{company.address}</Text>
            <Text style={s.muted}>{company.phone}</Text>
            <Text style={s.muted}>{company.email}</Text>
          </View>
          <View>
            <Text style={s.invoiceTitle}>INVOICE</Text>
            <Text style={[s.meta, { textAlign: "right", marginTop: 6 }]}>
              {order.invoiceNumber || "—"}
            </Text>
            <Text style={[s.meta, s.muted, { textAlign: "right" }]}>
              {invoiceDate}
            </Text>
          </View>
        </View>

        <View style={[s.row, s.section]}>
          <View style={{ flex: 1 }}>
            <Text style={s.label}>Bill to</Text>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>
              {order.customer.name}
            </Text>
            <Text style={s.muted}>{order.customer.email}</Text>
            <Text style={s.muted}>{order.customer.phone}</Text>
            <Text style={s.muted}>{order.customer.address}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.label}>Payment</Text>
            <Text style={s.meta}>Stripe txn: {stripeTxn}</Text>
            {order.quickbooks?.invoiceId ? (
              <Text style={s.meta}>QB invoice: {order.quickbooks.invoiceId}</Text>
            ) : null}
            <Text style={s.meta}>Method: Stripe (card)</Text>
          </View>
        </View>

        <View style={s.tableHead}>
          <Text style={s.colDesc}>Description</Text>
          <Text style={s.colQty}>Qty</Text>
          <Text style={s.colAmt}>Amount</Text>
        </View>
        {order.items.map((it, i) => (
          <View style={s.tableRow} key={i}>
            <Text style={s.colDesc}>
              {it.name}
              {it.variantLabel ? ` — ${it.variantLabel}` : ""}
            </Text>
            <Text style={s.colQty}>{it.qty}</Text>
            <Text style={s.colAmt}>{gbp(it.lineTotal)}</Text>
          </View>
        ))}

        <View style={s.totals}>
          <View style={s.totalLine}>
            <Text style={s.muted}>Subtotal (ex VAT)</Text>
            <Text>{gbp(order.subtotal)}</Text>
          </View>
          <View style={s.totalLine}>
            <Text style={s.muted}>VAT ({order.vatRate ?? 0}%)</Text>
            <Text>{gbp(order.vatAmount ?? 0)}</Text>
          </View>
          <View style={s.grandTotal}>
            <Text>Total</Text>
            <Text>{gbp(total)}</Text>
          </View>
          {order.paymentMode !== "full" ? (
            <View style={[s.totalLine, { marginTop: 4 }]}>
              <Text style={s.muted}>Deposit paid</Text>
              <Text>{gbp(order.deposit)}</Text>
            </View>
          ) : null}
        </View>

        <Text style={s.paidBadge}>PAYMENT STATUS: PAID</Text>

        <Text style={s.footer}>
          {company.name} · {company.phone} · {company.email} — Thank you for your
          business.
        </Text>
      </Page>
    </Document>
  );
}

/** Render the invoice to a PDF Buffer. */
export async function renderInvoicePdf(order: Order): Promise<Buffer> {
  return renderToBuffer(<InvoiceDoc order={order} />);
}
