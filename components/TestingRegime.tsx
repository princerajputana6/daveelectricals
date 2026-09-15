"use client";

import { motion } from "framer-motion";
import { emergencyLightingRegime } from "@/lib/content";
import { ClockIcon } from "./Icons";

export default function TestingRegime() {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {emergencyLightingRegime.map((r, i) => (
        <motion.div
          key={r.when}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-graphite p-6"
        >
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-bolt/10 text-bolt ring-1 ring-bolt/20">
              <ClockIcon className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-lg font-bold text-white">
                {r.when}
              </p>
              <p className="text-xs uppercase tracking-wider text-bolt">{r.who}</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-ash">{r.what}</p>
        </motion.div>
      ))}
    </div>
  );
}
