"use client";

import { motion } from "framer-motion";
import { stats } from "@/lib/content";
import CountUp from "./CountUp";

export default function StatsStrip() {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 lg:grid-cols-4">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          className="group bg-white p-7 transition-colors hover:bg-slate-50"
        >
          <p className="font-display text-4xl font-bold text-bolt sm:text-5xl">
            <CountUp to={s.value} suffix={s.suffix} />
          </p>
          <p className="mt-2 text-sm text-slate-500">{s.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
