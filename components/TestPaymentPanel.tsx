"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "./CartProvider";
import { findProduct, formatGBP } from "@/lib/products";
import { CheckIcon, ArrowIcon } from "./Icons";

const TEST_PRODUCT_ID = "test-payment";

export default function TestPaymentPanel() {
  const product = findProduct(TEST_PRODUCT_ID);
  const { add } = useCart();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  if (!product) {
    return (
      <p className="text-sm text-red-400">
        Test product not found. Check lib/products.ts.
      </p>
    );
  }

  const goToCheckout = () => {
    setBusy(true);
    add(product.id, undefined, 1);
    // Give the cart state a tick to persist before we navigate.
    setTimeout(() => router.push("/checkout"), 150);
  };

  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-white/10 bg-graphite p-7">
      <span className="inline-flex items-center rounded-full bg-bolt/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-bolt ring-1 ring-bolt/20">
        {product.badge}
      </span>

      <h2 className="mt-4 font-display text-2xl font-bold text-white">
        {product.name}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-ash">
        {product.description}
      </p>

      <ul className="mt-5 space-y-2.5">
        {product.highlights.map((h) => (
          <li key={h} className="flex items-start gap-2.5 text-sm text-zinc-200">
            <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-bolt" />
            {h}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-end justify-between gap-4 border-t border-white/10 pt-5">
        <div>
          <p className="font-display text-4xl font-bold text-gradient-bolt">
            {formatGBP(product.price ?? 0)}
          </p>
          <p className="mt-0.5 text-[11px] uppercase tracking-wider text-ash">
            {product.unit} · live charge
          </p>
        </div>
        <button
          type="button"
          onClick={goToCheckout}
          disabled={busy}
          className="group inline-flex items-center gap-2 rounded-full bg-bolt px-6 py-3 font-bold text-ink transition-transform hover:scale-[1.04] disabled:opacity-60"
        >
          {busy ? "Adding…" : "Add & go to checkout"}
          <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      <p className="mt-5 rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-xs leading-relaxed text-amber-200/90">
        <strong>Heads up:</strong> Stripe is in <strong>live</strong> mode, so
        this charges a real £1. At checkout, choose{" "}
        <strong>“Pay in full”</strong> to pay exactly £1 (the 50% option would
        take £0.50). You must be signed in to place the order. Refund it
        afterwards from the Stripe dashboard.
      </p>

      <p className="mt-4 text-center text-xs text-ash">
        Already added it?{" "}
        <Link href="/checkout" className="text-bolt underline">
          Go straight to checkout
        </Link>
      </p>
    </div>
  );
}
