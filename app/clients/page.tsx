import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import QuoteCTA from "@/components/QuoteCTA";
import CTABanner from "@/components/CTABanner";
import ClientTile from "@/components/ClientTile";
import { realClients } from "@/lib/content";

export const metadata: Metadata = {
  title: "Clients",
  description:
    "Some of the clients Dave Electrical Services has worked with — Ministry of Sound, Electric Brixton, Rambert School, Hyatt Place, Bingham Riverhouse and many more.",
};

export default function ClientsPage() {
  return (
    <>
      <PageHero
        eyebrow="Clients"
        title="Clients – Dave Electrical Services"
        intro="Some of the clients we have worked with across Hounslow, Twickenham, Feltham, Cranford and Greater London — from members clubs and music venues to schools, hotels and chartered firms. References available on request."
      />

      {/* Brand grid */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <Reveal>
          <p className="text-center font-display text-2xl font-bold text-white sm:text-3xl">
            Some of the clients we have worked with include:
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-5">
          {realClients.map((brand, i) => (
            <Reveal key={brand.name} delay={(i % 5) * 0.06}>
              <ClientTile brand={brand} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <p className="mt-10 text-center text-xs text-ash">
            Logos and names shown are trademarks of their respective owners and
            are displayed to indicate previous installation, maintenance or
            testing work carried out by Dave Electrical Services.
          </p>
        </Reveal>
      </section>

      {/* Sector breakdown */}
      <section className="bg-coal py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading
            eyebrow="Sectors served"
            title="A diverse portfolio"
            description="From world-famous music venues to chartered accountants, hotels, restaurants, schools, fitness clubs, estate agents and student housing — we deliver electrical work across every commercial sector."
            align="center"
          />
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {[
              "Music & Live Events",
              "Hospitality & Hotels",
              "Restaurants",
              "Schools & Education",
              "Estate Agents",
              "Healthcare & Wellness",
              "Student Accommodation",
              "Chartered Firms",
              "Construction",
              "Architectural Lighting",
            ].map((s, i) => (
              <Reveal key={s} delay={i * 0.04} direction="none">
                <span className="flex items-center gap-2 rounded-full border border-white/10 bg-graphite px-5 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:border-bolt/40 hover:text-bolt">
                  {s}
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading
            eyebrow="What they say"
            title="Highly-regarded by our cherished clients"
            align="center"
            tone="light"
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                quote:
                  "Dave Electrical sorted our restaurant rewire over a weekend with zero disruption to service. Professional, tidy and properly certified.",
                author: "Operations Manager",
                role: "Hospitality client",
              },
              {
                quote:
                  "We needed a landlord certificate in a hurry — they turned it around fast and the paperwork was spotless. Highly recommended.",
                author: "Private Landlord",
                role: "Residential client",
              },
              {
                quote:
                  "Their 24 hour call-out got our production back up at 3am. Reliable, trustworthy and genuinely there when it matters.",
                author: "Facilities Lead",
                role: "Live events client",
              },
            ].map((t, i) => (
              <Reveal key={t.author} delay={i * 0.1}>
                <figure className="flex h-full flex-col rounded-2xl border border-zinc-200 bg-zinc-50 p-7">
                  <span className="font-display text-5xl leading-none text-bolt-deep">
                    &ldquo;
                  </span>
                  <blockquote className="-mt-3 flex-1 text-sm leading-relaxed text-zinc-700">
                    {t.quote}
                  </blockquote>
                  <figcaption className="mt-6 border-t border-zinc-200 pt-4">
                    <p className="text-sm font-semibold text-ink">{t.author}</p>
                    <p className="text-xs uppercase tracking-wider text-bolt-deep">
                      {t.role}
                    </p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <QuoteCTA />

      <CTABanner />
    </>
  );
}
