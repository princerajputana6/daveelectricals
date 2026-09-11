import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import QuoteCTA from "@/components/QuoteCTA";
import CTABanner from "@/components/CTABanner";
import { howItWorks, whatsIncluded, whatsIncludedExtras } from "@/lib/content";
import { CheckIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "Booking a clean with Dave Cleaning Services is simple: tell us what you need, receive a clear quote, confirm your booking and we get cleaning.",
};

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        eyebrow="How It Works"
        title="A simple, four-step process"
        intro="We focus on making the entire process simple — from your first enquiry through to completion. Here's exactly what to expect."
      />

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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

      {/* What's included */}
      <section className="bg-slate-50/70 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading
            eyebrow="What's included"
            title="What a standard clean covers"
            description="A clear picture of the areas and tasks included as standard. Optional extras are available on request."
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

      <QuoteCTA />
      <CTABanner />
    </>
  );
}
