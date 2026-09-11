import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import QuoteCTA from "@/components/QuoteCTA";
import CTABanner from "@/components/CTABanner";
import {
  pricingRows,
  pricingNotes,
  pricingImportantNote,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Guide prices for regular, one-off, deep, end of tenancy and after builders cleaning by property size. All prices are starting prices and may vary by property.",
};

const columns = [
  { key: "regular", label: "Regular" },
  { key: "oneOff", label: "One-Off" },
  { key: "deep", label: "Deep" },
  { key: "endOfTenancy", label: "End of Tenancy" },
  { key: "afterBuilders", label: "After Builders" },
] as const;

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Clear, honest guide pricing"
        intro="All prices are starting prices and may vary depending on the size, condition and specific cleaning requirements of the property."
      />

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <Reveal>
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-900">
                  <th className="px-4 py-3 font-display font-bold">Property size</th>
                  {columns.map((c) => (
                    <th key={c.key} className="px-4 py-3 font-display font-bold">
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pricingRows.map((row) => (
                  <tr
                    key={row.size}
                    className="border-t border-slate-200 odd:bg-white even:bg-slate-50/60"
                  >
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {row.size}
                    </td>
                    {columns.map((c) => (
                      <td key={c.key} className="px-4 py-3 text-slate-600">
                        {row[c.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <div className="mt-12">
          <SectionHeading
            eyebrow="More pricing"
            title="Regular, carpet & commercial rates"
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {pricingNotes.map((note) => (
              <Reveal key={note.title}>
                <div className="h-full rounded-2xl border border-slate-200 bg-white p-6">
                  <h3 className="font-display text-lg font-bold text-slate-900">
                    {note.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {note.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={0.15}>
          <div className="mt-8 rounded-2xl border-l-4 border-bolt bg-bolt/5 p-6">
            <p className="font-display text-base font-bold text-slate-900">
              Important pricing note
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {pricingImportantNote}
            </p>
          </div>
        </Reveal>
      </section>

      <QuoteCTA />
      <CTABanner />
    </>
  );
}
