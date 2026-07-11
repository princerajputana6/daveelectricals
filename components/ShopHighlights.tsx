"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { products, formatGBP, type Product } from "@/lib/products";
import { serviceIcons, CheckIcon, BoltIcon, ArrowIcon } from "./Icons";
import AddToCartButton from "./AddToCartButton";
import EicrConfigurator from "./EicrConfigurator";
import EmergencyLightConfigurator from "./EmergencyLightConfigurator";
import FireAlarmConfigurator from "./FireAlarmConfigurator";

function ProductCard({ product, index }: { product: Product; index: number }) {
  const Icon = serviceIcons[product.iconKey];
  const [variantId, setVariantId] = useState<string | undefined>(
    product.variants?.[0]?.id,
  );

  const variant = product.variants?.find((v) => v.id === variantId);
  const currentPrice = variant?.price ?? product.price ?? 0;
  const requiresVariant = !!product.variants && product.variants.length > 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay: (index % 3) * 0.08 }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-bolt/20 bg-gradient-to-br from-graphite via-coal to-ink p-7"
    >
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-40" />
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-bolt/15 blur-3xl transition-all duration-500 group-hover:bg-bolt/30" />

      {product.badge && (
        <span className="relative w-fit rounded-full bg-bolt px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-ink">
          {product.badge}
        </span>
      )}

      <div className="relative mt-4 flex items-start justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-bolt">
            <BoltIcon className="h-3.5 w-3.5" />
            {product.tagline}
          </p>
          <h3 className="mt-2 font-display text-xl font-bold leading-tight text-white sm:text-2xl">
            {product.name}
          </h3>
        </div>
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-bolt/10 text-bolt ring-1 ring-bolt/20">
          {Icon && <Icon className="h-6 w-6" />}
        </span>
      </div>

      <p className="relative mt-3 text-sm leading-relaxed text-ash">
        {product.description}
      </p>

      <ul className="relative mt-4 space-y-2">
        {product.highlights.map((h) => (
          <li
            key={h}
            className="flex items-start gap-2.5 text-xs text-zinc-200"
          >
            <CheckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-bolt" />
            {h}
          </li>
        ))}
      </ul>

      {/* Same-day emergency is booked by slot (Sr21) — no cart, pay in full */}
      {product.id === "same-day-call-out" ? (
        <div className="relative mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-white/10 pt-5">
          <div>
            <p className="font-display text-3xl font-bold text-gradient-bolt sm:text-4xl">
              {formatGBP(product.price ?? 0)}
            </p>
            <p className="mt-0.5 text-[11px] uppercase tracking-wider text-ash">
              {product.unit} · ex VAT · pay in full
            </p>
          </div>
          <Link
            href="/book"
            className="group flex items-center gap-2 rounded-full bg-bolt px-6 py-3 font-bold text-ink transition-transform hover:scale-[1.04] no-underline"
          >
            Book your slot
            <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      ) : product.id === "eicr" ? (
        <div className="relative">
          <EicrConfigurator />
        </div>
      ) : product.id === "emergency-light-testing" ? (
        <div className="relative">
          <EmergencyLightConfigurator />
        </div>
      ) : product.id === "fire-alarm-testing" ? (
        <div className="relative">
          <FireAlarmConfigurator />
        </div>
      ) : (
        <>
          {requiresVariant && (
            <div className="relative mt-5">
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-ash">
                {product.variantLabel}
              </label>
              <select
                value={variantId}
                onChange={(e) => setVariantId(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-ink px-4 py-2.5 text-sm text-white focus:border-bolt/60 focus:outline-none focus:ring-2 focus:ring-bolt/20"
              >
                {product.variants!.map((v) => (
                  <option key={v.id} value={v.id} className="bg-ink">
                    {v.label} · {formatGBP(v.price)}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="relative mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-white/10 pt-5">
            <div>
              <p className="font-display text-3xl font-bold text-gradient-bolt sm:text-4xl">
                {formatGBP(currentPrice)}
              </p>
              <p className="mt-0.5 text-[11px] uppercase tracking-wider text-ash">
                {product.unit} · ex VAT · pay 50% now
              </p>
            </div>
            <AddToCartButton productId={product.id} variantId={variantId} />
          </div>
        </>
      )}
    </motion.article>
  );
}

export default function ShopHighlights() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} index={i} />
      ))}
    </div>
  );
}
