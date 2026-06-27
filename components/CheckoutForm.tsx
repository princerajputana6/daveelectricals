"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { motion } from "framer-motion";
import { useCart } from "./CartProvider";
import { formatGBP } from "@/lib/products";
import { ArrowIcon, CheckIcon } from "./Icons";

type RazorpayCheckoutOptions = {
  key: string;
  order_id: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
  handler: (resp: RazorpayResponse) => void;
  modal?: { ondismiss?: () => void };
};

type RazorpayResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

declare global {
  interface Window {
    Razorpay?: new (opts: RazorpayCheckoutOptions) => { open: () => void };
  }
}

const inputClass =
  "w-full rounded-xl border border-white/10 bg-ink px-4 py-3 text-sm text-white placeholder:text-ash transition-colors focus:border-bolt/60 focus:outline-none focus:ring-2 focus:ring-bolt/20";
const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ash";

export default function CheckoutForm({
  user,
}: {
  user: { name: string; email: string };
}) {
  const router = useRouter();
  const { lines, subtotal, deposit, balance, clear, count } = useCart();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMode, setPaymentMode] = useState<"split" | "full">("split");
  const upfrontAmount = paymentMode === "full" ? subtotal : deposit;
  const remainingAmount = paymentMode === "full" ? 0 : balance;
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    phone: "",
    address: "",
    preferredDate: "",
    notes: "",
  });

  // Earliest selectable visit date — today, in local yyyy-mm-dd.
  const minDate = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);

  const update = (k: string, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (count === 0) {
      setError("Your cart is empty.");
      return;
    }
    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.address.trim() ||
      !form.preferredDate
    ) {
      setError(
        "Please complete your name, phone, email, service address and preferred visit date.",
      );
      return;
    }
    if (!window.Razorpay) {
      setError(
        "Payment library hasn't loaded yet. Please wait a moment and try again.",
      );
      return;
    }
    setPending(true);

    try {
      // 1. Create the app order + Razorpay deposit order
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          items: lines.map((l) => ({
            productId: l.productId,
            variantId: l.variantId,
            qty: l.qty,
          })),
          customer: form,
          paymentMode,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Could not create order.");
        setPending(false);
        return;
      }

      // 2. Open Razorpay checkout
      const rzp = new window.Razorpay({
        key: data.razorpay.keyId,
        order_id: data.razorpay.orderId,
        amount: data.razorpay.amount,
        currency: data.razorpay.currency,
        name: "Dave Electrical Services",
        description:
          paymentMode === "full"
            ? `Full payment for order #${data.order.id.slice(-6).toUpperCase()}`
            : `50% deposit for order #${data.order.id.slice(-6).toUpperCase()}`,
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        theme: { color: "#e2e61f" },
        modal: {
          ondismiss: () => setPending(false),
        },
        handler: async (resp) => {
          try {
            const v = await fetch(`/api/orders/${data.order.id}/verify`, {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ ...resp, type: "deposit" }),
            });
            const vd = await v.json();
            if (!v.ok) {
              setError(vd?.error || "Payment could not be verified.");
              setPending(false);
              return;
            }
            clear();
            router.push(`/account?paid=${data.order.id}`);
            router.refresh();
          } catch {
            setError("Could not verify payment. Please contact us.");
            setPending(false);
          }
        },
      });
      rzp.open();
    } catch {
      setError("Network error. Please try again.");
      setPending(false);
    }
  };

  if (count === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-graphite p-10 text-center">
        <h2 className="font-display text-2xl font-bold text-white">
          Your cart is empty
        </h2>
        <p className="mt-2 text-sm text-ash">
          Add a service before checking out.
        </p>
        <Link
          href="/services"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-bolt px-6 py-3 font-bold text-ink"
        >
          Browse services
          <ArrowIcon className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <form
          onSubmit={handlePayment}
          className="rounded-3xl border border-white/10 bg-graphite p-7 sm:p-9"
        >
          <h2 className="font-display text-2xl font-bold text-white">
            Contact &amp; service address
          </h2>
          <p className="mt-1.5 text-sm text-ash">
            We&apos;ll use this information to schedule and complete your job.
          </p>

          <div className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Full name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Phone</label>
                <input
                  required
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="07000 000000"
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Service address</label>
              <textarea
                required
                rows={3}
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
                placeholder="House / Flat number, Street, Postcode"
                className={`${inputClass} resize-none`}
              />
            </div>
            <div>
              <label className={labelClass}>Preferred visit date</label>
              <input
                required
                type="date"
                min={minDate}
                value={form.preferredDate}
                onChange={(e) => update("preferredDate", e.target.value)}
                className={`${inputClass} [color-scheme:dark]`}
              />
            </div>
            <div>
              <label className={labelClass}>
                Notes <span className="lowercase opacity-60">(optional)</span>
              </label>
              <textarea
                rows={2}
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
                placeholder="Number of appliances, access instructions, preferred dates…"
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300"
            >
              {error}
            </motion.p>
          )}

          {/* Payment choice */}
          <fieldset className="mt-7">
            <legend className="mb-3 block text-xs font-semibold uppercase tracking-wider text-ash">
              Payment option
            </legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <label
                className={`relative cursor-pointer rounded-2xl border p-4 transition-all ${
                  paymentMode === "split"
                    ? "border-bolt bg-bolt/10"
                    : "border-white/10 bg-ink hover:border-bolt/40"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMode"
                  value="split"
                  checked={paymentMode === "split"}
                  onChange={() => setPaymentMode("split")}
                  className="sr-only"
                />
                <div className="flex items-center justify-between">
                  <span
                    className={`font-display text-base font-bold ${
                      paymentMode === "split" ? "text-bolt" : "text-white"
                    }`}
                  >
                    50% deposit
                  </span>
                  <span
                    className={`grid h-5 w-5 place-items-center rounded-full border-2 ${
                      paymentMode === "split"
                        ? "border-bolt bg-bolt"
                        : "border-white/30"
                    }`}
                  >
                    {paymentMode === "split" && (
                      <span className="h-2 w-2 rounded-full bg-ink" />
                    )}
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-ash">
                  Pay {formatGBP(deposit)} now, {formatGBP(balance)} on
                  completion.
                </p>
              </label>

              <label
                className={`relative cursor-pointer rounded-2xl border p-4 transition-all ${
                  paymentMode === "full"
                    ? "border-bolt bg-bolt/10"
                    : "border-white/10 bg-ink hover:border-bolt/40"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMode"
                  value="full"
                  checked={paymentMode === "full"}
                  onChange={() => setPaymentMode("full")}
                  className="sr-only"
                />
                <div className="flex items-center justify-between">
                  <span
                    className={`font-display text-base font-bold ${
                      paymentMode === "full" ? "text-bolt" : "text-white"
                    }`}
                  >
                    Pay in full
                  </span>
                  <span
                    className={`grid h-5 w-5 place-items-center rounded-full border-2 ${
                      paymentMode === "full"
                        ? "border-bolt bg-bolt"
                        : "border-white/30"
                    }`}
                  >
                    {paymentMode === "full" && (
                      <span className="h-2 w-2 rounded-full bg-ink" />
                    )}
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-ash">
                  Pay {formatGBP(subtotal)} now — no balance owed at the end.
                </p>
              </label>
            </div>
          </fieldset>

          <button
            type="submit"
            disabled={pending}
            className="group mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-bolt px-6 py-3.5 font-bold text-ink transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending
              ? "Opening secure payment…"
              : paymentMode === "full"
                ? `Pay in full · ${formatGBP(subtotal)}`
                : `Pay deposit · ${formatGBP(deposit)}`}
            {!pending && (
              <ArrowIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            )}
          </button>
          <p className="mt-3 text-center text-[11px] text-ash">
            You&apos;ll be redirected to Razorpay&apos;s secure checkout. No card
            details are stored on our servers.
          </p>
        </form>

        <aside className="h-fit space-y-5">
          <div className="rounded-2xl border border-white/10 bg-graphite p-7">
            <h2 className="font-display text-lg font-bold text-white">
              Order summary
            </h2>
            <ul className="mt-4 space-y-3 text-sm">
              {lines.map((l) => (
                <li
                  key={l.key}
                  className="flex items-start justify-between gap-3 border-b border-white/5 pb-3 last:border-b-0"
                >
                  <div>
                    <p className="font-semibold text-white">{l.name}</p>
                    {l.variantLabel && (
                      <p className="text-[11px] uppercase tracking-wider text-bolt">
                        {l.variantLabel}
                      </p>
                    )}
                    <p className="mt-0.5 text-xs text-ash">
                      {l.qty} × {formatGBP(l.price)}
                    </p>
                  </div>
                  <p className="font-bold text-bolt">{formatGBP(l.lineTotal)}</p>
                </li>
              ))}
            </ul>
            <dl className="mt-5 space-y-2 text-sm">
              <Row label="Subtotal" value={formatGBP(subtotal)} />
              <Row
                label={
                  paymentMode === "full"
                    ? "Pay now (full)"
                    : "Pay now (50% deposit)"
                }
                value={formatGBP(upfrontAmount)}
                highlight
              />
              <Row
                label={
                  paymentMode === "full" ? "Owed after work" : "Pay on completion"
                }
                value={formatGBP(remainingAmount)}
              />
            </dl>
          </div>

          <div className="rounded-2xl border border-bolt/20 bg-bolt/5 p-5">
            <p className="flex items-center gap-2 font-display text-sm font-bold text-bolt">
              <CheckIcon className="h-4 w-4" /> How payment works
            </p>
            <ol className="mt-2 space-y-1.5 text-xs text-ash">
              <li>1. Pay 50% deposit now via Razorpay (GBP)</li>
              <li>2. We schedule and carry out the work</li>
              <li>3. Your certificate is issued and shows in your account</li>
              <li>4. Pay the remaining 50% balance once complete</li>
            </ol>
          </div>
        </aside>
      </div>
    </>
  );
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-ash">{label}</dt>
      <dd
        className={
          highlight
            ? "font-display text-lg font-bold text-bolt"
            : "font-semibold text-white"
        }
      >
        {value}
      </dd>
    </div>
  );
}
