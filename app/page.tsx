import Link from "next/link";
import Hero from "@/components/Hero";
import LandlordRibbon from "@/components/LandlordRibbon";
import StatsStrip from "@/components/StatsStrip";
import SectionHeading from "@/components/SectionHeading";
import ServiceCard from "@/components/ServiceCard";
import Reveal from "@/components/Reveal";
import Accreditations from "@/components/Accreditations";
import SectorsGrid from "@/components/SectorsGrid";
import Testimonials from "@/components/Testimonials";
import QuoteCTA from "@/components/QuoteCTA";
import CTABanner from "@/components/CTABanner";
import { services, accreditationPoints, company } from "@/lib/content";
import { ArrowIcon, BoltIcon, CheckIcon, ShieldIcon } from "@/components/Icons";

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Landlord EICR specialist ribbon */}
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
              title="Qualified Engineers, committed to quality &amp; safety"
              description="It is important that you get work done by qualified engineers working for businesses committed to quality, safety and customer care. Dave Electrical Services Limited is NAPIT registered and has demonstrated its competence, holds the necessary insurances and has the right processes to assure compliance."
            />
            <Reveal delay={0.3}>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {accreditationPoints.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-3 rounded-xl border border-white/10 bg-graphite p-4 text-sm text-zinc-300"
                  >
                    <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-bolt" />
                    {point}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.4}>
              <Link
                href="/about"
                className="group mt-8 inline-flex items-center gap-2 font-semibold text-bolt no-underline hover:no-underline"
              >
                More about Dave Electrical
                <ArrowIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>

          <Reveal direction="left" delay={0.2}>
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-graphite to-coal p-8">
              <div className="grid-bg absolute inset-0 opacity-40" />
              <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-bolt/15 blur-3xl" />
              <ShieldIcon className="relative h-12 w-12 text-bolt" />
              <h3 className="relative mt-5 font-display text-2xl font-bold text-white">
                NAPIT Registered &amp; Certified
              </h3>
              <p className="relative mt-3 text-sm leading-relaxed text-ash">
                Member of the Electrical Installer Certification and Third-Party
                Certifier Scheme. Authorised by the government&apos;s Competent
                Person Scheme to self-certify against Building Regulations.
              </p>
              <div className="relative mt-6 flex flex-wrap gap-2">
                {[company.napit, `Certificate ${company.certificate}`, "UKAS Accredited", "TrustMark"].map(
                  (b) => (
                    <span
                      key={b}
                      className="flex items-center gap-1.5 rounded-full border border-bolt/30 bg-bolt/5 px-3 py-1.5 text-xs font-semibold text-bolt"
                    >
                      <BoltIcon className="h-3 w-3" />
                      {b}
                    </span>
                  ),
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Accreditations — white section */}
      <section className="relative bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading
            eyebrow="Accreditations"
            title="Qualified, registered & certified"
            description="Industry-recognised qualifications and registrations that demonstrate our competence and commitment to safety standards."
            align="center"
            tone="light"
          />
          <div className="mt-12">
            <Accreditations />
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="relative bg-coal py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="What we do"
              title="Electrical services, done properly"
              description="Domestic, commercial and industrial — installation, maintenance and project consultancy across West London."
            />
            <Reveal delay={0.2}>
              <Link
                href="/services"
                className="group flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-bolt/40 hover:text-bolt no-underline"
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

      {/* Sectors with icons */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        <SectionHeading
          eyebrow="Sectors we serve"
          title="Every kind of electrical environment"
          description="Over the years we have worked all over West London in every kind of electrical environment."
          align="center"
        />
        <div className="mt-12">
          <SectorsGrid />
        </div>
      </section>

      {/* Our Reach teaser */}
      <section className="bg-coal py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 text-center sm:px-8">
          <SectionHeading
            eyebrow="Our Reach"
            title="Covering every area within the M25"
            description="Domestic, commercial, industrial and emergency call-outs — wherever you are inside the M25."
            align="center"
          />
          <Reveal delay={0.3}>
            <Link
              href="/our-reach"
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-bolt px-7 py-3.5 font-bold text-ink transition-transform hover:scale-[1.04] no-underline"
            >
              See areas we cover
              <ArrowIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        <SectionHeading
          eyebrow="Testimonials"
          title="Highly-regarded by our cherished clients"
          align="center"
        />
        <div className="mt-12">
          <Testimonials />
        </div>
      </section>

      <QuoteCTA />

      <CTABanner />
    </>
  );
}
