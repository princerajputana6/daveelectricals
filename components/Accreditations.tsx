"use client";

import { motion } from "framer-motion";
import { accreditations } from "@/lib/content";
import { CheckIcon } from "./Icons";

export default function Accreditations() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {accreditations.map((a, i) => (
        <motion.div
          key={a.name}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, delay: i * 0.08 }}
          whileHover={{ y: -6 }}
          className="group relative flex flex-col items-center overflow-hidden rounded-2xl border border-zinc-200 bg-white p-7 text-center shadow-sm transition-shadow hover:shadow-xl"
        >
          <span
            className="absolute inset-x-0 top-0 h-1.5"
            style={{ background: a.accent }}
          />
          <div
            className="grid h-20 w-20 place-items-center rounded-full font-display text-2xl font-bold text-white shadow-md"
            style={{ background: a.accent }}
          >
            {a.short}
          </div>
          <h3 className="mt-5 font-display text-lg font-bold leading-tight text-ink">
            {a.name}
          </h3>
          <p className="mt-1.5 flex items-center justify-center gap-1.5 text-xs font-medium text-zinc-600">
            <CheckIcon className="h-4 w-4 text-emerald-500" />
            {a.detail}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
