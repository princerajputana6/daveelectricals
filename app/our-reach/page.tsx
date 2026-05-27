import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import OurReachMap from "@/components/OurReachMap";
import QuoteCTA from "@/components/QuoteCTA";
import CTABanner from "@/components/CTABanner";

export const metadata: Metadata = {
  title: "Our Reach",
  description:
    "Dave Electrical Services operates across Hounslow, Twickenham, Feltham & Cranford and the wider West London area — fully qualified electricians wherever you need us.",
};

export default function OurReachPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Reach"
        title="Areas We Cover"
        intro="We provide electrical services across Hounslow, Twickenham, Feltham, Cranford and the wider West London area. Find us on the map below."
      />

      <OurReachMap />

      <QuoteCTA />

      <CTABanner />
    </>
  );
}
