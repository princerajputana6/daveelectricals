import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { ObjectId } from "mongodb";
import PageHero from "@/components/PageHero";
import LogoutButton from "@/components/LogoutButton";
import OrdersSection, { type OrderPublic } from "@/components/OrdersSection";
import { ArrowIcon, BoltIcon, CheckIcon, MailIcon } from "@/components/Icons";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { ordersCol, publicOrder } from "@/lib/orders";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your account",
  description: "Manage your orders, enquiries and certificates.",
};

export default async function AccountPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const db = await getDb();
  const [enquiries, ordersDocs] = await Promise.all([
    db
      .collection("contacts")
      .find({
        $or: [{ userId: session.uid }, { email: session.email }],
      })
      .sort({ submittedAt: -1 })
      .limit(20)
      .toArray(),
    (await ordersCol())
      .find({ userId: session.uid })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray(),
  ]);

  const orders = ordersDocs.map(publicOrder) as unknown as OrderPublic[];

  return (
    <>
      <PageHero
        eyebrow="My Account"
        title={`Hello, ${session.name.split(" ")[0]}`}
        intro="Track your orders, certificates and enquiries — and manage your details with Dave Electrical Services."
      />

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_2.2fr]">
          {/* Profile sidebar */}
          <aside className="space-y-5">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-graphite p-7">
              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-bolt/15 blur-3xl" />
              <div className="relative flex items-center gap-4">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-bolt font-display text-xl font-bold text-ink">
                  {session.name
                    .split(" ")
                    .slice(0, 2)
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </span>
                <div>
                  <p className="font-display text-lg font-bold text-white">
                    {session.name}
                  </p>
                  <p className="flex items-center gap-1.5 text-xs text-ash">
                    <MailIcon className="h-3.5 w-3.5" />
                    {session.email}
                  </p>
                </div>
              </div>
              <div className="relative mt-5 flex flex-wrap gap-2">
                <span className="flex items-center gap-1.5 rounded-full border border-bolt/30 bg-bolt/5 px-3 py-1 text-[11px] font-semibold text-bolt">
                  <CheckIcon className="h-3 w-3" /> Verified account
                </span>
              </div>
              <div className="relative mt-6 flex flex-wrap gap-3">
                <Link
                  href="/services"
                  className="group inline-flex items-center gap-2 rounded-full bg-bolt px-5 py-2.5 text-sm font-bold text-ink transition-transform hover:scale-[1.04]"
                >
                  Book a service
                  <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <LogoutButton />
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-graphite p-6">
              <h3 className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-widest text-bolt">
                <BoltIcon className="h-4 w-4" /> Quick links
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-zinc-300">
                <li>
                  <Link href="/services" className="hover:text-bolt">
                    Browse services →
                  </Link>
                </li>
                <li>
                  <Link href="/cart" className="hover:text-bolt">
                    View your cart →
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-bolt">
                    Send a new enquiry →
                  </Link>
                </li>
              </ul>
            </div>
          </aside>

          {/* Main column */}
          <div>
            <Suspense fallback={null}>
              <OrdersSection
                initial={orders}
                user={{ name: session.name, email: session.email }}
              />
            </Suspense>

            {/* Enquiries */}
            <div className="mt-14">
              <h2 className="font-display text-2xl font-bold text-white">
                Your enquiries
                <span className="ml-3 rounded-full bg-bolt/15 px-2.5 py-0.5 align-middle text-xs font-semibold text-bolt">
                  {enquiries.length}
                </span>
              </h2>
              <p className="mt-2 text-sm text-ash">
                Every message you&apos;ve sent through our contact form.
              </p>

              <div className="mt-7 space-y-4">
                {enquiries.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/15 bg-graphite/60 p-10 text-center">
                    <p className="font-display text-lg text-white">
                      No enquiries yet
                    </p>
                    <p className="mt-2 text-sm text-ash">
                      When you send a message it&apos;ll appear here.
                    </p>
                  </div>
                ) : (
                  enquiries.map((e) => {
                    const id =
                      e._id instanceof ObjectId
                        ? e._id.toString()
                        : String(e._id);
                    const when = new Date(
                      e.submittedAt as Date,
                    ).toLocaleString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                    return (
                      <article
                        key={id}
                        className="rounded-2xl border border-white/10 bg-graphite p-6"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <span className="rounded-full border border-bolt/30 bg-bolt/5 px-3 py-1 text-xs font-semibold text-bolt">
                            {e.service}
                          </span>
                          <span className="text-xs text-ash">{when}</span>
                        </div>
                        <p className="mt-4 whitespace-pre-wrap text-sm text-zinc-300">
                          {e.message}
                        </p>
                        {e.phone && (
                          <p className="mt-3 text-xs text-ash">
                            Contact phone: {e.phone}
                          </p>
                        )}
                      </article>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
