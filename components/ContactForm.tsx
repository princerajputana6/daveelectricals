"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { company } from "@/lib/content";
import {
  ArrowIcon,
  CheckIcon,
  FlagIcon,
  StarIcon,
  TruckIcon,
} from "./Icons";

const humanOptions = [
  { key: "star", label: "Star", Icon: StarIcon },
  { key: "flag", label: "Flag", Icon: FlagIcon },
  { key: "truck", label: "Truck", Icon: TruckIcon },
];

const services = [
  "Installation & Maintenance",
  "Commercial Electrical",
  "Certification / EICR",
  "Emergency Call-Out",
  "PAT Testing",
  "Emergency Lighting",
  "CCTV Installation",
  "EV Charging Installation",
  "Other",
];

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [humanPick, setHumanPick] = useState<string | null>(null);
  const [humanError, setHumanError] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: services[0],
    message: "",
  });

  const update = (key: string, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (humanPick !== "star") {
      setHumanError(true);
      return;
    }
    setError(null);
    setPending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Something went wrong. Please try again.");
        setPending(false);
        return;
      }
      setSent(true);
    } catch {
      setError(
        "Could not reach the server. Please check your connection and try again.",
      );
      setPending(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-ink px-4 py-3 text-sm text-white placeholder:text-ash transition-colors focus:border-bolt/60 focus:outline-none focus:ring-2 focus:ring-bolt/20";

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-graphite p-7 sm:p-9">
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-bolt/10 blur-3xl" />
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative flex flex-col items-center py-12 text-center"
          >
            <span className="grid h-16 w-16 place-items-center rounded-full bg-bolt text-ink">
              <CheckIcon className="h-8 w-8" />
            </span>
            <h3 className="mt-5 font-display text-2xl font-bold text-white">
              Thank you!
            </h3>
            <p className="mt-2 max-w-sm text-sm text-ash">
              Your message has been sent. We&apos;ll be in touch shortly. Prefer
              to talk? Call us on {company.phoneMobile}.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative space-y-4"
          >
            <h3 className="font-display text-2xl font-bold text-white">
              Send us a message
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ash">
                  Your name
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="John Smith"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ash">
                  Phone
                </label>
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
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ash">
                Email
              </label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ash">
                Service required
              </label>
              <select
                value={form.service}
                onChange={(e) => update("service", e.target.value)}
                className={inputClass}
              >
                {services.map((s) => (
                  <option key={s} value={s} className="bg-ink">
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ash">
                Message
              </label>
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                placeholder="Tell us about your project..."
                className={`${inputClass} resize-none`}
              />
            </div>
            <div className="rounded-xl border border-white/10 bg-ink p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-ash">
                Please prove you are human by selecting the{" "}
                <span className="text-bolt">star</span>.
              </p>
              <div className="mt-3 flex gap-2.5">
                {humanOptions.map(({ key, label, Icon }) => {
                  const active = humanPick === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      aria-label={label}
                      onClick={() => {
                        setHumanPick(key);
                        setHumanError(false);
                      }}
                      className={`grid h-11 w-11 place-items-center rounded-lg border transition-all ${
                        active
                          ? "border-bolt bg-bolt/15 text-bolt"
                          : "border-white/15 bg-white/5 text-ash hover:border-bolt/40 hover:text-white"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </button>
                  );
                })}
              </div>
              {humanError && (
                <p className="mt-2 text-xs font-semibold text-red-400">
                  Please select the star icon to continue.
                </p>
              )}
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-bolt px-6 py-3.5 font-bold text-ink transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? "Sending…" : "Send enquiry"}
              {!pending && (
                <ArrowIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
