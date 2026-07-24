import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getSession, isAdminSession } from "@/lib/auth";
import { ordersCol } from "@/lib/orders";
import { renderInvoicePdf } from "@/services/invoicePdf";

export const runtime = "nodejs";

/**
 * Streams the invoice PDF for an order, re-rendered from the order data so it
 * never depends on Cloudinary's raw-delivery setting. Access: the order's own
 * customer, or an admin.
 */
export async function GET(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  const { id } = await ctx.params;
  if (!session) {
    return NextResponse.redirect(
      new URL(`/login?next=/api/invoices/${id}`, req.url),
    );
  }
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const col = await ordersCol();
  const order = await col.findOne({ _id: new ObjectId(id) });
  if (!order) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (order.userId !== session.uid && !isAdminSession(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!order.invoiceNumber) {
    return NextResponse.json(
      { error: "No invoice has been generated for this order yet." },
      { status: 404 },
    );
  }

  const pdf = await renderInvoicePdf(order);
  return new NextResponse(new Uint8Array(pdf), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${order.invoiceNumber}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
