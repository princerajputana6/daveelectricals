"use client";

import { motion } from "framer-motion";
import {
  emergencyLightingTestingProcess,
  emergencyLightingBestPractices,
} from "@/lib/content";
import { CheckIcon, BoltIcon } from "./Icons";

export default function TestingProcess() {
  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        {emergencyLightingTestingProcess.map((box, i) => (
          <motion.div
            key={box.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="rounded-2xl border border-white/10 bg-graphite p-6"
          >
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-bolt/10 font-display text-lg font-bold text-bolt ring-1 ring-bolt/20">
                {box.step}
              </span>
              <div>
                <p className="font-display text-lg font-bold text-white">
                  {box.title}
                </p>
                <p className="text-xs uppercase tracking-wider text-bolt">
                  {box.tag}
                </p>
              </div>
            </div>
            <ul className="mt-5 space-y-3">
              {box.items.map((it) => (
                <li key={it.k} className="flex items-start gap-2.5 text-sm">
                  <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-bolt" />
                  <span className="text-ash">
                    <span className="font-semibold text-white">{it.k}:</span>{" "}
                    {it.v}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <div className="rounded-2xl border-l-4 border-bolt bg-graphite p-6">
        <p className="flex items-center gap-2 font-display text-base font-bold text-white">
          <BoltIcon className="h-4 w-4 text-bolt" />
          Best Practices
        </p>
        <ul className="mt-4 space-y-3">
          {emergencyLightingBestPractices.map((it) => (
            <li key={it.k} className="flex items-start gap-2.5 text-sm">
              <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-bolt" />
              <span className="text-ash">
                <span className="font-semibold text-white">{it.k}:</span> {it.v}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
