"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { heroHighlight } from "@/lib/content";
import { ArrowIcon, BoltIcon } from "./Icons";

export default function LandlordRibbon() {
  return (
    <section className="relative bg-bolt text-white">
      <div className="relative overflow-hidden px-5 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em]"
          >
            <BoltIcon className="h-4 w-4" />
            {heroHighlight.eyebrow}
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl"
          >
            {heroHighlight.title}
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-7 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <p className="text-lg font-semibold sm:text-2xl">
              {heroHighlight.subtitle}
            </p>
            <Link
              href="/contact"
              className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-bolt transition-transform hover:scale-[1.04]"
            >
              Get a landlord quote
              <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 max-w-3xl text-sm font-medium leading-relaxed text-white/80"
          >
            Our responsive admin team can coordinate directly with your tenants to schedule the clean and make sure it is completed to standard. That removes the constant back-and-forth between tenants, agents and cleaners — a smoother, hassle-free process for everyone involved.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
