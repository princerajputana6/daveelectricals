"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { company } from "@/lib/content";
import { ArrowIcon, PhoneIcon } from "./Icons";

export default function CTABanner() {
  return (
    <section className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7 }}
        className="relative overflow-hidden rounded-3xl border border-bolt/20 bg-gradient-to-br from-graphite via-coal to-ink px-7 py-14 sm:px-14"
      >
        <div className="grid-bg absolute inset-0 opacity-50" />
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-bolt/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-bolt/10 blur-3xl" />

        <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-bolt">
              Need a Landlord Certificate in a hurry?
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
              Let&apos;s get your project{" "}
              <span className="text-gradient-bolt">powered up</span>.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ash">
              Free, no-obligation quotes. 24 hour emergency call-outs, 365 days a
              year. Fully NAPIT registered and insured.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="group flex items-center justify-center gap-2 rounded-full bg-bolt px-7 py-3.5 font-bold text-ink transition-transform hover:scale-[1.04]"
            >
              Request a quote
              <ArrowIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href={`tel:${company.phonePrimary}`}
              className="flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 font-semibold text-white transition-colors hover:border-bolt/40 hover:text-bolt"
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
