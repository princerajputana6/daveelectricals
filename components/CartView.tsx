"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "./CartProvider";
import { formatGBP } from "@/lib/products";
import { ArrowIcon, BagIcon, CloseIcon } from "./Icons";

export default function CartView() {
  const {
    lines,
    count,
    subtotal,
    vatRate,
    vatAmount,
    total,
    deposit,
    balance,
    setQty,
    remove,
    ready,
  } = useCart();

  if (!ready) {
    return (
      <div className="rounded-3xl border border-white/10 bg-graphite p-10 text-center text-ash">
        Loading your cart…
      </div>
    );
  }

  if (count === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-white/15 bg-graphite/60 p-12 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-bolt/10 text-bolt">
          <BagIcon className="h-6 w-6" />
        </span>
        <h2 className="mt-5 font-display text-2xl font-bold text-white">
          Your cart is empty
        </h2>
        <p className="mt-2 text-sm text-ash">
          Browse our bookable services to add an item.
        </p>
        <Link
          href="/services"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-bolt px-6 py-3 font-bold text-ink transition-transform hover:scale-[1.04]"
        >
          Browse services
          <ArrowIcon className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
      <div className="space-y-4">
        <AnimatePresence initial={false}>
          {lines.map((l) => (
            <motion.div
              key={l.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-graphite p-5 sm:flex-row sm:items-center"
            >
              <div className="flex-1">
                <p className="font-display text-lg font-bold text-white">
                  {l.name}
                </p>
                {l.variantLabel && (
                  <p className="text-xs uppercase tracking-wider text-bolt">
                    {l.variantLabel}
                  </p>
                )}
                <p className="mt-1 text-sm text-ash">
                  {formatGBP(l.price)} {l.unit}
                </p>
              </div>

              <div className="flex items-center gap-1 rounded-full border border-white/10 bg-ink p-1">
                <button
                  onClick={() => setQty(l.productId, l.variantId, l.qty - 1)}
                  aria-label="Decrease quantity"
                  className="h-8 w-8 rounded-full text-bolt transition-colors hover:bg-white/5"
                >
                  −
                </button>
                <span className="min-w-[28px] text-center font-bold text-white">
                  {l.qty}
                </span>
                <button
                  onClick={() => setQty(l.productId, l.variantId, l.qty + 1)}
                  aria-label="Increase quantity"
                  className="h-8 w-8 rounded-full text-bolt transition-colors hover:bg-white/5"
                >
                  +
                </button>
              </div>

              <p className="min-w-[80px] text-right font-display text-xl font-bold text-bolt">
                {formatGBP(l.lineTotal)}
              </p>

              <button
                onClick={() => remove(l.productId, l.variantId)}
                aria-label="Remove from cart"
                className="grid h-9 w-9 place-items-center rounded-lg text-ash transition-colors hover:bg-white/5 hover:text-red-400"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <aside className="h-fit rounded-2xl border border-white/10 bg-graphite p-7">
        <h2 className="font-display text-xl font-bold text-white">
          Order summary
        </h2>
        <dl className="mt-5 space-y-3 text-sm">
          <Row label="Subtotal (ex VAT)" value={formatGBP(subtotal)} />
          <Row label={`VAT (${vatRate}%)`} value={formatGBP(vatAmount)} />
          <Row label="Total (inc VAT)" value={formatGBP(total)} highlight />
          <Row
            label="Pay now (50% deposit)"
            value={formatGBP(deposit)}
          />
          <Row label="Pay on completion" value={formatGBP(balance)} />
        </dl>
        <Link
          href="/checkout"
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-bolt px-5 py-3.5 font-bold text-ink transition-transform hover:scale-[1.02]"
        >
          Checkout & pay deposit
          <ArrowIcon className="h-5 w-5" />
        </Link>
        <p className="mt-4 text-center text-[11px] text-ash">
          Secure payments via Stripe · GBP only
        </p>
      </aside>
    </div>
  );
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 pb-3 last:border-b-0">
      <dt className="text-ash">{label}</dt>
      <dd
        className={
          highlight
            ? "font-display text-xl font-bold text-bolt"
            : "font-semibold text-white"
        }
      >
        {value}
      </dd>
    </div>
  );
}
