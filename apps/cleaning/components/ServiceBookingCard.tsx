"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { serviceIcons, CheckIcon, ArrowIcon, BagIcon } from "./Icons";
import { useCart } from "./CartProvider";
import {
  findProduct,
  formatGBP,
  priceFrom,
  PROPERTY_SIZES,
  PROPERTY_SIZE_QUOTE,
} from "@/lib/products";

type Service = {
  slug: string;
  icon: string;
  title: string;
  short: string;
  body: string;
  points: string[];
};

export default function ServiceBookingCard({
  service,
  index,
  expanded = false,
}: {
  service: Service;
  index: number;
  expanded?: boolean;
}) {
  const Icon = serviceIcons[service.icon];
  const router = useRouter();
  const { add } = useCart();

  const product = findProduct(service.slug);
  const bookable = !!product?.variants?.length;
  const from = priceFrom(service.slug);

  const [open, setOpen] = useState(false);
  const [sizeId, setSizeId] = useState<string>(PROPERTY_SIZES[0].id);
  const [added, setAdded] = useState(false);

  const isQuote = sizeId === PROPERTY_SIZE_QUOTE.id;
  const selectedPrice =
    product?.variants?.find((v) => v.id === sizeId)?.price ?? null;

  const handleAdd = (thenCheckout: boolean) => {
    if (!product || isQuote || selectedPrice == null) return;
    add(product.id, sizeId, 1);
    if (thenCheckout) {
      router.push("/checkout");
      return;
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay: (index % 3) * 0.08 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-colors hover:border-bolt/40"
    >
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-bolt/0 blur-2xl transition-all duration-500 group-hover:bg-bolt/20" />
      <div className="absolute left-0 top-0 h-1 w-0 bg-bolt transition-all duration-500 group-hover:w-full" />

      <div className="relative flex items-center justify-between">
        <span className="grid h-14 w-14 place-items-center rounded-xl bg-bolt/10 text-bolt ring-1 ring-bolt/20 transition-colors group-hover:bg-bolt group-hover:text-white">
          {Icon && <Icon className="h-7 w-7" />}
        </span>
        <div className="text-right">
          {from != null ? (
            <>
              <p className="font-display text-2xl font-bold text-slate-900">
                From {formatGBP(from)}
              </p>
              <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                + VAT
              </p>
            </>
          ) : (
            <p className="font-display text-lg font-bold text-bolt">Get a quote</p>
          )}
        </div>
      </div>

      <h3 className="relative mt-6 font-display text-xl font-bold text-slate-900">
        {service.title}
      </h3>
      <p className="relative mt-3 text-sm leading-relaxed text-slate-500">
        {expanded ? service.body : service.short}
      </p>

      <ul className="relative mt-5 space-y-2.5">
        {service.points.slice(0, expanded ? 6 : 4).map((point) => (
          <li key={point} className="flex items-start gap-2.5 text-sm text-slate-600">
            <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-bolt" />
            {point}
          </li>
        ))}
      </ul>

      {/* Actions */}
      <div className="relative mt-6 pt-5">
        {bookable ? (
          <>
            {!open && (
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="group/btn inline-flex w-full items-center justify-center gap-2 rounded-full bg-bolt px-6 py-3 text-sm font-bold text-white transition-transform hover:scale-[1.03]"
              >
                Book this service
                <ArrowIcon className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
              </button>
            )}

            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Property size
                  </label>
                  <select
                    value={sizeId}
                    onChange={(e) => setSizeId(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 outline-none focus:border-bolt focus:ring-2 focus:ring-bolt/20"
                  >
                    {PROPERTY_SIZES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                    <option value={PROPERTY_SIZE_QUOTE.id}>
                      {PROPERTY_SIZE_QUOTE.label}
                    </option>
                  </select>

                  <div className="mt-4 flex items-end justify-between rounded-xl bg-slate-50 px-4 py-3">
                    <span className="text-sm font-medium text-slate-500">
                      {isQuote ? "Larger property" : "Your price"}
                    </span>
                    <span className="font-display text-2xl font-bold text-slate-900">
                      {isQuote || selectedPrice == null
                        ? "Get a quote"
                        : `${formatGBP(selectedPrice)} + VAT`}
                    </span>
                  </div>

                  {isQuote ? (
                    <Link
                      href="/contact"
                      className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-bolt px-6 py-3 text-sm font-bold text-white transition-transform hover:scale-[1.03] no-underline"
                    >
                      Request a quote
                      <ArrowIcon className="h-4 w-4" />
                    </Link>
                  ) : (
                    <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => handleAdd(true)}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-bolt px-5 py-3 text-sm font-bold text-white transition-transform hover:scale-[1.03]"
                      >
                        Book now
                        <ArrowIcon className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAdd(false)}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-900 transition-colors hover:border-bolt/40 hover:text-bolt"
                      >
                        {added ? (
                          <>
                            <CheckIcon className="h-4 w-4 text-bolt" /> Added
                          </>
                        ) : (
                          <>
                            <BagIcon className="h-4 w-4" /> Add to basket
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <Link
            href="/contact"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-bolt/30 bg-bolt/5 px-6 py-3 text-sm font-bold text-bolt transition-colors hover:bg-bolt/10 no-underline"
          >
            Get a quote
            <ArrowIcon className="h-4 w-4" />
          </Link>
        )}
      </div>
    </motion.article>
  );
}
