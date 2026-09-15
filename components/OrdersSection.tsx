"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { formatGBP } from "@/lib/products";
import { useCart } from "./CartProvider";
import { ArrowIcon, BoltIcon, CheckIcon, ShieldIcon } from "./Icons";

type Payment = {
  amount: number;
  currency: string;
  status: "created" | "paid" | "failed";
  manual?: boolean;
  paidAt?: string | Date;
};

export type OrderPublic = {
  id: string;
  userId?: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    preferredDate?: string;
    notes?: string;
    accessDetails?: string;
    keyCollection?: string;
  };
  booking?: {
    slotId: string;
    date: string;
    time: string;
  };
  items: {
    productId: string;
    variantId?: string;
    variantLabel?: string;
    name: string;
    unit: string;
    unitPrice: number;
    qty: number;
    lineTotal: number;
  }[];
  subtotal: number;
  vatRate?: number;
  vatAmount?: number;
  total?: number;
  deposit: number;
  balance: number;
  currency: string;
  paymentMode: "split" | "full";
  status:
    | "pending_deposit"
    | "pending_payment"
    | "deposit_paid"
    | "paid_in_full"
    | "in_progress"
    | "ready_for_balance"
    | "completed"
    | "cancelled";
  payments: { deposit: Payment | null; balance: Payment | null };
  certificate?: {
    number: string;
    type: string;
    issuedAt: string | Date;
    expiresAt?: string | Date;
    notes?: string;
    fileUrl?: string;
  };
  fullyPaid?: boolean;
  invoiceNumber?: string;
  quickbooks?: {
    customerId?: string;
    invoiceId?: string;
    depositPaymentId?: string;
    balancePaymentId?: string;
  };
  invoicePdf?: { url: string; publicId: string };
  createdAt: string | Date;
  updatedAt: string | Date;
};

const STATUS_LABEL: Record<OrderPublic["status"], string> = {
  pending_deposit: "Awaiting deposit",
  pending_payment: "Awaiting payment",
  deposit_paid: "Deposit received",
  paid_in_full: "Paid in full",
  in_progress: "Work in progress",
  ready_for_balance: "Ready for balance",
  completed: "Completed",
  cancelled: "Cancelled",
};

const STATUS_COLOR: Record<OrderPublic["status"], string> = {
  pending_deposit: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  pending_payment: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  deposit_paid: "bg-bolt/15 text-bolt border-bolt/30",
  paid_in_full: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  in_progress: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  ready_for_balance: "bg-purple-500/15 text-purple-300 border-purple-500/30",
  completed: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  cancelled: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
};

export default function OrdersSection({
  initial,
}: {
  initial: OrderPublic[];
  user?: { name: string; email: string };
}) {
  const router = useRouter();
  const search = useSearchParams();
  const justPaid = search.get("paid");
  const { clear } = useCart();
  const [orders, setOrders] = useState<OrderPublic[]>(initial);
  const [working, setWorking] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!justPaid) return;
    // Payment succeeded on Stripe and redirected back — empty the cart.
    clear();
    const t = setTimeout(() => {
      // Clear ?paid= from URL after 6s
      router.replace("/account");
    }, 6000);
    return () => clearTimeout(t);
  }, [justPaid, router, clear]);

  const payBalance = async (order: OrderPublic) => {
    setError(null);
    setWorking(order.id);
    try {
      const res = await fetch(`/api/orders/${order.id}/pay-balance`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok || !data.checkoutUrl) {
        setError(data?.error || "Could not start balance payment.");
        setWorking(null);
        return;
      }
      // Redirect to Stripe's secure hosted checkout for the balance.
      window.location.href = data.checkoutUrl;
    } catch {
      setError("Network error. Please try again.");
      setWorking(null);
    }
  };

  const certificates = orders.filter((o) => o.certificate);

  return (
    <>

      <AnimatePresence>
        {justPaid && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8 flex items-start gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-500 text-ink">
              <CheckIcon className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-base font-bold text-emerald-200">
                Payment received — thank you!
              </p>
              <p className="mt-0.5 text-sm text-emerald-200/80">
                Your deposit is paid and order{" "}
                <strong>#{justPaid.slice(-6).toUpperCase()}</strong> is now
                confirmed. We&apos;ll be in touch to schedule the work.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300">
          {error}
        </div>
      )}

      <div>
        <h2 className="font-display text-2xl font-bold text-white">
          Your orders
          <span className="ml-3 rounded-full bg-bolt/15 px-2.5 py-0.5 align-middle text-xs font-semibold text-bolt">
            {orders.length}
          </span>
        </h2>
        <p className="mt-2 text-sm text-ash">
          Track every booking and certificate issued for your account.
        </p>

        <div className="mt-7 space-y-5">
          {orders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/15 bg-graphite/60 p-10 text-center">
              <p className="font-display text-lg text-white">No orders yet</p>
              <p className="mt-2 text-sm text-ash">
                Browse our bookable services to place your first order.
              </p>
              <a
                href="/services"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-bolt px-5 py-2.5 text-sm font-bold text-ink"
              >
                Browse services
                <ArrowIcon className="h-4 w-4" />
              </a>
            </div>
          ) : (
            orders.map((o) => (
              <article
                key={o.id}
                className="overflow-hidden rounded-2xl border border-white/10 bg-graphite"
              >
                <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-6 py-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-display text-base font-bold text-white">
                      Order #{o.id.slice(-6).toUpperCase()}
                    </span>
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${
                        STATUS_COLOR[o.status]
                      }`}
                    >
                      {STATUS_LABEL[o.status]}
                    </span>
                  </div>
                  <time className="text-xs text-ash">
                    {new Date(o.createdAt).toLocaleString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </time>
                </header>

                <div className="grid gap-6 px-6 py-5 sm:grid-cols-[1.4fr_1fr]">
                  <div>
                    <ul className="space-y-2 text-sm">
                      {o.items.map((it) => (
                        <li
                          key={`${it.productId}::${it.variantId || ""}`}
                          className="flex items-start justify-between gap-3"
                        >
                          <span className="text-zinc-200">
                            <span className="font-semibold text-white">
                              {it.name}
                            </span>
                            {it.variantLabel && (
                              <span className="block text-[11px] uppercase tracking-wider text-bolt">
                                {it.variantLabel}
                              </span>
                            )}
                            <span className="text-ash">
                              {it.qty} × {formatGBP(it.unitPrice)}
                            </span>
                          </span>
                          <span className="font-bold text-bolt">
                            {formatGBP(it.lineTotal)}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <p className="mt-4 text-xs text-ash">
                      {o.customer.address}
                    </p>
                    {o.customer.notes && (
                      <p className="mt-2 rounded-lg border border-white/5 bg-ink/50 p-3 text-xs text-zinc-300">
                        <span className="font-semibold text-bolt">Notes: </span>
                        {o.customer.notes}
                      </p>
                    )}
                  </div>

                  <div className="rounded-xl border border-white/10 bg-ink p-4 text-sm">
                    <PaymentRow
                      label="Deposit (50%)"
                      paid={o.payments.deposit?.status === "paid"}
                      amount={o.deposit}
                    />
                    <PaymentRow
                      label="Balance (50%)"
                      paid={o.payments.balance?.status === "paid"}
                      amount={o.balance}
                    />
                    <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3 font-display text-base font-bold">
                      <span className="text-ash">Total</span>
                      <span className="text-white">
                        {formatGBP(o.subtotal)}
                      </span>
                    </div>

                    {(o.status === "ready_for_balance" ||
                      (o.status === "completed" &&
                        o.payments.balance?.status !== "paid")) && (
                      <button
                        type="button"
                        disabled={working === o.id}
                        onClick={() => payBalance(o)}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-bolt px-4 py-2.5 text-sm font-bold text-ink transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {working === o.id
                          ? "Opening…"
                          : `Pay balance · ${formatGBP(o.balance)}`}
                      </button>
                    )}
                  </div>
                </div>

                {o.certificate && (
                  <div className="border-t border-bolt/20 bg-bolt/5 px-6 py-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <span className="grid h-10 w-10 place-items-center rounded-full bg-bolt text-ink">
                          <ShieldIcon className="h-5 w-5" />
                        </span>
                        <div>
                          <p className="font-display text-sm font-bold text-bolt">
                            {o.certificate.type}
                          </p>
                          <p className="text-xs text-zinc-200">
                            Certificate # {o.certificate.number}
                          </p>
                          <p className="text-[11px] text-ash">
                            Issued{" "}
                            {new Date(o.certificate.issuedAt).toLocaleDateString(
                              "en-GB",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                            {o.certificate.expiresAt
                              ? ` · valid until ${new Date(
                                  o.certificate.expiresAt,
                                ).toLocaleDateString("en-GB", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}`
                              : ""}
                          </p>
                        </div>
                      </div>
                      <a
                        href={`/account/orders/${o.id}/certificate`}
                        className="inline-flex items-center gap-2 rounded-full bg-bolt px-4 py-2 text-xs font-semibold text-ink hover:scale-[1.04]"
                      >
                        View certificate
                        <ArrowIcon className="h-3.5 w-3.5" />
                      </a>
                    </div>
                    {o.certificate.notes && (
                      <p className="mt-3 text-xs text-zinc-300">
                        {o.certificate.notes}
                      </p>
                    )}
                  </div>
                )}
              </article>
            ))
          )}
        </div>
      </div>

      {certificates.length > 0 && (
        <div className="mt-14">
          <h2 className="font-display text-2xl font-bold text-white">
            Your certificates
            <span className="ml-3 rounded-full bg-bolt/15 px-2.5 py-0.5 align-middle text-xs font-semibold text-bolt">
              {certificates.length}
            </span>
          </h2>
          <p className="mt-2 text-sm text-ash">
            All electrical certificates we&apos;ve issued for you.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {certificates.map((o) => {
              const fullyPaid =
                o.payments.deposit?.status === "paid" &&
                (o.paymentMode === "full" ||
                  o.payments.balance?.status === "paid");
              return (
                <a
                  key={`cert-${o.id}`}
                  href={`/account/orders/${o.id}/certificate`}
                  className="block rounded-2xl border border-bolt/20 bg-gradient-to-br from-graphite to-coal p-5 transition-colors hover:border-bolt/50"
                >
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-bolt">
                    <BoltIcon className="h-3.5 w-3.5" />
                    {fullyPaid ? "Certified" : "Issued — balance owed"}
                  </p>
                  <p className="mt-2 font-display text-lg font-bold text-white">
                    {o.certificate!.type}
                  </p>
                  <p className="text-xs text-ash">
                    # {o.certificate!.number} · Order{" "}
                    {o.id.slice(-6).toUpperCase()}
                  </p>
                  <p className="mt-3 text-xs text-zinc-300">
                    Issued{" "}
                    {new Date(o.certificate!.issuedAt).toLocaleDateString(
                      "en-GB",
                      { day: "numeric", month: "short", year: "numeric" },
                    )}
                  </p>
                  <p className="mt-3 text-xs font-semibold text-bolt">
                    {fullyPaid ? "Open & download →" : "Pay balance to unlock →"}
                  </p>
                </a>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

function PaymentRow({
  label,
  paid,
  amount,
}: {
  label: string;
  paid: boolean;
  amount: number;
}) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="flex items-center gap-2 text-ash">
        <span
          className={`grid h-5 w-5 place-items-center rounded-full ${
            paid
              ? "bg-emerald-500/20 text-emerald-300"
              : "bg-white/5 text-zinc-500"
          }`}
        >
          {paid ? <CheckIcon className="h-3 w-3" /> : "·"}
        </span>
        {label}
      </span>
      <span className={paid ? "font-semibold text-white" : "text-ash"}>
        {formatGBP(amount)}
      </span>
    </div>
  );
}
