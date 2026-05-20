import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import Testimonials from "@/components/Testimonials";
import CTABanner from "@/components/CTABanner";
import ClientLogo from "@/components/ClientLogo";
import { clientSectors } from "@/lib/content";

export const metadata: Metadata = {
  title: "Clients",
  description:
    "Some of the clients Dave Electrical Services has worked with across hospitality, retail, education, healthcare, industrial and the public sector.",
};

export default function ClientsPage() {
  return (
    <>
      <PageHero
        eyebrow="Clients"
        title="The clients we work with"
        intro="Some of the clients we have worked with across West London. We have a large portfolio of happy, satisfied customers — and we are more than happy to share contacts if you would like references."
      />

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <SectionHeading
          eyebrow="Our portfolio"
          title="Trusted by businesses across every sector"
          description="From small start-ups to large brands, our clients rely on us for reliable, convenient and safe electrical work."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clientSectors.map((client, i) => (
            <Reveal key={client.name} delay={(i % 3) * 0.08}>
              <div className="group flex items-center rounded-2xl border border-white/10 bg-graphite p-5 transition-all hover:-translate-y-1 hover:border-bolt/40">
                <ClientLogo name={client.name} sector={client.sector} />
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.2}>
          <p className="mt-8 text-center text-xs text-ash">
            Client names shown are representative of the sectors served. Verified
            references available on request.
          </p>
        </Reveal>
      </section>

      {/* Testimonials */}
      <section className="bg-coal py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading
            eyebrow="What they say"
            title="Highly-regarded by our cherished clients"
            align="center"
          />
          <div className="mt-12">
            <Testimonials />
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
