"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowIcon } from "./Icons";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-ink px-4 py-3 text-sm text-white placeholder:text-ash transition-colors focus:border-bolt/60 focus:outline-none focus:ring-2 focus:ring-bolt/20";

const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ash";

export default function AuthForm({
  mode,
}: {
  mode: "login" | "signup";
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const update = (k: string, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Something went wrong.");
        setPending(false);
        return;
      }
      router.push("/account");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setPending(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      {mode === "signup" && (
        <div>
          <label className={labelClass}>Full name</label>
          <input
            required
            autoComplete="name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Jane Doe"
            className={inputClass}
          />
        </div>
      )}
      <div>
        <label className={labelClass}>Email</label>
        <input
          required
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          placeholder="you@example.com"
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>Password</label>
        <input
          required
          type="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          value={form.password}
          onChange={(e) => update("password", e.target.value)}
          placeholder={mode === "signup" ? "At least 8 characters" : "••••••••"}
          className={inputClass}
        />
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
        {pending
          ? mode === "login"
            ? "Signing in…"
            : "Creating account…"
          : mode === "login"
            ? "Sign in"
            : "Create account"}
        {!pending && (
          <ArrowIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        )}
      </button>
    </form>
  );
}
