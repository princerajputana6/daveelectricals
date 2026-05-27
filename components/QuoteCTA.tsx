"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { company } from "@/lib/content";

export default function QuoteCTA() {
  return (
    <section className="relative bg-ink">
      <div className="relative overflow-hidden px-5 py-14 text-center sm:px-8 sm:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,212,0,0.1),transparent_60%)]" />
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
          className="relative font-display text-2xl font-bold text-bolt sm:text-3xl"
        >
          Call us now to arrange a FREE Quote
        </motion.p>
        <motion.a
          href={`tel:${company.phoneMobile}`}
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          whileHover={{ scale: 1.03 }}
          className="relative mt-4 block font-display text-5xl font-bold tracking-tight text-white sm:text-7xl lg:text-8xl"
        >
          079 4443 7459
        </motion.a>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative mt-4 text-sm text-ash sm:text-base"
        >
          Or{" "}
          <Link
            href="/contact"
            className="font-bold text-bolt underline-offset-4 hover:underline"
          >
            CLICK HERE
          </Link>{" "}
          to request a call back
        </motion.p>
      </div>
    </section>
  );
}
