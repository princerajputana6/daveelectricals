"use client";

import { motion } from "framer-motion";
import { testimonials } from "@/lib/content";
import { StarIcon } from "./Icons";

export default function Testimonials() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {testimonials.map((t, i) => (
        <motion.figure
          key={t.author}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: i * 0.12 }}
          className="relative flex flex-col rounded-2xl border border-white/10 bg-graphite p-7"
        >
          <span className="font-display text-6xl leading-none text-bolt/20">
            &ldquo;
          </span>
          <div className="-mt-4 flex gap-1">
            {[...Array(5)].map((_, s) => (
              <StarIcon key={s} className="h-4 w-4 text-bolt" />
            ))}
          </div>
          <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-zinc-300">
            {t.quote}
          </blockquote>
          <figcaption className="mt-6 border-t border-white/10 pt-4">
            <p className="text-sm font-semibold text-white">{t.author}</p>
            <p className="text-xs uppercase tracking-wider text-bolt">{t.role}</p>
          </figcaption>
        </motion.figure>
      ))}
    </div>
  );
}
