"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { company, badges, heroBackground } from "@/lib/content";
import { ArrowIcon, BoltIcon, PhoneIcon, ShieldIcon, StarIcon } from "./Icons";
import ElectricBackground from "./ElectricBackground";

const headline = ["Powering", "homes &", "business"];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [imageReady, setImageReady] = useState(false);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-ink"
    >
      {/* Image background — drop an image at public/hero-bg.jpg or set NEXT_PUBLIC_HERO_BG_URL */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={heroBackground.src}
        alt=""
        onLoad={() => setImageReady(true)}
        onError={() => setImageReady(false)}
        className={`pointer-events-none absolute inset-0 h-full w-full select-none object-cover transition-opacity duration-700 ${
          imageReady ? "opacity-55" : "opacity-0"
        }`}
        aria-hidden="true"
      />

      {/* Optional video layer (drop public/hero.mp4) */}
      <video
        autoPlay
        muted
        loop
        playsInline
        poster="/hero-poster.svg"
        onCanPlay={() => setVideoReady(true)}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
          videoReady && !imageReady ? "opacity-35" : "opacity-0"
        }`}
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      {/* Animated electric circuit — kept as a subtle accent even with image */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${
          imageReady ? "opacity-30" : "opacity-100"
        }`}
      >
        <ElectricBackground />
      </div>

      {/* Overlays */}
      <div className="grid-bg absolute inset-0 opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/50 to-ink" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,212,0,0.14),transparent_55%)]" />

      <motion.div
        style={{ y, opacity }}
        className="relative mx-auto w-full max-w-7xl px-5 pb-20 pt-32 sm:px-8"
      >
        {/* Landlord Safety Certification — specialist callout chip */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-7 flex w-fit items-center gap-2.5 rounded-full border border-bolt/40 bg-bolt/10 py-2 pl-2 pr-4 backdrop-blur-sm"
        >
          <span className="grid h-7 w-7 place-items-center rounded-full bg-bolt text-ink">
            <ShieldIcon className="h-4 w-4" />
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-bolt sm:text-xs">
            Landlord Electrical Safety Compliance Certification
          </span>
        </motion.div>

        <h1 className="font-display text-6xl font-bold leading-[0.95] tracking-tight sm:text-7xl lg:text-[8rem]">
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
                className={`block ${li === 2 ? "text-gradient-bolt" : "text-white"}`}
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
          className="mt-7 max-w-xl text-base leading-relaxed text-ash sm:text-lg"
        >
          Over {company.yearsExperience} years of expert electrical installation,
          maintenance and project consultancy across the domestic, commercial and
          industrial sectors — safe, compliant and certified every time.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.75 }}
          className="mt-9 flex flex-wrap items-center gap-4"
        >
          <Link
            href="/contact"
            className="group flex items-center gap-2 rounded-full bg-bolt px-7 py-3.5 font-bold text-ink transition-transform hover:scale-[1.04]"
          >
            Get a free quote
            <ArrowIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href={`tel:${company.phoneMobile}`}
            className="group flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 font-semibold text-white backdrop-blur-sm transition-colors hover:border-bolt/40 hover:text-bolt"
          >
            <PhoneIcon className="h-5 w-5" />
            {company.phoneMobile}
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.95 }}
          className="mt-12 flex flex-wrap items-center gap-x-7 gap-y-3"
        >
          <div className="flex items-center gap-1.5">
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} className="h-4 w-4 text-bolt" />
            ))}
            <span className="ml-1 text-sm text-ash">Trusted local electricians</span>
          </div>
          {badges.map((b) => (
            <span
              key={b}
              className="flex items-center gap-1.5 text-sm font-medium text-ash"
            >
              <BoltIcon className="h-3.5 w-3.5 text-bolt" />
              {b}
            </span>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 sm:block"
      >
        <div className="flex h-11 w-7 items-start justify-center rounded-full border border-white/20 p-1.5">
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
