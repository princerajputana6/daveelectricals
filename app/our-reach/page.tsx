import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import QuoteCTA from "@/components/QuoteCTA";
import CTABanner from "@/components/CTABanner";
import { BoltIcon, ShieldIcon, ClockIcon, BuildingIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Our Reach",
  description:
    "Dave Electrical Services covers every area inside the M25 — domestic, commercial, industrial and 24/7 emergency call-outs across London.",
};

const COVERAGE_PROMISES = [
  {
    Icon: BoltIcon,
    title: "Inside the M25",
    body:
      "We serve every postcode inside the M25 orbital — Central London, North, East, South and West.",
  },
  {
    Icon: ClockIcon,
    title: "Same-week scheduling",
    body:
      "Bookings inside the M25 typically get a slot within 3 working days; emergencies same day.",
  },
  {
    Icon: BuildingIcon,
    title: "Domestic & commercial",
    body:
      "From a 1-bed EICR to multi-floor commercial fit-outs, fire alarms and EV chargers.",
  },
  {
    Icon: ShieldIcon,
    title: "NAPIT registered",
    body:
      "Every job is signed off by a NAPIT-registered engineer — fully insured, fully compliant.",
  },
];

export default function OurReachPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Reach"
        title="Covering every area within &amp; surrounding the M25"
        intro="Dave Electrical Services covers domestic, commercial, industrial and emergency electrical work across the whole M25 ring — central London, every borough, and every postcode in between."
      />

      {/* London postcode-district coverage map */}
      <section className="mx-auto max-w-7xl px-5 pb-12 sm:px-8">
        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white p-2 sm:p-4">
            <img
              src="/london-postcode-map.jpg"
              alt="Map of London postcode districts covered by Dave Electrical Services — every area within and surrounding the M25"
              className="mx-auto h-auto w-full max-w-4xl"
              loading="lazy"
            />
          </div>
        </Reveal>
      </section>

      {/* Coverage promises */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <SectionHeading
          eyebrow="Our promise"
          title="One team, one standard, anywhere in the M25"
          description="Wherever your property sits inside the orbital — we'll be there with the same level of qualified, certified workmanship."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {COVERAGE_PROMISES.map((p, i) => {
            const I = p.Icon;
            return (
              <Reveal key={p.title} delay={i * 0.08}>
                <div className="group h-full rounded-2xl border border-white/10 bg-graphite p-6 transition-colors hover:border-bolt/40">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-bolt/10 text-bolt ring-1 ring-bolt/20 transition-colors group-hover:bg-bolt group-hover:text-ink">
                    <I className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-bold text-white">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ash">
                    {p.body}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <QuoteCTA />

      <CTABanner punchline="Commercial Electrical Breakdown? We've Got Your Back. We understand that downtime costs your business time and money. As experienced commercial electricians, we'll respond quickly to get you back up and running. Book an emergency callout today." />
    </>
  );
}
