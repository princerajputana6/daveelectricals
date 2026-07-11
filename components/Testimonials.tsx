"use client";

import { motion } from "framer-motion";
import { googleReviews } from "@/lib/content";

/** The multi-colour Google "G" mark. */
function GoogleG({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
      />
      <path
        fill="#34A853"
        d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
      />
      <path
        fill="#FBBC05"
        d="M11.69 28.18c-.44-1.32-.69-2.73-.69-4.18s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z"
      />
      <path
        fill="#EA4335"
        d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
      />
    </svg>
  );
}

/** The four-colour "Google" wordmark. */
function GoogleWordmark() {
  const letters: [string, string][] = [
    ["G", "#4285F4"],
    ["o", "#EA4335"],
    ["o", "#FBBC05"],
    ["g", "#4285F4"],
    ["l", "#34A853"],
    ["e", "#EA4335"],
  ];
  return (
    <span className="font-display text-2xl font-bold tracking-tight" aria-label="Google">
      {letters.map(([ch, color], i) => (
        <span key={i} style={{ color }}>
          {ch}
        </span>
      ))}
    </span>
  );
}

function Stars({ n = 5, className = "" }: { n?: number; className?: string }) {
  return (
    <span className={`inline-flex gap-0.5 ${className}`} aria-label={`${n} out of 5 stars`}>
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill={i < n ? "#FBBC05" : "#dadce0"}
          aria-hidden="true"
        >
          <path d="M12 17.27l6.18 3.73-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </span>
  );
}

export default function Testimonials() {
  const { url, rating, count, reviews } = googleReviews;
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0f1b2d]">
      <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[240px_1fr] lg:items-center">
        {/* Summary panel */}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center rounded-2xl bg-white/[0.03] p-6 text-center no-underline transition-colors hover:bg-white/[0.06]"
        >
          <p className="text-lg font-bold uppercase tracking-[0.2em] text-white">
            Excellent
          </p>
          <Stars n={Math.round(rating)} className="mt-2" />
          <p className="mt-2 text-sm text-zinc-300">
            Based on <span className="font-semibold text-white">{count} reviews</span>
          </p>
          <span className="mt-3 inline-flex items-center gap-2">
            <GoogleG className="h-6 w-6" />
            <GoogleWordmark />
          </span>
          <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#8ab4f8] group-hover:underline">
            Read all our reviews →
          </span>
        </a>

        {/* Review cards — horizontally scrollable */}
        <div className="-mx-1 flex gap-4 overflow-x-auto px-1 pb-2 [scrollbar-width:thin]">
          {reviews.map((r, i) => (
            <motion.a
              key={r.name}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex w-[280px] shrink-0 flex-col rounded-xl bg-white p-4 text-left no-underline shadow-sm transition-transform hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-3">
                <span
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-base font-semibold text-white"
                  style={{ backgroundColor: r.avatarBg }}
                >
                  {r.name.charAt(0)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#202124]">
                    {r.name}
                  </p>
                  <p className="text-xs text-[#5f6368]">{r.when}</p>
                </div>
                <GoogleG className="h-5 w-5 shrink-0" />
              </div>
              <Stars n={r.stars} className="mt-3" />
              <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-[#3c4043]">
                {r.text}
              </p>
              <span className="mt-2 text-xs font-medium text-[#5f6368]">
                Read more
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
}
