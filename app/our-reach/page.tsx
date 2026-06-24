import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import M25Map from "@/components/M25Map";
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

// Towns and districts inside the M25 (clockwise-ish) — these are the AREAS WE COVER,
// not just the head-office postcodes.
const COVERED_AREAS = [
  // North London
  "Camden",
  "Islington",
  "Hampstead",
  "Highgate",
  "Finchley",
  "Wood Green",
  "Enfield",
  "Barnet",
  // East London
  "Hackney",
  "Stratford",
  "Walthamstow",
  "Ilford",
  "Romford",
  "Barking",
  // South-East
  "Greenwich",
  "Lewisham",
  "Bromley",
  "Catford",
  "Eltham",
  // South London
  "Brixton",
  "Clapham",
  "Wimbledon",
  "Croydon",
  "Sutton",
  "Kingston upon Thames",
  // South-West / West
  "Richmond",
  "Twickenham",
  "Hounslow",
  "Feltham",
  "Cranford",
  "Hammersmith",
  "Chiswick",
  "Ealing",
  "Acton",
  // North-West
  "Wembley",
  "Harrow",
  "Edgware",
  "Brent Cross",
  "Watford (edge)",
  // Central
  "Westminster",
  "City of London",
  "Mayfair",
  "Kensington",
  "Chelsea",
];

export default function OurReachPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Reach"
        title="Covering every area inside the M25"
        intro="Dave Electrical Services covers domestic, commercial, industrial and emergency electrical work across the whole M25 ring — central London, every borough, and every postcode in between."
      />

      {/* Real map — M25 orbital highlighted */}
      <section className="mx-auto max-w-7xl px-5 pb-12 sm:px-8">
        <M25Map />
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

      {/* Areas covered */}
      <section className="bg-coal/70 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading
            eyebrow="Areas we cover"
            title="A few of the places we work"
            description="This is a sample of areas across the M25 — if you don't see your postcode listed, we still cover it. Just ask."
            align="center"
          />
          <div className="mx-auto mt-10 flex max-w-5xl flex-wrap justify-center gap-2.5">
            {COVERED_AREAS.map((a, i) => (
              <Reveal key={a} delay={i * 0.015} direction="none">
                <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-graphite px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:border-bolt/40 hover:text-bolt">
                  <BoltIcon className="h-3 w-3 text-bolt" />
                  {a}
                </span>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.3}>
            <p className="mx-auto mt-10 max-w-2xl text-center text-xs text-ash">
              Outside the M25? We&apos;ll consider larger commercial jobs across
              the wider Home Counties — just{" "}
              <a className="font-semibold text-bolt hover:underline" href="/contact">
                get in touch
              </a>{" "}
              for a bespoke quote.
            </p>
          </Reveal>
        </div>
      </section>

      <QuoteCTA />

      <CTABanner />
    </>
  );
}
