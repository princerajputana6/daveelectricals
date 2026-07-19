"use client";

import { useState } from "react";

export default function SettingsManager({
  initialVatRate,
}: {
  initialVatRate: number;
}) {
  const [vatRate, setVatRate] = useState(String(initialVatRate));
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(
    null,
  );

  const save = async () => {
    const rate = Number(vatRate);
    if (!Number.isFinite(rate) || rate < 0 || rate > 100) {
      setMsg({ kind: "err", text: "Enter a VAT rate between 0 and 100." });
      return;
    }
    setBusy(true);
    setMsg(null);
    try {
      const r = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ vatRate: rate }),
      });
      const d = await r.json();
      if (!r.ok) {
        setMsg({ kind: "err", text: d.error || "Could not save." });
      } else {
        setVatRate(String(d.vatRate));
        setMsg({
          kind: "ok",
          text: `Saved. ${d.vatRate}% VAT now applies to every new checkout.`,
        });
      }
    } catch {
      setMsg({ kind: "err", text: "Could not save. Please try again." });
    } finally {
      setBusy(false);
    }
  };

  const preview = (() => {
    const rate = Number(vatRate) || 0;
    const ex = 100;
    const vat = +((ex * rate) / 100).toFixed(2);
    return { ex, vat, total: +(ex + vat).toFixed(2) };
  })();

  return (
    <div className="max-w-xl rounded-2xl border border-white/10 bg-graphite p-6">
      <h2 className="font-display text-lg font-bold text-white">VAT rate</h2>
      <p className="mt-1 text-xs text-ash">
        Applied automatically to every new order at checkout. Product prices are
        shown ex-VAT; the customer pays the VAT-inclusive total.
      </p>

      <div className="mt-5 flex items-end gap-3">
        <div className="flex-1">
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-ash">
            VAT %
          </label>
          <div className="relative">
            <input
              type="number"
              min={0}
              max={100}
              step="0.5"
              value={vatRate}
              onChange={(e) => setVatRate(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-ink px-4 py-3 pr-9 text-sm text-white focus:border-bolt/60 focus:outline-none focus:ring-2 focus:ring-bolt/20"
            />
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-ash">
              %
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={save}
          disabled={busy}
          className="rounded-full bg-bolt px-6 py-3 text-sm font-bold text-ink transition-transform hover:scale-[1.04] disabled:opacity-50"
        >
          {busy ? "Saving…" : "Save"}
        </button>
      </div>

      {msg && (
        <p
          className={`mt-4 rounded-lg border px-3 py-2 text-xs font-semibold ${
            msg.kind === "ok"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
              : "border-red-500/30 bg-red-500/10 text-red-300"
          }`}
        >
          {msg.text}
        </p>
      )}

      <div className="mt-6 rounded-xl border border-white/10 bg-ink p-4 text-sm">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-ash">
          Example on a £{preview.ex.toFixed(2)} item
        </p>
        <div className="mt-2 space-y-1">
          <div className="flex justify-between text-zinc-300">
            <span>Subtotal (ex VAT)</span>
            <span>£{preview.ex.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-ash">
            <span>VAT ({Number(vatRate) || 0}%)</span>
            <span>£{preview.vat.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-bolt">
            <span>Total (inc VAT)</span>
            <span>£{preview.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
