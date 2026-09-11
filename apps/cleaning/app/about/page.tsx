import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import StatsStrip from "@/components/StatsStrip";
import SectorsGrid from "@/components/SectorsGrid";
import QuoteCTA from "@/components/QuoteCTA";
import CTABanner from "@/components/CTABanner";
import { whyChoose, guarantees, badges } from "@/lib/content";
import { CheckIcon, SparkleIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Dave Cleaning Services delivers reliable domestic and commercial cleaning across London — professional, fully insured and satisfaction-focused.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="About Dave Cleaning Services"
        intro="Reliable domestic and commercial cleaning across London, delivered with attention to detail, flexible appointments and a professional service from start to finish."
      />

      {/* Intro */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="space-y-5 text-base leading-relaxed text-slate-500">
            <Reveal>
              <p>
                We take pride in delivering a clean, reliable and professional
                service — every time, on every job. From family homes and
                serviced apartments to offices, communal areas and managed
                residential blocks, we bring the same commitment to detail
                regardless of the size of the property.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p>
                Whether you need regular domestic cleaning, a one-off deep clean,
                an end-of-tenancy clean or ongoing commercial cover, our vetted
                and fully insured team makes the whole process simple — with
                clear communication and a responsive admin team to help at every
                step.
              </p>
            </Reveal>
          </div>

          <Reveal direction="left" delay={0.2}>
            <div className="relative overflow-hidden rounded-3xl border border-bolt/20 bg-gradient-to-br from-white to-slate-50 p-8">
              <div className="grid-bg absolute inset-0 opacity-40" />
              <span className="relative grid h-12 w-12 place-items-center rounded-xl bg-bolt text-white">
                <SparkleIcon className="h-6 w-6" />
              </span>
              <p className="relative mt-5 font-display text-xl font-bold text-slate-900">
                Domestic &amp; commercial cleaning
              </p>
              <p className="relative mt-3 text-sm text-slate-500">
                Regular, one-off, deep, end-of-tenancy, after-builders and
                commercial cleaning across London and surrounding areas.
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

      {/* Why choose */}
      <section className="bg-slate-50/70 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading
            eyebrow="Why choose us"
            title="Cleaning you can rely on"
            description="We focus on making the entire process simple — from your first enquiry through to completion."
            align="center"
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {whyChoose.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.08}>
                <div className="h-full rounded-2xl border border-slate-200 bg-white p-7">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-bolt/10 text-bolt ring-1 ring-bolt/20">
                    <CheckIcon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-bold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    {item.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Property types */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        <SectionHeading
          eyebrow="Property types"
          title="Every kind of cleaning environment"
          align="center"
        />
        <div className="mt-10">
          <SectorsGrid />
        </div>
      </section>

      {/* Guarantee */}
      <section className="bg-slate-50/70 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading
            eyebrow="Our promise"
            title="A service you can trust"
            description="Clear communication, guide pricing up front and a satisfaction focus on every clean."
            align="center"
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {guarantees.map((g, i) => (
              <Reveal key={g.title} delay={i * 0.1}>
                <div className="group h-full rounded-2xl border border-slate-200 bg-white p-7 transition-colors hover:border-bolt/40">
                  <span className="font-display text-5xl font-bold text-bolt/15 transition-colors group-hover:text-bolt/30">
                    0{i + 1}
                  </span>
                  <h3 className="mt-3 font-display text-xl font-bold text-slate-900">
                    {g.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-500">
                    {g.body}
                  </p>
                  {g.points && (
                    <ul className="mt-3 space-y-2">
                      {g.points.map((pt) => (
                        <li
                          key={pt}
                          className="flex items-start gap-2 text-sm leading-relaxed text-slate-500"
                        >
                          <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-bolt" />
                          {pt}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <QuoteCTA />

      <CTABanner punchline="Before-and-after photographs available on request. We keep everything clear and simple — no confusing jargon, just a reliable clean and honest communication." />
    </>
  );
}
