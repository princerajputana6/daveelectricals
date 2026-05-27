"use client";

import { motion } from "framer-motion";
import { products, formatGBP } from "@/lib/products";
import { serviceIcons, CheckIcon, BoltIcon } from "./Icons";
import AddToCartButton from "./AddToCartButton";

export default function ShopHighlights() {
  return (
    <div className="grid gap-7 lg:grid-cols-2">
      {products.map((p, i) => {
        const Icon = serviceIcons[p.iconKey];
        return (
          <motion.article
            key={p.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, delay: i * 0.12 }}
            className="group relative flex flex-col overflow-hidden rounded-3xl border border-bolt/20 bg-gradient-to-br from-graphite via-coal to-ink p-8"
          >
            <div className="grid-bg pointer-events-none absolute inset-0 opacity-40" />
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-bolt/15 blur-3xl transition-all duration-500 group-hover:bg-bolt/30" />

            {p.badge && (
              <span className="relative w-fit rounded-full bg-bolt px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-ink">
                {p.badge}
              </span>
            )}

            <div className="relative mt-5 flex items-start justify-between gap-4">
              <div>
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-bolt">
                  <BoltIcon className="h-3.5 w-3.5" />
                  {p.tagline}
                </p>
                <h3 className="mt-2 font-display text-2xl font-bold leading-tight text-white sm:text-3xl">
                  {p.name}
                </h3>
              </div>
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-bolt/10 text-bolt ring-1 ring-bolt/20">
                {Icon && <Icon className="h-7 w-7" />}
              </span>
            </div>

            <p className="relative mt-4 text-sm leading-relaxed text-ash">
              {p.description}
            </p>

            <ul className="relative mt-5 space-y-2.5">
              {p.highlights.map((h) => (
                <li
                  key={h}
                  className="flex items-start gap-2.5 text-sm text-zinc-200"
                >
                  <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-bolt" />
                  {h}
                </li>
              ))}
            </ul>

            <div className="relative mt-7 flex flex-wrap items-end justify-between gap-5 border-t border-white/10 pt-6">
              <div>
                <p className="font-display text-4xl font-bold text-gradient-bolt">
                  {formatGBP(p.price)}
                </p>
                <p className="mt-0.5 text-xs uppercase tracking-wider text-ash">
                  {p.unit} · pay 50% now, 50% on completion
                </p>
              </div>
              <AddToCartButton productId={p.id} />
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}
