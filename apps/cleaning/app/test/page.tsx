import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import TestPaymentPanel from "@/components/TestPaymentPanel";

export const metadata: Metadata = {
  title: "Payment test",
  // Keep this internal test page out of search engines.
  robots: { index: false, follow: false },
};

export default function TestPage() {
  return (
    <>
      <PageHero
        eyebrow="Internal · payment test"
        title="Live Stripe payment test"
        intro="A £1 item to verify the live Stripe checkout end to end. Not linked anywhere public — reach it only via /test."
      />
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <TestPaymentPanel />
      </section>
    </>
  );
}
