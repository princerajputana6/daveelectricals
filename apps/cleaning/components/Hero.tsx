"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { company } from "@/lib/content";
import { ArrowIcon, PhoneIcon, SparkleIcon, StarIcon } from "./Icons";

const headline = ["A spotless space,", "booked in minutes."];

/** Decorative floating bubbles (cleaning motif). */
const bubbles = [
  { left: "8%", top: "22%", size: 90, delay: 0 },
  { left: "82%", top: "18%", size: 130, delay: 0.6 },
  { left: "68%", top: "62%", size: 70, delay: 1.1 },
  { left: "16%", top: "68%", size: 110, delay: 0.3 },
  { left: "46%", top: "12%", size: 54, delay: 0.9 },
];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-[#0b1e33]"
    >
      {/* Deep gradient base — navy/slate, blue only as accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0c2138] via-[#0e2740] to-[#0a1a2c]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_28%,rgba(20,161,230,0.28),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_82%,rgba(20,161,230,0.16),transparent_50%)]" />
      {/* faint grid */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Floating bubbles */}
      {bubbles.map((b, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="absolute rounded-full border border-white/10 bg-gradient-to-br from-white/10 to-white/0 backdrop-blur-[1px]"
          style={{ left: b.left, top: b.top, width: b.size, height: b.size }}
          animate={{ y: [0, -18, 0], opacity: [0.5, 0.9, 0.5] }}
          transition={{
            duration: 6 + i,
            repeat: Infinity,
            delay: b.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      <motion.div
        style={{ y, opacity }}
        className="relative mx-auto flex w-full max-w-5xl flex-col items-center px-5 pb-24 pt-32 text-center sm:px-8"
      >
        {/* Specialist chip */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-7 flex w-fit items-center gap-2.5 rounded-full border border-white/15 bg-white/10 py-2 pl-2 pr-4 backdrop-blur-md"
        >
          <span className="grid h-7 w-7 place-items-center rounded-full bg-bolt text-white">
            <SparkleIcon className="h-4 w-4" />
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80 sm:text-xs">
            Domestic · Commercial · End of Tenancy
          </span>
        </motion.div>

        <h1 className="font-display text-4xl font-bold leading-[0.98] tracking-tight text-white sm:text-6xl lg:text-7xl">
          {headline.map((line, li) => (
            <span key={line} className="block overflow-hidden">
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{
                  duration: 0.9,
                  delay: 0.15 + li * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={li === 1 ? "block text-gradient-bolt" : "block"}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-7 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg"
        >
          Professional domestic and commercial cleaning across London. Choose your
          service and property size, see your price instantly, and book online — no
          waiting on a call-back.
        </motion.p>

        {/* Instant-price chip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-bolt/40 bg-bolt/15 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-sm"
        >
          <span className="text-bolt">From £40 + VAT</span>
          <span className="text-white/50">·</span>
          <span className="text-white/80">instant online booking</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href="/services"
            className="group flex items-center gap-2 rounded-full bg-bolt px-7 py-3.5 font-bold text-white shadow-lg shadow-bolt/25 transition-transform hover:scale-[1.04]"
          >
            See prices &amp; book
            <ArrowIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href={`tel:${company.phonePrimary}`}
            className="group flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 font-semibold text-white backdrop-blur-sm transition-colors hover:border-bolt/50 hover:text-bolt"
          >
            <PhoneIcon className="h-5 w-5" />
            {company.phonePrimary}
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="mt-4 text-sm text-slate-400"
        >
          Bigger property or bespoke job?{" "}
          <Link href="/contact" className="font-semibold text-bolt hover:underline">
            Get a tailored quote
          </Link>
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-7 gap-y-3"
        >
          <div className="flex items-center gap-1.5">
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} className="h-4 w-4 text-bolt" />
            ))}
            <span className="ml-1 text-sm text-slate-300">
              Trusted local cleaners
            </span>
          </div>
          {["Fully insured & vetted", "Satisfaction guaranteed"].map((b) => (
            <span
              key={b}
              className="flex items-center gap-1.5 text-sm font-medium text-slate-300"
            >
              <SparkleIcon className="h-3.5 w-3.5 text-bolt" />
              {b}
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 sm:block"
      >
        <div className="flex h-11 w-7 items-start justify-center rounded-full border border-white/25 p-1.5">
          <motion.span
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="h-2 w-1 rounded-full bg-bolt"
          />
        </div>
      </motion.div>
    </section>
  );
}
