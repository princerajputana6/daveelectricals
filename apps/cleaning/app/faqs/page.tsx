import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import QuoteCTA from "@/components/QuoteCTA";
import CTABanner from "@/components/CTABanner";
import { faqs } from "@/lib/content";

export const metadata: Metadata = {
  title: "FAQs",
  description:
    "Frequently asked questions about Dave Cleaning Services — equipment, end of tenancy cleans, carpet add-ons, re-visits and more.",
};

export default function FaqsPage() {
  return (
    <>
      <PageHero
        eyebrow="FAQs"
        title="Frequently asked questions"
        intro="Answers to the questions our customers ask most often. Can't find what you need? Get in touch and we'll help."
      />

      <section className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <Reveal key={faq.q} delay={i * 0.06}>
              <details className="group rounded-2xl border border-slate-200 bg-white p-6 [&_summary]:cursor-pointer">
                <summary className="flex items-center justify-between gap-4 font-display text-base font-bold text-slate-900 marker:content-['']">
                  {faq.q}
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-bolt/30 bg-bolt/5 text-bolt transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {faq.a}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>

      <QuoteCTA />
      <CTABanner />
    </>
  );
}
