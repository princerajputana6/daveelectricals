import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import QuoteCTA from "@/components/QuoteCTA";
import CTABanner from "@/components/CTABanner";
import { areasCoverText } from "@/lib/content";
import { SparkleIcon, ClockIcon, BuildingIcon, ShieldIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Areas We Cover",
  description:
    "Dave Cleaning Services covers London and all areas within the M25 & beyond — domestic, commercial and property cleaning across the capital.",
};

const COVERAGE_PROMISES = [
  {
    Icon: SparkleIcon,
    title: "Across London",
    body:
      "We cover homes and businesses right across London — central, north, east, south and west.",
  },
  {
    Icon: ClockIcon,
    title: "Flexible scheduling",
    body:
      "Cleaning arranged around your schedule, with regular, one-off and specialist options.",
  },
  {
    Icon: BuildingIcon,
    title: "Domestic & commercial",
    body:
      "From a studio flat to offices, communal areas and managed residential blocks.",
  },
  {
    Icon: ShieldIcon,
    title: "Insured & vetted",
    body:
      "Every clean is carried out by a professional, fully insured and vetted team.",
  },
];

export default function AreasWeCoverPage() {
  return (
    <>
      <PageHero
        eyebrow="Areas We Cover"
        title="Covering every area within &amp; surrounding the M25"
        intro={areasCoverText}
      />

      {/* Coverage statement */}
      <section className="mx-auto max-w-7xl px-5 pb-12 sm:px-8">
        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-bolt/30 bg-gradient-to-br from-slate-50 via-white to-slate-100 p-10 text-center sm:p-16">
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-bolt">
              Our coverage
            </p>
            <p className="mx-auto mt-4 max-w-3xl font-display text-3xl font-extrabold leading-tight text-slate-900 sm:text-5xl">
              Covering all areas within the{" "}
              <span className="inline-block rounded-lg bg-bolt px-3 py-0.5 text-white">
                M25
              </span>{" "}
              &amp; beyond
            </p>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base">
              Domestic, commercial and property cleaning — right across London
              and the surrounding areas.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Coverage promises */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <SectionHeading
          eyebrow="Our promise"
          title="One team, one standard, wherever you are"
          description="Wherever your property sits across the capital, we'll be there with the same reliable, professional standard."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {COVERAGE_PROMISES.map((p, i) => {
            const I = p.Icon;
            return (
              <Reveal key={p.title} delay={i * 0.08}>
                <div className="group h-full rounded-2xl border border-slate-200 bg-white p-6 transition-colors hover:border-bolt/40">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-bolt/10 text-bolt ring-1 ring-bolt/20 transition-colors group-hover:bg-bolt group-hover:text-white">
                    <I className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-bold text-slate-900">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    {p.body}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <QuoteCTA />

      <CTABanner punchline="Need a reliable clean at short notice? Whether it's an end-of-tenancy deadline or a last-minute deep clean, get in touch and we'll do our best to fit you in." />
    </>
  );
}
