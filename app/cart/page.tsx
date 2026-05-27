import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import CartView from "@/components/CartView";

export const metadata: Metadata = {
  title: "Your cart",
  description: "Review your selected services before checkout.",
};

export default function CartPage() {
  return (
    <>
      <PageHero
        eyebrow="Cart"
        title="Your cart"
        intro="Review your booking before checkout. You'll pay a 50% deposit now to confirm — the remaining 50% is paid once the work is complete and your certificate is issued."
      />
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <CartView />
      </section>
    </>
  );
}
