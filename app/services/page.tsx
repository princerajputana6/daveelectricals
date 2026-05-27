import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import ServiceCard from "@/components/ServiceCard";
import Reveal from "@/components/Reveal";
import HazardStripe from "@/components/HazardStripe";
import EmergencyLightingFaq from "@/components/EmergencyLightingFaq";
import TestingRegime from "@/components/TestingRegime";
import Accreditations from "@/components/Accreditations";
import QuoteCTA from "@/components/QuoteCTA";
import CTABanner from "@/components/CTABanner";
import { services } from "@/lib/content";
import { BoltIcon, CheckIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Electrical Services",
  description:
    "Electrical installation & maintenance, commercial work, certification, 24 hour call-outs, PAT testing, emergency lighting, CCTV and EV charging across Hounslow, Twickenham, Feltham & Cranford.",
};

const process = [
  {
    title: "Get in touch",
    body: "Call, email or WhatsApp us with your requirements for a free, no-obligation quote.",
  },
  {
    title: "Site assessment",
    body: "We assess the work, account for surprises and plan the safest, most efficient approach.",
  },
  {
    title: "Expert delivery",
    body: "Our fully trained electricians carry out the work to the very latest standards.",
  },
  {
    title: "Certify & guarantee",
    body: "We issue the compliance certificates you need, backed by a 12-month guarantee.",
  },
];

const patHighlights = [
  "Trusted by start-ups to large brands",
  "Reliable, convenient & safe",
  "Cost-friendly — never compromising on safety",
  "Fully accredited engineers",
  "Itemised report & legal certificate",
  "Minor repairs included free",
];

const legalPoints = [
  "Inspection & testing is a legal requirement in the UK",
  "Periodic reports for genuine peace of mind",
  "Certificates for insurance, councils and HMOs",
  "Legal paperwork provided at no extra cost",
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Electrical Services"
        intro="Electrical installation and maintenance for domestic, commercial and industrial clients across Hounslow, Twickenham, Feltham & Cranford — delivered safely, to legal standards, and fully certified."
      />

      {/* Yellow ribbon tagline */}
      <section className="relative bg-bolt text-ink">
        <HazardStripe />
        <p className="py-5 px-5 text-center font-display text-lg font-bold uppercase tracking-wide sm:text-2xl">
          Electrical Services Hounslow, Twickenham, Feltham &amp; Cranford
        </p>
        <HazardStripe />
      </section>

      {/* All services grid */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <SectionHeading
          eyebrow="What we offer"
          title="Every service, fully certified"
          description="From a single fault repair to a full commercial fit-out — our team handles installation, maintenance, testing and compliance under one roof."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <ServiceCard key={service.slug} service={service} index={i} expanded />
          ))}
        </div>
      </section>

      {/* PAT Testing deep-dive — white section */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div>
              <SectionHeading
                eyebrow="PAT Testing Made Simple"
                title="Why choose Dave Electrical for PAT Testing?"
                description="Every business uses electrical appliances of some kind, making Portable Appliance Testing vital. PAT Testing gives you peace of mind by identifying electrical faults and offering advice to make sure your business avoids dangerous accidents."
                tone="light"
              />
              <Reveal delay={0.2}>
                <p className="mt-5 text-sm leading-relaxed text-zinc-700">
                  Even though we&apos;re cost-friendly, we never compromise on
                  safety. Our professional engineers are fully accredited and
                  will perform a thorough service, with an itemised report and
                  legal certificate to prove your adherence to UK guidelines.
                  We&apos;ll test all your appliances in one easy visit — and
                  you even get minor repairs included for free.
                </p>
              </Reveal>
            </div>

            <Reveal direction="left" delay={0.2}>
              <ul className="space-y-3">
                {patHighlights.map((p) => (
                  <li
                    key={p}
                    className="flex items-start gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-medium text-zinc-800"
                  >
                    <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                    {p}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={0.3}>
            <div className="mt-10 rounded-2xl border-l-4 border-bolt bg-zinc-100 p-6">
              <p className="font-display text-base font-bold text-ink">
                Your legal obligations
              </p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-700">
                The Electricity at Work Regulations are in place to prevent
                death or personal injury caused by electrics in the workplace.
                Business owners without a record of safety measures will be
                liable in the event of an accident and may fail to claim
                insurance without proof of safe practices. PAT Testing from Dave
                Electrical is a safety net of evidence when it comes to legal
                compliance — we provide your legal paperwork at no extra cost.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Emergency Lighting */}
      <section className="bg-coal py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading
            eyebrow="Emergency Lighting"
            title="Design, installation & testing — BS5266 / BS5588"
            description="Under the Regulatory Reform (Fire Safety) Order 2005 it is mandatory to undertake a written Fire Risk Assessment and to maintain this as a living document. We assist in the design and costing of suitable emergency lighting systems so escape routes are illuminated for safe evacuation on power failure."
          />

          <div className="mt-12">
            <h3 className="font-display text-xl font-bold text-white">
              The testing regime
            </h3>
            <p className="mt-2 text-sm text-ash">
              Tested for periods without turning off the main lighting system.
            </p>
            <div className="mt-6">
              <TestingRegime />
            </div>
          </div>

          <div className="mt-14 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <Reveal>
              <div className="rounded-2xl border border-white/10 bg-graphite p-7">
                <h3 className="font-display text-xl font-bold text-white">
                  Frequently asked
                </h3>
                <p className="mt-2 text-sm text-ash">
                  Answers to the questions our customers ask most often about
                  emergency lighting.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {["BS5266", "BS5588", "Fire Safety Order 2005"].map((t) => (
                    <span
                      key={t}
                      className="flex items-center gap-1.5 rounded-full border border-bolt/30 bg-bolt/5 px-3 py-1.5 text-[11px] font-semibold text-bolt"
                    >
                      <BoltIcon className="h-3 w-3" />
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal direction="left" delay={0.15}>
              <EmergencyLightingFaq />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading
            eyebrow="How we work"
            title="A simple, transparent process"
            align="center"
            tone="light"
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {process.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.1}>
                <div className="relative h-full rounded-2xl border border-zinc-200 bg-zinc-50 p-7">
                  <span className="font-display text-5xl font-bold text-bolt-deep">
                    0{i + 1}
                  </span>
                  <h3 className="mt-3 font-display text-lg font-bold text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                    {step.body}
                  </p>
                  {i < process.length - 1 && (
                    <span className="absolute right-6 top-9 hidden h-px w-12 bg-bolt-deep/40 lg:block" />
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Compliance"
              title="Your legal obligations, covered"
              description="The Electricity at Work Regulations are in place to prevent death or personal injury caused by electrics in the workplace. Business owners without a record of safety measures may be liable in the event of an accident."
            />
          </div>
          <Reveal direction="left" delay={0.2}>
            <ul className="space-y-3">
              {legalPoints.map((point) => (
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
        </div>
      </section>

      {/* Accreditations — white */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading
            eyebrow="Accreditations"
            title="Qualified, registered & certified"
            align="center"
            tone="light"
          />
          <div className="mt-12">
            <Accreditations />
          </div>
        </div>
      </section>

      <QuoteCTA />

      <CTABanner />
    </>
  );
}
