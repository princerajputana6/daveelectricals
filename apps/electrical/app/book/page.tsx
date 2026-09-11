import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SlotBooking from "@/components/SlotBooking";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Book a same-day emergency slot",
  description:
    "Book a same-day emergency electrical call-out slot online and pay in full via Stripe. Live availability — booked slots show as unavailable.",
};

export default async function BookPage() {
  const session = await getSession();
  const user = session ? { name: session.name, email: session.email } : null;

  return (
    <>
      <PageHero
        eyebrow="Same-day emergency"
        title="Book your slot"
        intro="Pick an available same-day emergency call-out slot and pay in full to secure it. Slots update live — once a slot is booked it shows as unavailable."
      />
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <SlotBooking user={user} />
      </section>
    </>
  );
}
