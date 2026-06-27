"use client";

import { motion } from "framer-motion";
import {
  ClipboardIcon,
  EvIcon,
  BoltIcon,
  ShieldIcon,
  BuildingIcon,
  TestIcon,
} from "./Icons";

// 16 M25-adjacent towns positioned roughly clockwise from N
const TOWNS = [
  { name: "Cheshunt", angle: 350, r: 0.92 },
  { name: "Enfield", angle: 20, r: 0.82 },
  { name: "Epping", angle: 50, r: 0.94 },
  { name: "Brentwood", angle: 75, r: 0.97 },
  { name: "Romford", angle: 95, r: 0.84 },
  { name: "Grays", angle: 120, r: 0.95 },
  { name: "Dartford", angle: 140, r: 0.88 },
  { name: "Bromley", angle: 165, r: 0.82 },
  { name: "Caterham", angle: 190, r: 0.95 },
  { name: "Leatherhead", angle: 215, r: 0.93 },
  { name: "Kingston", angle: 235, r: 0.82 },
  { name: "Woking", angle: 250, r: 0.97 },
  { name: "Slough", angle: 275, r: 0.93 },
  { name: "Rickmansworth", angle: 295, r: 0.86 },
  { name: "Harrow", angle: 312, r: 0.74 },
  { name: "Watford", angle: 328, r: 0.9 },
];

// 4 M25 corner labels
const M25_LABELS = [
  { angle: 0, label: "M25" },
  { angle: 90, label: "M25" },
  { angle: 180, label: "M25" },
  { angle: 270, label: "M25" },
];

const SERVICE_PILLS = [
  { Icon: ClipboardIcon, top: "EICR", bottom: "Inspections & Reports" },
  { Icon: BoltIcon, top: "Emergency", bottom: "Callouts 24 / 7" },
  { Icon: BuildingIcon, top: "Commercial", bottom: "Electrical" },
  { Icon: EvIcon, top: "EV Charger", bottom: "Installations" },
  { Icon: TestIcon, top: "PAT Testing", bottom: "& Appliance Testing" },
];

function polar(angle: number, radius: number, cx = 50, cy = 50) {
  // angle is in degrees, 0° = top (north). Convert to math coords.
  const rad = ((angle - 90) * Math.PI) / 180;
  return {
    x: cx + Math.cos(rad) * radius,
    y: cy + Math.sin(rad) * radius,
  };
}

export default function M25CoverageMap() {
  return (
    <div className="overflow-hidden rounded-3xl border border-bolt/30 bg-gradient-to-br from-coal via-ink to-black shadow-2xl shadow-bolt/10">
      {/* Top yellow ribbon */}
      <div className="bg-bolt text-ink">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-6 py-3 sm:px-10">
          <BoltIcon className="h-6 w-6" />
          <p className="font-display text-lg font-extrabold uppercase tracking-tight sm:text-2xl">
            London-Wide Electrical Services
          </p>
        </div>
        <div className="border-t border-ink/15 bg-bolt-deep">
          <p className="mx-auto max-w-6xl px-6 py-1.5 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-ink sm:text-[12px]">
            Domestic · Commercial · Industrial · Emergency Call Outs
          </p>
        </div>
      </div>

      {/* Main map area */}
      <div className="relative grid gap-0 lg:grid-cols-[1fr_1.4fr]">
        {/* LEFT — heading + service pills */}
        <div className="relative flex flex-col justify-center gap-8 border-b border-white/10 bg-ink/40 p-8 lg:border-b-0 lg:border-r lg:p-10">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-bolt">
              Our reach
            </p>
            <h2 className="mt-2 font-display text-4xl font-extrabold leading-[0.9] tracking-tight text-white sm:text-5xl">
              COVERING <span className="block">ALL AREAS</span>
              <span className="block">INSIDE THE</span>
              <span className="mt-2 inline-block rounded-xl bg-bolt px-4 py-1 font-display text-6xl font-black text-ink sm:text-7xl">
                M25
              </span>
            </h2>
          </div>

          <ul className="space-y-2.5">
            {SERVICE_PILLS.map(({ Icon, top, bottom }, i) => (
              <motion.li
                key={top}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-graphite px-3 py-2"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-bolt/15 text-bolt ring-1 ring-bolt/30">
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <div className="leading-tight">
                  <p className="font-display text-sm font-bold uppercase tracking-wide text-white">
                    {top}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-ash">
                    {bottom}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* RIGHT — the stylised M25 map */}
        <div className="relative aspect-[5/4] w-full bg-[radial-gradient(circle_at_50%_50%,#1a1a18_0%,#0a0a0a_70%)]">
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
            <defs>
              <filter id="m25glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="0.7" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <radialGradient id="ringFill" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#e2e61f" stopOpacity="0.25" />
                <stop offset="50%" stopColor="#e2e61f" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#e2e61f" stopOpacity="0.05" />
              </radialGradient>
              <linearGradient id="thames" x1="0" x2="1">
                <stop offset="0%" stopColor="#2a3a4a" />
                <stop offset="100%" stopColor="#1a2a3a" />
              </linearGradient>
            </defs>

            {/* Faint road network */}
            <g
              stroke="#ffffff"
              strokeOpacity="0.05"
              strokeWidth="0.18"
              fill="none"
            >
              {Array.from({ length: 18 }).map((_, i) => (
                <line
                  key={`v-${i}`}
                  x1={(i * 100) / 18}
                  y1="0"
                  x2={(i * 100) / 18}
                  y2="100"
                />
              ))}
              {Array.from({ length: 14 }).map((_, i) => (
                <line
                  key={`h-${i}`}
                  x1="0"
                  y1={(i * 100) / 14}
                  x2="100"
                  y2={(i * 100) / 14}
                />
              ))}
              <path d="M0,30 Q30,40 60,35 T100,32" />
              <path d="M0,55 Q35,60 70,50 T100,60" />
              <path d="M5,75 Q40,82 75,72 T100,78" />
              <path d="M10,15 Q30,25 50,20 T100,12" />
            </g>

            {/* Thames — sweeping curve through London */}
            <path
              d="M5,55 Q25,62 38,53 T55,58 T78,52 T100,58"
              stroke="url(#thames)"
              strokeWidth="1.2"
              strokeOpacity="0.55"
              fill="none"
            />

            {/* M25 ring — soft yellow glow */}
            <circle
              cx="50"
              cy="51"
              r="33"
              fill="url(#ringFill)"
              stroke="none"
            />
            <motion.circle
              cx="50"
              cy="51"
              r="33"
              fill="none"
              stroke="#e2e61f"
              strokeWidth="1.6"
              filter="url(#m25glow)"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
            />
            <circle
              cx="50"
              cy="51"
              r="33"
              fill="none"
              stroke="#eef29a"
              strokeOpacity="0.6"
              strokeWidth="0.35"
              strokeDasharray="0.5 1.2"
            />

            {/* M25 corner labels */}
            {M25_LABELS.map((m) => {
              const p = polar(m.angle, 36.5, 50, 51);
              return (
                <g key={m.angle}>
                  <rect
                    x={p.x - 3.5}
                    y={p.y - 1.4}
                    width="7"
                    height="2.8"
                    rx="0.4"
                    fill="#e2e61f"
                  />
                  <text
                    x={p.x}
                    y={p.y + 0.7}
                    textAnchor="middle"
                    fontSize="2"
                    fontWeight="900"
                    fill="#0a0a0a"
                    style={{ letterSpacing: "0.08em" }}
                  >
                    {m.label}
                  </text>
                </g>
              );
            })}

            {/* Town pins around the ring */}
            {TOWNS.map((t) => {
              const p = polar(t.angle, 33 * t.r, 50, 51);
              const labelOffset = polar(t.angle, 33 * t.r + 3, 50, 51);
              const anchor =
                t.angle > 60 && t.angle < 120
                  ? "start"
                  : t.angle > 240 && t.angle < 300
                    ? "end"
                    : "middle";
              return (
                <g key={t.name}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="0.9"
                    fill="#e2e61f"
                  />
                  <text
                    x={labelOffset.x}
                    y={labelOffset.y + 0.5}
                    textAnchor={anchor}
                    fontSize="1.9"
                    fontWeight="600"
                    fill="#ffffff"
                    opacity="0.9"
                  >
                    {t.name}
                  </text>
                </g>
              );
            })}

            {/* LONDON center label */}
            <text
              x="50"
              y="51.5"
              textAnchor="middle"
              fontSize="5.5"
              fontWeight="900"
              fill="#ffffff"
              style={{ letterSpacing: "0.2em" }}
            >
              LONDON
            </text>

            {/* Pulsing center pin */}
            <motion.circle
              cx="50"
              cy="54"
              r="1.4"
              fill="#e2e61f"
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </svg>
        </div>
      </div>

      {/* Mid bar — one team / fully qualified */}
      <div className="grid gap-0 border-t border-white/10 bg-ink/80 sm:grid-cols-2">
        <div className="flex items-center gap-3 border-b border-white/10 px-6 py-4 sm:border-b-0 sm:border-r">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-bolt/10 text-bolt ring-1 ring-bolt/30">
            <ShieldIcon className="h-5 w-5" />
          </span>
          <div className="leading-tight">
            <p className="font-display text-sm font-extrabold uppercase tracking-wide text-white">
              One Team. One Standard.
            </p>
            <p className="text-[11px] text-ash">
              Quality electrical solutions{" "}
              <span className="text-bolt">you can rely on.</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-6 py-4">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-bolt text-ink">
            <BoltIcon className="h-5 w-5" />
          </span>
          <div className="leading-tight">
            <p className="font-display text-sm font-extrabold uppercase tracking-wide text-white">
              Fully Qualified
            </p>
            <p className="text-[11px] text-ash">
              Fully insured · <span className="text-bolt">NAPIT approved</span>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom yellow ribbon */}
      <div className="bg-bolt">
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-3 px-6 py-3 text-ink sm:px-10">
          <BoltIcon className="h-5 w-5" />
          <p className="font-display text-sm font-extrabold uppercase tracking-[0.15em] sm:text-lg">
            Serving every area within the M25
          </p>
          <BoltIcon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
