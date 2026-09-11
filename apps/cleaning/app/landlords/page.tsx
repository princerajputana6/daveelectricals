import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import QuoteCTA from "@/components/QuoteCTA";
import CTABanner from "@/components/CTABanner";
import { landlords } from "@/lib/content";
import { ArrowIcon, CheckIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Landlords & Estate Agents",
  description:
    "Property cleaning without the hassle. End of tenancy, move-in, deep and communal-area cleaning for landlords and estate agents — coordinated directly with tenants where required.",
};

export default function LandlordsPage() {
  return (
    <>
      <PageHero
        eyebrow="Landlords & Agents"
        title={landlords.heading}
        intro={landlords.intro}
      />

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="For property professionals"
              title="Cleaning support for your portfolio"
              description="From single move-outs to multiple-property bookings, we make managed-property cleaning straightforward."
            />
          </div>
          <Reveal direction="left" delay={0.2}>
            <ul className="grid gap-3 sm:grid-cols-2">
              {landlords.points.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600"
                >
                  <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-bolt" />
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.2}>
          <div className="mt-12 overflow-hidden rounded-3xl border border-bolt/30 bg-gradient-to-br from-white to-slate-50 p-8 text-center sm:p-12">
            <h3 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
              {landlords.ctaHeading}
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-500">
              {landlords.ctaBody}
            </p>
            <Link
              href="/contact"
              className="group mt-7 inline-flex items-center gap-2 rounded-full bg-bolt px-7 py-3.5 font-bold text-white transition-transform hover:scale-[1.04] no-underline"
            >
              Discuss your portfolio
              <ArrowIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
      </section>

      <QuoteCTA />
      <CTABanner />
    </>
  );
}
