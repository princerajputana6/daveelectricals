"use client";

import { motion } from "framer-motion";
import { serviceIcons, CheckIcon } from "./Icons";

type Service = {
  slug: string;
  icon: string;
  title: string;
  short: string;
  body: string;
  points: string[];
};

export default function ServiceCard({
  service,
  index,
  expanded = false,
}: {
  service: Service;
  index: number;
  expanded?: boolean;
}) {
  const Icon = serviceIcons[service.icon];

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.1 }}
      whileHover={{ y: -6 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-graphite p-7 transition-colors hover:border-bolt/40"
    >
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-bolt/0 blur-2xl transition-all duration-500 group-hover:bg-bolt/20" />
      <div className="absolute left-0 top-0 h-1 w-0 bg-bolt transition-all duration-500 group-hover:w-full" />

      <div className="relative flex items-center justify-between">
        <span className="grid h-14 w-14 place-items-center rounded-xl bg-bolt/10 text-bolt ring-1 ring-bolt/20 transition-colors group-hover:bg-bolt group-hover:text-ink">
          {Icon && <Icon className="h-7 w-7" />}
        </span>
        <span className="font-display text-5xl font-bold text-white/5 transition-colors group-hover:text-bolt/15">
          0{index + 1}
        </span>
      </div>

      <h3 className="relative mt-6 font-display text-xl font-bold text-white">
        {service.title}
      </h3>
      <p className="relative mt-3 text-sm leading-relaxed text-ash">
        {expanded ? service.body : service.short}
      </p>

      <ul className="relative mt-5 space-y-2.5">
        {service.points.map((point) => (
          <li key={point} className="flex items-start gap-2.5 text-sm text-zinc-300">
            <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-bolt" />
            {point}
          </li>
        ))}
      </ul>
    </motion.article>
  );
}
