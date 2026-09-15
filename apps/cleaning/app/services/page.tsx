import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import ServiceBookingCard from "@/components/ServiceBookingCard";
import Reveal from "@/components/Reveal";
import QuoteCTA from "@/components/QuoteCTA";
import CTABanner from "@/components/CTABanner";
import {
  services,
  whatsIncluded,
  whatsIncludedExtras,
} from "@/lib/content";
import { CheckIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Cleaning Services",
  description:
    "Regular, one-off, deep, end of tenancy, after builders, carpet & upholstery and commercial cleaning across London and surrounding areas. Book online with instant guide pricing.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services & booking"
        title="Cleaning Services, Done Properly"
        intro="Pick a service, choose your property size and see your price instantly — then book online in minutes. Domestic, commercial and property cleaning across London and the surrounding areas."
      />

      {/* All services — each with instant pricing + booking */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <ServiceBookingCard
              key={service.slug}
              service={service}
              index={i}
              expanded
            />
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-slate-500">
          All prices are starting guide prices shown ex VAT and may vary with the
          size, condition and specific requirements of your property. VAT is added
          at checkout. 6+ bedroom properties are priced on a quick quote.
        </p>
      </section>

      {/* What's included */}
      <section className="bg-slate-100/80 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading
            eyebrow="What's included"
            title="What a standard clean covers"
            description="Here's what's included as standard across the main areas of your property. Optional extras are available on request."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {whatsIncluded.map((room) => (
              <Reveal key={room.area}>
                <div className="h-full rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
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

      <QuoteCTA />
      <CTABanner punchline="Instant guide prices for every property size and every service. No hidden costs, no surprise charges — see your price and book in minutes." />
    </>
  );
}
