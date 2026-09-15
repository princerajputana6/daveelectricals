"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowIcon } from "./Icons";

export default function PageHero({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro: string;
}) {
  return (
    <section className="relative overflow-hidden bg-ink pb-16 pt-36 sm:pb-24 sm:pt-44">
      <div className="grid-bg absolute inset-0 opacity-40" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(226, 230, 31,0.16),transparent_60%)]" />
      <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-bolt/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-bolt"
        >
          <span className="h-px w-8 bg-bolt" />
          {eyebrow}
        </motion.div>

        <h1 className="mt-5 max-w-4xl font-display text-5xl font-bold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
          {title.split(" ").map((word, i) => (
            <span key={i} className="inline-block overflow-hidden pr-3">
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.1 + i * 0.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="inline-block"
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-6 max-w-2xl text-base leading-relaxed text-ash sm:text-lg"
        >
          {intro}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-7 flex flex-wrap gap-2 text-xs text-ash"
        >
          <Link
            href="/"
            className="transition-colors hover:text-bolt"
          >
            Home
          </Link>
          <ArrowIcon className="h-4 w-4 text-bolt" />
          <span className="text-white">{eyebrow}</span>
        </motion.div>
      </div>
    </section>
  );
}
