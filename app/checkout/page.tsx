import type { Metadata } from "next";
import { redirect } from "next/navigation";
import PageHero from "@/components/PageHero";
import CheckoutForm from "@/components/CheckoutForm";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Secure checkout — pay your 50% deposit via Razorpay (GBP).",
};

export default async function CheckoutPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login?next=/checkout");
  }

  return (
    <>
      <PageHero
        eyebrow="Checkout"
        title="Secure checkout"
        intro="Confirm your details and pay the 50% deposit via Razorpay to book your work. The remaining balance is paid once your certificate is issued."
      />
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <CheckoutForm user={{ name: session.name, email: session.email }} />
      </section>
    </>
  );
}
