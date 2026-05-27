"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { emergencyLightingFaqs } from "@/lib/content";
import { ArrowIcon } from "./Icons";

export default function EmergencyLightingFaq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {emergencyLightingFaqs.map((f, i) => {
        const isOpen = open === i;
        return (
          <motion.div
            key={f.q}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45, delay: i * 0.05 }}
            className={`overflow-hidden rounded-2xl border bg-graphite transition-colors ${
              isOpen ? "border-bolt/40" : "border-white/10"
            }`}
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 p-5 text-left"
            >
              <span
                className={`font-display text-base font-bold transition-colors sm:text-lg ${
                  isOpen ? "text-bolt" : "text-white"
                }`}
              >
                {f.q}
              </span>
              <motion.span
                animate={{ rotate: isOpen ? 90 : 0 }}
                transition={{ duration: 0.25 }}
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors ${
                  isOpen ? "bg-bolt text-ink" : "bg-white/5 text-bolt"
                }`}
              >
                <ArrowIcon className="h-4 w-4" />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 text-sm leading-relaxed text-ash">
                    {f.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
