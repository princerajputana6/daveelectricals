"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { company } from "@/lib/content";
import { ArrowIcon, PhoneIcon } from "./Icons";

type CTABannerProps = {
  eyebrow?: string;
  title?: React.ReactNode;
  description?: string;
  /** Extra punch line shown beneath the description (varies per page). */
  punchline?: string;
};

export default function CTABanner({
  eyebrow = "Ready for a cleaner property?",
  title,
  description = "Free, no-obligation quotes. Flexible appointments across London. Fully insured, vetted and satisfaction-focused.",
  punchline,
}: CTABannerProps = {}) {
  return (
    <section className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7 }}
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0c2138] via-[#0e2740] to-[#0a1a2c] px-7 py-14 shadow-xl shadow-slate-900/10 sm:px-14"
      >
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-bolt/30 blur-3xl" />
        <div className="absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-bolt/15 blur-3xl" />

        <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-bolt">
              {eyebrow}
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
              {title ?? (
                <>
                  Let&apos;s get your property{" "}
                  <span className="text-gradient-bolt">sparkling</span>.
                </>
              )}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">{description}</p>
            {punchline && (
              <p className="mt-4 border-l-2 border-bolt/50 pl-4 text-sm font-medium leading-relaxed text-slate-200">
                {punchline}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/services"
              className="group flex items-center justify-center gap-2 rounded-full bg-bolt px-7 py-3.5 font-bold text-white shadow-lg shadow-bolt/25 transition-transform hover:scale-[1.04]"
            >
              See prices &amp; book
              <ArrowIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href={`tel:${company.phonePrimary}`}
              className="flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 font-semibold text-white transition-colors hover:border-bolt/50 hover:text-bolt"
            >
              <PhoneIcon className="h-5 w-5" />
              Call now
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
