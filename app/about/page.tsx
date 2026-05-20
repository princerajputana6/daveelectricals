import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import StatsStrip from "@/components/StatsStrip";
import CTABanner from "@/components/CTABanner";
import {
  sectors,
  accreditationPoints,
  guarantees,
  badges,
} from "@/lib/content";
import { BoltIcon, CheckIcon, ShieldIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "About",
  description:
    "Over 10 years of expert electrical installation, maintenance and project consultancy across domestic, commercial and industrial sectors in West London.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="About Dave Electrical"
        intro="With over 10 years of hands-on experience, Dave Electrical Services delivers expert electrical installation, maintenance and project consultancy across the domestic, commercial and industrial sectors."
      />

      {/* Intro */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="space-y-5 text-base leading-relaxed text-ash">
            <Reveal>
              <p>
                We take pride in delivering safe, compliant, high-quality
                workmanship — every time, on every job. From family homes and
                restaurants to manufacturing plants, schools and GP surgeries, we
                bring the same commitment to excellence regardless of the scale or
                complexity of the project.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p>
                Our growing portfolio of satisfied clients speaks for itself — and
                we are always happy to share references upon request. Over the
                years we have worked all over West London in every kind of
                electrical environment, including clubs, pubs, restaurants, shops,
                manufacturing plants, schools, GPs, councils and the residential
                sector.
              </p>
            </Reveal>
          </div>

          <Reveal direction="left" delay={0.2}>
            <div className="relative overflow-hidden rounded-3xl border border-bolt/20 bg-gradient-to-br from-graphite to-coal p-8">
              <div className="grid-bg absolute inset-0 opacity-40" />
              <p className="relative font-display text-7xl font-bold text-gradient-bolt">
                10+
              </p>
              <p className="relative mt-2 font-display text-xl font-bold text-white">
                Years of experience
              </p>
              <p className="relative mt-3 text-sm text-ash">
                Domestic, commercial &amp; industrial installation, maintenance and
                project consultancy.
              </p>
              <div className="relative mt-6 flex flex-wrap gap-2">
                {badges.map((b) => (
                  <span
                    key={b}
                    className="rounded-full border border-bolt/30 bg-bolt/5 px-3 py-1 text-[11px] font-semibold text-bolt"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8">
        <StatsStrip />
      </section>

      {/* Sectors */}
      <section className="bg-coal py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading
            eyebrow="Sectors we serve"
            title="Every kind of electrical environment"
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {sectors.map((sector, i) => (
              <Reveal key={sector} delay={(i % 4) * 0.08}>
                <div className="group flex items-center gap-3 rounded-xl border border-white/10 bg-graphite p-5 transition-colors hover:border-bolt/40">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-bolt/10 text-bolt transition-colors group-hover:bg-bolt group-hover:text-ink">
                    <BoltIcon className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-semibold text-white">
                    {sector}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Accreditation */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-graphite p-8">
              <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-bolt/15 blur-3xl" />
              <ShieldIcon className="relative h-12 w-12 text-bolt" />
              <h3 className="relative mt-5 font-display text-2xl font-bold text-white">
                Authorised, Accredited &amp; Certified
              </h3>
              <p className="relative mt-3 text-sm leading-relaxed text-ash">
                Dave Electrical Services is fully registered under NAPIT — a
                government-authorised Competent Person Scheme enabling us to
                self-certify work against Building Regulations in England and
                Wales. NAPIT Certification is independently accredited by the
                United Kingdom Accreditation Service (UKAS).
              </p>
            </div>
          </Reveal>

          <div>
            <SectionHeading
              eyebrow="Accreditation"
              title="What being registered means for you"
            />
            <ul className="mt-8 space-y-3">
              {accreditationPoints.map((point, i) => (
                <Reveal key={point} delay={i * 0.08}>
                  <li className="flex items-start gap-3 rounded-xl border border-white/10 bg-graphite p-4 text-sm text-zinc-300">
                    <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-bolt" />
                    {point}
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Guarantee */}
      <section className="bg-coal py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading
            eyebrow="Our guarantee"
            title="Work you can rely on"
            description="All work is backed by a 12-month workmanship guarantee from the date of completion."
            align="center"
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {guarantees.map((g, i) => (
              <Reveal key={g.title} delay={i * 0.1}>
                <div className="group h-full rounded-2xl border border-white/10 bg-graphite p-7 transition-colors hover:border-bolt/40">
                  <span className="font-display text-5xl font-bold text-bolt/15 transition-colors group-hover:text-bolt/30">
                    0{i + 1}
                  </span>
                  <h3 className="mt-3 font-display text-xl font-bold text-white">
                    {g.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ash">
                    {g.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
