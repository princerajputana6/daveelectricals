import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import M25CoverageMap from "@/components/M25CoverageMap";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import QuoteCTA from "@/components/QuoteCTA";
import CTABanner from "@/components/CTABanner";
import { BoltIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Our Reach",
  description:
    "Dave Electrical Services covers every area inside the M25 — domestic, commercial, industrial and 24/7 emergency call-outs across London.",
};

const PRIMARY_AREAS = [
  {
    code: "H",
    name: "Hounslow",
    blurb: "Our main base of operations — full electrical services for domestic & commercial clients.",
  },
  {
    code: "T",
    name: "Twickenham",
    blurb: "Residential refurbishments, certification and emergency call-outs across Twickenham.",
  },
  {
    code: "F",
    name: "Feltham",
    blurb: "Commercial and industrial electrical work throughout the Feltham area.",
  },
  {
    code: "C",
    name: "Cranford",
    blurb: "PAT testing, EV charging installations and maintenance in Cranford.",
  },
];

const COVERED_AREAS = [
  "Hounslow",
  "Twickenham",
  "Feltham",
  "Cranford",
  "Watford",
  "Harrow",
  "Wembley",
  "Rickmansworth",
  "Slough",
  "Kingston",
  "Woking",
  "Leatherhead",
  "Caterham",
  "Bromley",
  "Dartford",
  "Grays",
  "Romford",
  "Brentwood",
  "Epping",
  "Enfield",
  "Cheshunt",
];

export default function OurReachPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Reach"
        title="Covering every area inside the M25"
        intro="Dave Electrical Services covers domestic, commercial, industrial and emergency electrical work across the whole M25 ring — Hounslow, Twickenham, Feltham and Cranford are our home turf, but our engineers travel anywhere inside the orbital."
      />

      {/* M25 stylised coverage graphic */}
      <section className="mx-auto max-w-7xl px-5 pb-12 sm:px-8">
        <M25CoverageMap />
      </section>

      {/* Primary service areas */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <SectionHeading
          eyebrow="Service areas"
          title="Where we work"
          description="Our home patch: Hounslow, Twickenham, Feltham and Cranford. Click into any of our services for what we do here."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PRIMARY_AREAS.map((area, i) => (
            <Reveal key={area.name} delay={i * 0.08}>
              <div className="group h-full rounded-2xl border border-white/10 bg-graphite p-6 transition-colors hover:border-bolt/40">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-bolt font-display text-xl font-bold text-ink shadow-lg shadow-bolt/20">
                  {area.code}
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-white">
                  {area.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ash">
                  {area.blurb}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Quick area list */}
      <section className="bg-coal py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading
            eyebrow="Quick lookup"
            title="Towns &amp; districts we cover"
            description="Plus everywhere in between — if it's inside the M25, we're there."
            align="center"
          />
          <div className="mx-auto mt-10 flex max-w-5xl flex-wrap justify-center gap-2.5">
            {COVERED_AREAS.map((a, i) => (
              <Reveal key={a} delay={i * 0.02} direction="none">
                <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-graphite px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:border-bolt/40 hover:text-bolt">
                  <BoltIcon className="h-3 w-3 text-bolt" />
                  {a}
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <QuoteCTA />

      <CTABanner />
    </>
  );
}
