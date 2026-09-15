"use client";

import { motion } from "framer-motion";
import { sectors } from "@/lib/content";
import { sectorIcons } from "./Icons";

export default function SectorsGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {sectors.map((sector, i) => {
        const Icon = sectorIcons[sector.icon] || sectorIcons.house;
        return (
          <motion.div
            key={sector.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
            whileHover={{ y: -4 }}
            className="group flex items-center gap-3 rounded-xl border border-white/10 bg-graphite p-5 transition-colors hover:border-bolt/40"
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-bolt/10 text-bolt ring-1 ring-bolt/20 transition-colors group-hover:bg-bolt group-hover:text-ink">
              <Icon className="h-6 w-6" />
            </span>
            <span className="text-sm font-semibold text-white">
              {sector.name}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
