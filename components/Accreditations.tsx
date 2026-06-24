"use client";

import { accreditations } from "@/lib/content";

/**
 * Horizontal, auto-scrolling strip of individual accreditation logos.
 * No card chrome — each badge is shown as its own logo on a clean tile so
 * City & Guilds, FIA, NAPIT, etc. read as the distinct entities they are.
 *
 * Logos are loaded from /public/accreditations/ (see lib/content.ts).
 */
export default function Accreditations() {
  // Duplicate the list so the marquee loops seamlessly.
  const loop = [...accreditations, ...accreditations];

  return (
    <div className="group relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
      <div className="flex w-max animate-marquee items-center gap-5 py-4 group-hover:[animation-play-state:paused]">
        {loop.map((a, i) => (
          <div
            key={`${a.name}-${i}`}
            className="h-40 w-40 shrink-0 overflow-hidden rounded-2xl border-[10px] border-bolt bg-white shadow-sm transition-shadow hover:shadow-md sm:h-44 sm:w-44"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={a.src}
              alt={a.name}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
