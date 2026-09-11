"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { findProduct, formatGBP } from "@/lib/products";
import { ArrowIcon, CheckIcon, ClockIcon } from "./Icons";

type PublicSlot = {
  id: string;
  date: string;
  time: string;
  status: "open" | "booked" | "closed";
  booked: boolean;
};

const inputClass =
  "w-full rounded-xl border border-white/10 bg-ink px-4 py-3 text-sm text-white placeholder:text-ash transition-colors focus:border-bolt/60 focus:outline-none focus:ring-2 focus:ring-bolt/20";
const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ash";

function formatDay(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export default function SlotBooking({
  user,
}: {
  user: { name: string; email: string } | null;
}) {
  const product = findProduct("same-day-call-out");
  const price = product?.price ?? 0;

  const [slots, setSlots] = useState<PublicSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: user?.name ?? "",
    phone: "",
    address: "",
    notes: "",
  });
  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const loadSlots = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/slots", { cache: "no-store" });
      const data = await res.json();
      setSlots(Array.isArray(data.slots) ? data.slots : []);
    } catch {
      setSlots([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSlots();
  }, []);

  // Group slots by date, preserving chronological order.
  const grouped = useMemo(() => {
    const map = new Map<string, PublicSlot[]>();
    for (const s of slots) {
      if (!map.has(s.date)) map.set(s.date, []);
      map.get(s.date)!.push(s);
    }
    return [...map.entries()];
  }, [slots]);

  const selectedSlot = slots.find((s) => s.id === selected) || null;

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!selectedSlot) {
      setError("Please choose an available slot.");
      return;
    }
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
      setError("Please add your name, phone and the service address.");
      return;
    }
    setPending(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          slotId: selectedSlot.id,
          paymentMode: "full",
          customer: {
            name: form.name,
            email: user?.email,
            phone: form.phone,
            address: form.address,
            preferredDate: selectedSlot.date,
            notes: form.notes,
          },
        }),
      });
      const data = await res.json();
      if (res.status === 409) {
        // Slot taken while the customer was filling the form — refresh.
        setError(data?.error || "That slot was just booked. Please pick another.");
        setSelected(null);
        await loadSlots();
        setPending(false);
        return;
      }
      if (!res.ok || !data.checkoutUrl) {
        setError(data?.error || "Could not start booking. Please try again.");
        setPending(false);
        return;
      }
      window.location.href = data.checkoutUrl;
    } catch {
      setError("Network error. Please try again.");
      setPending(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
      <div className="rounded-3xl border border-white/10 bg-graphite p-7 sm:p-9">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-bolt/10 text-bolt ring-1 ring-bolt/20">
            <ClockIcon className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-display text-2xl font-bold text-white">
              Choose your slot
            </h2>
            <p className="text-sm text-ash">
              Available same-day emergency call-out slots. Pick one to book.
            </p>
          </div>
        </div>

        <div className="mt-6">
          {loading ? (
            <p className="rounded-2xl border border-white/10 bg-ink/60 p-6 text-center text-sm text-ash">
              Loading available slots…
            </p>
          ) : grouped.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-ink/60 p-6 text-center">
              <p className="text-sm text-ash">
                No slots are open right now. Please call us and we&apos;ll fit you
                in.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {grouped.map(([date, daySlots]) => (
                <div key={date}>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-bolt">
                    {formatDay(date)}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {daySlots.map((s) => {
                      const isSelected = selected === s.id;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          disabled={s.booked}
                          onClick={() => setSelected(s.id)}
                          aria-pressed={isSelected}
                          className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all ${
                            s.booked
                              ? "cursor-not-allowed border-white/5 bg-white/[0.02] text-ash line-through"
                              : isSelected
                                ? "border-bolt bg-bolt text-ink"
                                : "border-white/10 bg-ink text-white hover:border-bolt/50"
                          }`}
                          title={s.booked ? "Not available" : "Available"}
                        >
                          {s.time}
                          {s.booked && (
                            <span className="ml-1.5 text-[10px] font-medium uppercase">
                              · Not available
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <aside className="h-fit space-y-5">
        <form
          onSubmit={handleBook}
          className="rounded-2xl border border-white/10 bg-graphite p-7"
        >
          <h2 className="font-display text-lg font-bold text-white">
            Your details
          </h2>
          {selectedSlot ? (
            <p className="mt-1 text-sm text-bolt">
              Selected: {formatDay(selectedSlot.date)} at {selectedSlot.time}
            </p>
          ) : (
            <p className="mt-1 text-sm text-ash">Pick a slot to continue.</p>
          )}

          {user ? (
            <div className="mt-5 space-y-4">
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
                <label className={labelClass}>
                  Fault details{" "}
                  <span className="lowercase opacity-60">(optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  placeholder="Briefly describe the electrical emergency…"
                  className={`${inputClass} resize-none`}
                />
              </div>

              {error && (
                <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300">
                  {error}
                </p>
              )}

              <div className="flex items-center justify-between border-t border-white/10 pt-4">
                <div>
                  <p className="font-display text-2xl font-bold text-gradient-bolt">
                    {formatGBP(price)}
                  </p>
                  <p className="text-[11px] uppercase tracking-wider text-ash">
                    per visit · ex VAT · pay in full
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={pending || !selectedSlot}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-bolt px-6 py-3.5 font-bold text-ink transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {pending
                  ? "Opening secure payment…"
                  : `Book & pay ${formatGBP(price)}`}
                {!pending && (
                  <ArrowIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                )}
              </button>
              <p className="text-center text-[11px] text-ash">
                Full payment secures your slot immediately via Stripe.
              </p>
            </div>
          ) : (
            <div className="mt-5 rounded-xl border border-bolt/20 bg-bolt/5 p-4 text-sm text-ash">
              <p className="flex items-center gap-2 font-semibold text-bolt">
                <CheckIcon className="h-4 w-4" /> Sign in to book
              </p>
              <p className="mt-1.5">
                Please sign in so we can confirm your booking and send your
                receipt.
              </p>
              <Link
                href="/login?next=/book"
                className="mt-3 inline-flex items-center gap-2 rounded-full bg-bolt px-5 py-2.5 text-sm font-bold text-ink"
              >
                Sign in to continue
                <ArrowIcon className="h-4 w-4" />
              </Link>
            </div>
          )}
        </form>
      </aside>
    </div>
  );
}
