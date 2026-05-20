"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { company } from "@/lib/content";
import { ArrowIcon, CheckIcon } from "./Icons";

const services = [
  "Installation & Maintenance",
  "Commercial Electrical",
  "Certification / EICR",
  "Emergency Call-Out",
  "PAT Testing",
  "Emergency Lighting",
  "Other",
];

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: services[0],
    message: "",
  });

  const update = (key: string, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = encodeURIComponent(
      `Name: ${form.name}\nPhone: ${form.phone}\nService: ${form.service}\n\n${form.message}`,
    );
    window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(
      `Website enquiry — ${form.service}`,
    )}&body=${body}`;
    setSent(true);
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
              Your email client should now be open with your enquiry ready to
              send. Prefer to talk? Call us on {company.phoneMobile}.
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
            <button
              type="submit"
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-bolt px-6 py-3.5 font-bold text-ink transition-transform hover:scale-[1.02]"
            >
              Send enquiry
              <ArrowIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
