import Link from "next/link";
import Hero from "@/components/Hero";
import LandlordRibbon from "@/components/LandlordRibbon";
import StatsStrip from "@/components/StatsStrip";
import SectionHeading from "@/components/SectionHeading";
import ServiceCard from "@/components/ServiceCard";
import Reveal from "@/components/Reveal";
import SectorsGrid from "@/components/SectorsGrid";
import Testimonials from "@/components/Testimonials";
import QuoteCTA from "@/components/QuoteCTA";
import CTABanner from "@/components/CTABanner";
import { services, accreditationPoints, howItWorks, company } from "@/lib/content";
import { ArrowIcon, CheckIcon, SparkleIcon } from "@/components/Icons";

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Landlord / estate-agent specialist ribbon */}
      <LandlordRibbon />

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <StatsStrip />
      </section>

      {/* Why choose us */}
      <section className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Why choose us"
              title="Cleaning you can rely on"
              description="We focus on making the entire process simple — from your first enquiry through to completion. Reliable appointments, a professional team and careful attention to detail on every visit."
            />
            <Reveal delay={0.3}>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {accreditationPoints.map((point) => (
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
            <Reveal delay={0.4}>
              <Link
                href="/how-it-works"
                className="group mt-8 inline-flex items-center gap-2 font-semibold text-bolt no-underline hover:no-underline"
              >
                See how it works
                <ArrowIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>

          <Reveal direction="left" delay={0.2}>
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-8 shadow-sm">
              <div className="grid-bg absolute inset-0 opacity-40" />
              <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-bolt/15 blur-3xl" />
              <span className="relative grid h-12 w-12 place-items-center rounded-xl bg-bolt text-white">
                <SparkleIcon className="h-6 w-6" />
              </span>
              <h3 className="relative mt-5 font-display text-2xl font-bold text-slate-900">
                Fully insured &amp; vetted cleaners
              </h3>
              <p className="relative mt-3 text-sm leading-relaxed text-slate-500">
                Every clean is carried out by a professional, trusted team — with
                clear communication, straightforward booking and a satisfaction
                focus from start to finish.
              </p>
              <div className="relative mt-6 flex flex-wrap gap-2">
                {[
                  company.napit,
                  company.certificate,
                  "Domestic & Commercial",
                  "Flexible Appointments",
                ].map((b) => (
                  <span
                    key={b}
                    className="flex items-center gap-1.5 rounded-full border border-bolt/30 bg-bolt/5 px-3 py-1.5 text-xs font-semibold text-bolt"
                  >
                    <CheckIcon className="h-3 w-3" />
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Services */}
      <section className="relative bg-slate-50/70 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="What we do"
              title="Cleaning services, done properly"
              description="Domestic, commercial and property cleaning across London and surrounding areas."
            />
            <Reveal delay={0.2}>
              <Link
                href="/services"
                className="group flex items-center gap-2 rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-900 transition-colors hover:border-bolt/40 hover:text-bolt no-underline"
              >
                All services
                <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <ServiceCard key={service.slug} service={service} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        <SectionHeading
          eyebrow="How it works"
          title="From first enquiry to a cleaner property"
          description="A simple, four-step process with a real person to help at every stage."
          align="center"
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {howItWorks.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.1}>
              <div className="relative h-full rounded-2xl border border-slate-200 bg-white p-7">
                <span className="font-display text-5xl font-bold text-bolt">
                  0{i + 1}
                </span>
                <h3 className="mt-3 font-display text-lg font-bold text-slate-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {step.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Sectors / property types */}
      <section className="bg-slate-50/70 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading
            eyebrow="Property types"
            title="Every kind of cleaning environment"
            description="Dave Cleaning Services can support cleaning across many different property types."
            align="center"
          />
          <div className="mt-12">
            <SectorsGrid />
          </div>
        </div>
      </section>

      {/* Areas teaser */}
      <section className="mx-auto max-w-7xl px-5 py-16 text-center sm:px-8 sm:py-24">
        <SectionHeading
          eyebrow="Areas we cover"
          title="Covering all areas within the M25 &amp; beyond"
          description="Domestic, commercial and property cleaning across London and the surrounding areas."
          align="center"
        />
        <Reveal delay={0.3}>
          <Link
            href="/our-reach"
            className="group mt-8 inline-flex items-center gap-2 rounded-full bg-bolt px-7 py-3.5 font-bold text-white transition-transform hover:scale-[1.04] no-underline"
          >
            See areas we cover
            <ArrowIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </section>

      {/* Reviews */}
      <section className="bg-slate-50/70 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading
            eyebrow="Customer reviews"
            title="Trusted by our customers"
            description="Don't just take our word for it — here's what our clients say about working with us."
            align="center"
          />
          <div className="mt-12">
            <Testimonials />
          </div>
        </div>
      </section>

      <QuoteCTA />

      <CTABanner punchline="Ready for a cleaner property? Whether you need regular domestic cleaning, end-of-tenancy cleaning or commercial cleaning, speak to Dave Cleaning Services today for a free, no-obligation quote." />
    </>
  );
}
