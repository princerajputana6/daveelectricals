import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import ServiceCard from "@/components/ServiceCard";
import Reveal from "@/components/Reveal";
import QuoteCTA from "@/components/QuoteCTA";
import CTABanner from "@/components/CTABanner";
import {
  services,
  whatsIncluded,
  whatsIncludedExtras,
} from "@/lib/content";
import { ArrowIcon, CheckIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Cleaning Services",
  description:
    "Regular, one-off, deep, end of tenancy, after builders, carpet & upholstery and commercial cleaning across London and surrounding areas.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Cleaning Services, Done Properly"
        intro="Domestic, commercial and property cleaning across London and surrounding areas — delivered by a professional, fully insured team."
      />

      {/* All services */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <ServiceCard key={service.slug} service={service} index={i} expanded />
          ))}
        </div>
      </section>

      {/* What's included */}
      <section className="bg-slate-50/70 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading
            eyebrow="What's included"
            title="What a standard clean covers"
            description="Here's what's included as standard across the main areas of your property. Optional extras are available on request."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {whatsIncluded.map((room) => (
              <Reveal key={room.area}>
                <div className="h-full rounded-2xl border border-slate-200 bg-white p-7">
                  <h3 className="font-display text-xl font-bold text-slate-900">
                    {room.area}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {room.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-bolt/20 bg-bolt/5 p-5">
              <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-bolt" />
              <p className="text-sm font-medium leading-relaxed text-slate-700">
                {whatsIncludedExtras}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="mx-auto max-w-7xl px-5 py-16 text-center sm:px-8 sm:py-24">
        <SectionHeading
          eyebrow="Pricing"
          title="Clear, honest guide pricing"
          description="See starting prices by property size and service type — no hidden charges."
          align="center"
        />
        <Reveal delay={0.2}>
          <Link
            href="/pricing"
            className="group mt-8 inline-flex items-center gap-2 rounded-full bg-bolt px-7 py-3.5 font-bold text-white transition-transform hover:scale-[1.04] no-underline"
          >
            View pricing
            <ArrowIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </section>

      <QuoteCTA />
      <CTABanner punchline="Guide prices for every property size and every service. No hidden costs, no surprise charges — just a clear quote before we start." />
    </>
  );
}
