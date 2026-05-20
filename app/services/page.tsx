import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import ServiceCard from "@/components/ServiceCard";
import Reveal from "@/components/Reveal";
import CTABanner from "@/components/CTABanner";
import { services } from "@/lib/content";
import { CheckIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Electrical Services",
  description:
    "Electrical installation & maintenance, commercial work, certification, 24 hour call-outs, PAT testing and emergency lighting in Hounslow, Twickenham, Feltham & Cranford.",
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

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Electrical Services"
        intro="Electrical installation and maintenance for domestic, commercial and industrial clients across Hounslow, Twickenham, Feltham & Cranford — delivered safely, to legal standards, and fully certified."
      />

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <ServiceCard key={service.slug} service={service} index={i} expanded />
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="bg-coal py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading
            eyebrow="How we work"
            title="A simple, transparent process"
            align="center"
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {process.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.1}>
                <div className="relative h-full rounded-2xl border border-white/10 bg-graphite p-7">
                  <span className="font-display text-5xl font-bold text-gradient-bolt">
                    0{i + 1}
                  </span>
                  <h3 className="mt-3 font-display text-lg font-bold text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ash">
                    {step.body}
                  </p>
                  {i < process.length - 1 && (
                    <span className="absolute right-6 top-9 hidden h-px w-12 bg-bolt/30 lg:block" />
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Legal obligations */}
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
              {[
                "Inspection & testing is a legal requirement in the UK",
                "Periodic reports for genuine peace of mind",
                "Certificates for insurance, councils and HMOs",
                "Legal paperwork provided at no extra cost",
              ].map((point) => (
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

      <CTABanner />
    </>
  );
}
