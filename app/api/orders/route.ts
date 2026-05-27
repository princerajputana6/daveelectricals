import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getSession } from "@/lib/auth";
import { findProduct, toPence, currency as cur } from "@/lib/products";
import { getRazorpay } from "@/lib/razorpay";
import { ordersCol, publicOrder, type Order } from "@/lib/orders";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Please sign in to place an order." },
        { status: 401 },
      );
    }

    const body = await req.json();
    const { items, customer, paymentMode: rawMode } = body || {};
    const paymentMode: "split" | "full" =
      rawMode === "full" ? "full" : "split";

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Your cart is empty." },
        { status: 400 },
      );
    }
    if (
      !customer ||
      !customer.name ||
      !customer.email ||
      !customer.phone ||
      !customer.address
    ) {
      return NextResponse.json(
        { error: "Please complete your contact details." },
        { status: 400 },
      );
    }

    const orderItems = [];
    let subtotal = 0;
    for (const it of items) {
      const product = findProduct(it.productId);
      if (!product) continue;
      const qty = Math.max(1, Math.min(50, Number(it.qty) || 1));
      const lineTotal = +(product.price * qty).toFixed(2);
      subtotal += lineTotal;
      orderItems.push({
        productId: product.id,
        name: product.shortName,
        unit: product.unit,
        unitPrice: product.price,
        qty,
        lineTotal,
      });
    }
    subtotal = +subtotal.toFixed(2);
    if (orderItems.length === 0 || subtotal <= 0) {
      return NextResponse.json(
        { error: "Cart items are invalid." },
        { status: 400 },
      );
    }
    const deposit = +(subtotal / 2).toFixed(2);
    const balance = +(subtotal - deposit).toFixed(2);

    const col = await ordersCol();
    const _id = new ObjectId();

    // Amount the user is paying upfront — either 50% deposit or 100% full
    const upfrontAmount = paymentMode === "full" ? subtotal : deposit;

    const rzp = getRazorpay();
    const rzpOrder = await rzp.orders.create({
      amount: toPence(upfrontAmount),
      currency: cur.code,
      receipt: `${paymentMode === "full" ? "fp" : "dp"}_${_id.toString().slice(-12)}`,
      notes: {
        type: paymentMode === "full" ? "full" : "deposit",
        appOrderId: _id.toString(),
        userId: session.uid,
      },
    });

    const now = new Date();
    const doc: Order = {
      _id,
      userId: session.uid,
      customer: {
        name: String(customer.name).trim(),
        email: String(customer.email).trim().toLowerCase(),
        phone: String(customer.phone).trim(),
        address: String(customer.address).trim(),
        notes: customer.notes ? String(customer.notes).trim() : undefined,
      },
      items: orderItems,
      subtotal,
      deposit,
      balance,
      currency: cur.code,
      paymentMode,
      status: paymentMode === "full" ? "pending_payment" : "pending_deposit",
      payments: {
        deposit: {
          razorpayOrderId: rzpOrder.id,
          amount: upfrontAmount,
          currency: cur.code,
          status: "created",
          createdAt: now,
        },
      },
      createdAt: now,
      updatedAt: now,
    };
    await col.insertOne(doc);

    return NextResponse.json({
      ok: true,
      order: publicOrder(doc),
      razorpay: {
        keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        orderId: rzpOrder.id,
        amount: toPence(upfrontAmount),
        currency: cur.code,
      },
    });
  } catch (err) {
    console.error("[orders POST]", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Could not create order. Please try again.",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ orders: [] });
  }
  const col = await ordersCol();
  const list = await col
    .find({ userId: session.uid })
    .sort({ createdAt: -1 })
    .limit(50)
    .toArray();
  return NextResponse.json({ orders: list.map(publicOrder) });
}
