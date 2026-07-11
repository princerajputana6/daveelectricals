import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getSession } from "@/lib/auth";
import { findProduct, priceFor, toPence, currency as cur } from "@/lib/products";
import { getStripe } from "@/lib/stripe";
import { ordersCol, publicOrder, type Order } from "@/lib/orders";
import { claimSlot, releaseSlot } from "@/lib/slots";

export const runtime = "nodejs";

/** Slot bookings are always same-day emergency call-outs, paid in full. */
const BOOKING_PRODUCT_ID = "same-day-call-out";

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
    const { items, customer, paymentMode: rawMode, slotId } = body || {};
    const isBooking = typeof slotId === "string" && slotId.length > 0;
    // Slot bookings are one-time full payments (no 50% split).
    const paymentMode: "split" | "full" =
      isBooking || rawMode === "full" ? "full" : "split";

    // A booking is always a single same-day emergency call-out.
    const orderInputItems = isBooking
      ? [{ productId: BOOKING_PRODUCT_ID, qty: 1 }]
      : items;

    if (!Array.isArray(orderInputItems) || orderInputItems.length === 0) {
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
      !customer.address ||
      !customer.preferredDate
    ) {
      return NextResponse.json(
        { error: "Please complete your contact, address and preferred date." },
        { status: 400 },
      );
    }

    const orderItems = [];
    let subtotal = 0;
    for (const it of orderInputItems) {
      const product = findProduct(it.productId);
      if (!product) continue;
      const qty = Math.max(1, Math.min(50, Number(it.qty) || 1));
      let unitPrice: number;
      let variantLabel: string | undefined;
      try {
        const r = priceFor(it.productId, it.variantId);
        unitPrice = r.price;
        variantLabel = product.variants ? r.label : undefined;
      } catch (e) {
        return NextResponse.json(
          {
            error:
              e instanceof Error
                ? e.message
                : "Invalid product configuration.",
          },
          { status: 400 },
        );
      }
      const lineTotal = +(unitPrice * qty).toFixed(2);
      subtotal += lineTotal;
      orderItems.push({
        productId: product.id,
        variantId: it.variantId,
        variantLabel,
        name: product.shortName,
        unit: product.unit,
        unitPrice,
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

    // For a slot booking, atomically claim the slot *before* taking payment so
    // two customers can never book the same slot (Sr21).
    let booking: Order["booking"];
    if (isBooking) {
      const claimed = await claimSlot(slotId, _id.toString(), session.uid);
      if (!claimed) {
        return NextResponse.json(
          { error: "Sorry, that slot has just been booked. Please pick another." },
          { status: 409 },
        );
      }
      booking = { slotId, date: claimed.date, time: claimed.time };
    }

    // Amount the user is paying upfront — either 50% deposit or 100% full
    const upfrontAmount = paymentMode === "full" ? subtotal : deposit;
    const kind = paymentMode === "full" ? "full" : "deposit";

    const now = new Date();
    const email = String(customer.email).trim().toLowerCase();

    // Create the Stripe Checkout Session for the upfront charge.
    const origin =
      req.headers.get("origin") || new URL(req.url).origin;
    const stripe = getStripe();
    let checkoutSession;
    try {
      checkoutSession = await stripe.checkout.sessions.create({
        mode: "payment",
        customer_email: email,
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: cur.code.toLowerCase(),
              unit_amount: toPence(upfrontAmount),
              product_data: {
                name: isBooking
                  ? "Dave Electrical — same-day emergency booking"
                  : paymentMode === "full"
                    ? "Dave Electrical — full payment"
                    : "Dave Electrical — 50% deposit",
                description: booking
                  ? `Same-day emergency call-out · ${booking.date} ${booking.time}`
                  : orderItems
                      .map((i) => `${i.qty}× ${i.name}`)
                      .join(", ")
                      .slice(0, 250),
              },
            },
          },
        ],
        metadata: { appOrderId: _id.toString(), kind, userId: session.uid },
        payment_intent_data: {
          metadata: { appOrderId: _id.toString(), kind },
        },
        success_url: `${origin}/api/orders/${_id.toString()}/confirm?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: isBooking
          ? `${origin}/book?cancelled=1`
          : `${origin}/checkout?cancelled=1`,
      });
    } catch (e) {
      // Payment session couldn't be created — free the held slot again.
      if (isBooking) await releaseSlot(slotId);
      throw e;
    }

    const doc: Order = {
      _id,
      userId: session.uid,
      customer: {
        name: String(customer.name).trim(),
        email,
        phone: String(customer.phone).trim(),
        address: String(customer.address).trim(),
        preferredDate: String(customer.preferredDate).trim(),
        notes: customer.notes ? String(customer.notes).trim() : undefined,
        accessDetails: customer.accessDetails
          ? String(customer.accessDetails).trim()
          : undefined,
        keyCollection: customer.keyCollection
          ? String(customer.keyCollection).trim()
          : undefined,
      },
      items: orderItems,
      subtotal,
      deposit,
      balance,
      currency: cur.code,
      paymentMode,
      booking,
      status: paymentMode === "full" ? "pending_payment" : "pending_deposit",
      payments: {
        deposit: {
          stripeSessionId: checkoutSession.id,
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
      checkoutUrl: checkoutSession.url,
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
