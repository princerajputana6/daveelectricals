"use client";

import { useEffect, useMemo, useState } from "react";

type AdminSlot = {
  id: string;
  date: string;
  time: string;
  status: "open" | "booked" | "closed";
  booked: boolean;
  orderId: string | null;
};

const inputClass =
  "rounded-xl border border-white/10 bg-ink px-4 py-2.5 text-sm text-white focus:border-bolt/60 focus:outline-none focus:ring-2 focus:ring-bolt/20";

function todayISO() {
  return new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
}
function formatDay(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const STATUS_STYLE: Record<AdminSlot["status"], string> = {
  open: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  booked: "border-bolt/40 bg-bolt/10 text-bolt",
  closed: "border-white/10 bg-white/5 text-ash",
};

export default function AvailabilityManager() {
  const [slots, setSlots] = useState<AdminSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(todayISO());
  const [times, setTimes] = useState<string[]>([]);
  const [timeInput, setTimeInput] = useState("09:00");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/slots", { cache: "no-store" });
      const data = await res.json();
      setSlots(Array.isArray(data.slots) ? data.slots : []);
    } catch {
      setSlots([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const grouped = useMemo(() => {
    const map = new Map<string, AdminSlot[]>();
    for (const s of slots) {
      if (!map.has(s.date)) map.set(s.date, []);
      map.get(s.date)!.push(s);
    }
    return [...map.entries()];
  }, [slots]);

  const addTime = () => {
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(timeInput)) {
      setError("Enter a valid time as HH:mm.");
      return;
    }
    setError(null);
    setTimes((t) => [...new Set([...t, timeInput])].sort());
  };

  const saveSlots = async () => {
    setError(null);
    setMsg(null);
    if (times.length === 0) {
      setError("Add at least one time before saving.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/admin/slots", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ date, times }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Could not add slots.");
      } else {
        setMsg(`Added ${data.added} slot${data.added === 1 ? "" : "s"}.`);
        setTimes([]);
        await load();
      }
    } catch {
      setError("Network error.");
    } finally {
      setBusy(false);
    }
  };

  const toggleStatus = async (s: AdminSlot) => {
    if (s.booked) return;
    const next = s.status === "open" ? "closed" : "open";
    await fetch(`/api/admin/slots/${s.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    await load();
  };

  const remove = async (s: AdminSlot) => {
    if (s.booked) return;
    await fetch(`/api/admin/slots/${s.id}`, { method: "DELETE" });
    await load();
  };

  return (
    <div className="space-y-8">
      {/* Add slots */}
      <section className="rounded-2xl border border-white/10 bg-graphite p-6">
        <h2 className="font-display text-lg font-bold text-white">
          Open new slots
        </h2>
        <p className="mt-1 text-sm text-ash">
          Pick a date, add the times you can take same-day emergency jobs, then
          save. Each time becomes one bookable slot.
        </p>

        <div className="mt-5 flex flex-wrap items-end gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ash">
              Date
            </label>
            <input
              type="date"
              min={todayISO()}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`${inputClass} [color-scheme:dark]`}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ash">
              Time
            </label>
            <div className="flex gap-2">
              <input
                type="time"
                value={timeInput}
                onChange={(e) => setTimeInput(e.target.value)}
                className={`${inputClass} [color-scheme:dark]`}
              />
              <button
                type="button"
                onClick={addTime}
                className="rounded-xl border border-bolt/40 bg-bolt/10 px-4 py-2.5 text-sm font-semibold text-bolt hover:bg-bolt/20"
              >
                + Add
              </button>
            </div>
          </div>
        </div>

        {times.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {times.map((t) => (
              <span
                key={t}
                className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-ink px-3 py-1.5 text-sm text-white"
              >
                {t}
                <button
                  type="button"
                  onClick={() => setTimes((ts) => ts.filter((x) => x !== t))}
                  className="text-ash hover:text-red-300"
                  aria-label={`Remove ${t}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        {error && (
          <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300">
            {error}
          </p>
        )}
        {msg && (
          <p className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-300">
            {msg}
          </p>
        )}

        <button
          type="button"
          onClick={saveSlots}
          disabled={busy}
          className="mt-5 rounded-xl bg-bolt px-6 py-2.5 text-sm font-bold text-ink transition-transform hover:scale-[1.02] disabled:opacity-60"
        >
          {busy ? "Saving…" : "Save slots"}
        </button>
      </section>

      {/* Existing slots */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-white">
            Upcoming slots
          </h2>
          <button
            type="button"
            onClick={load}
            className="text-xs font-semibold text-bolt hover:underline"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="rounded-2xl border border-white/10 bg-graphite p-6 text-center text-sm text-ash">
            Loading…
          </p>
        ) : grouped.length === 0 ? (
          <p className="rounded-2xl border border-white/10 bg-graphite p-6 text-center text-sm text-ash">
            No slots yet. Open some above.
          </p>
        ) : (
          <div className="space-y-4">
            {grouped.map(([d, daySlots]) => (
              <div
                key={d}
                className="rounded-2xl border border-white/10 bg-graphite p-5"
              >
                <p className="font-display text-sm font-bold text-white">
                  {formatDay(d)}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {daySlots.map((s) => (
                    <div
                      key={s.id}
                      className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm font-semibold ${STATUS_STYLE[s.status]}`}
                    >
                      <span>{s.time}</span>
                      <span className="text-[10px] uppercase tracking-wide opacity-80">
                        {s.status}
                      </span>
                      {s.booked ? (
                        <span className="text-[10px] uppercase opacity-70">
                          🔒
                        </span>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => toggleStatus(s)}
                            className="text-[11px] underline decoration-dotted hover:opacity-80"
                          >
                            {s.status === "open" ? "close" : "open"}
                          </button>
                          <button
                            type="button"
                            onClick={() => remove(s)}
                            className="text-[11px] text-red-300 hover:opacity-80"
                            aria-label="Delete slot"
                          >
                            delete
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
