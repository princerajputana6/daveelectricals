"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { OrderPublic } from "../OrdersSection";
import { formatGBP } from "@/lib/products";
import { ArrowIcon, CheckIcon, ShieldIcon } from "../Icons";

const STATUS_OPTIONS = [
  "pending_deposit",
  "pending_payment",
  "deposit_paid",
  "paid_in_full",
  "in_progress",
  "ready_for_balance",
  "completed",
  "cancelled",
] as const;

export default function AdminOrderEditor({ order }: { order: OrderPublic }) {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement | null>(null);

  const [status, setStatus] = useState(order.status);
  const [cert, setCert] = useState({
    number: order.certificate?.number || "",
    type: order.certificate?.type || "EICR — Landlord Electrical Safety Certificate",
    notes: order.certificate?.notes || "",
    expiresAt: order.certificate?.expiresAt
      ? new Date(order.certificate.expiresAt).toISOString().slice(0, 10)
      : "",
    fileUrl: order.certificate?.fileUrl || "",
  });
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(
    null,
  );

  const flash = (kind: "ok" | "err", text: string) => {
    setMsg({ kind, text });
    setTimeout(() => setMsg(null), 5000);
  };

  const uploadFile = async (file: File) => {
    setBusy("upload");
    setMsg(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const r = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const d = await r.json();
      if (!r.ok) {
        flash("err", d.error || "Upload failed");
      } else {
        setCert((c) => ({ ...c, fileUrl: d.url }));
        flash("ok", "Uploaded to Cloudinary.");
      }
    } catch {
      flash("err", "Upload failed");
    } finally {
      setBusy(null);
    }
  };

  const updateStatus = async () => {
    setBusy("status");
    try {
      const r = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const d = await r.json();
      if (!r.ok) flash("err", d.error || "Failed");
      else {
        const needsCert =
          (status === "completed" || status === "ready_for_balance") &&
          !order.certificate;
        if (needsCert) {
          flash(
            "err",
            "Status updated — but no certificate is attached. Click “Issue / update certificate” so the customer can see it.",
          );
        } else {
          flash("ok", "Status updated.");
        }
        router.refresh();
      }
    } finally {
      setBusy(null);
    }
  };

  const markBalancePaid = async () => {
    setBusy("balance");
    try {
      const r = await fetch(`/api/admin/orders/${order.id}/balance`, {
        method: "POST",
      });
      const d = await r.json();
      if (!r.ok) flash("err", d.error || "Failed");
      else {
        flash("ok", "Balance marked as received.");
        router.refresh();
      }
    } finally {
      setBusy(null);
    }
  };

  const issueCert = async () => {
    if (!cert.number || !cert.type) {
      flash("err", "Certificate number and type are required.");
      return;
    }
    setBusy("cert");
    try {
      const r = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          certificate: {
            number: cert.number,
            type: cert.type,
            notes: cert.notes || undefined,
            expiresAt: cert.expiresAt || undefined,
            fileUrl: cert.fileUrl || undefined,
          },
        }),
      });
      const d = await r.json();
      if (!r.ok) flash("err", d.error || "Failed");
      else {
        flash(
          "ok",
          d.emailed
            ? "Certificate issued — customer emailed."
            : `Certificate issued.${d.emailNote ? ` (Email skipped: ${d.emailNote})` : ""}`,
        );
        router.refresh();
      }
    } finally {
      setBusy(null);
    }
  };

  const input =
    "w-full rounded-xl border border-white/10 bg-ink px-4 py-2.5 text-sm text-white placeholder:text-ash focus:border-bolt/60 focus:outline-none focus:ring-2 focus:ring-bolt/20";
  const label =
    "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ash";

  const depositPaid = order.payments.deposit?.status === "paid";
  const balancePaid = order.payments.balance?.status === "paid";
  const fullyPaid =
    depositPaid && (order.paymentMode === "full" || balancePaid);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
      {/* LEFT — order details + editors */}
      <div className="space-y-6">
        {msg && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-lg border px-4 py-3 text-sm font-semibold ${
              msg.kind === "ok"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                : "border-red-500/30 bg-red-500/10 text-red-200"
            }`}
          >
            {msg.text}
          </motion.div>
        )}

        <section className="rounded-2xl border border-white/10 bg-graphite p-6">
          <h2 className="font-display text-lg font-bold text-white">
            Customer
          </h2>
          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <p className="text-xs text-ash">Name</p>
              <p className="font-semibold text-white">{order.customer.name}</p>
            </div>
            <div>
              <p className="text-xs text-ash">Email</p>
              <p className="font-semibold text-white">{order.customer.email}</p>
            </div>
            <div>
              <p className="text-xs text-ash">Phone</p>
              <p className="font-semibold text-white">{order.customer.phone}</p>
            </div>
            <div>
              <p className="text-xs text-ash">Payment mode</p>
              <p className="font-semibold uppercase text-bolt">
                {order.paymentMode}
              </p>
            </div>
            {order.customer.preferredDate && (
              <div>
                <p className="text-xs text-ash">Preferred visit date</p>
                <p className="font-semibold text-white">
                  {order.customer.preferredDate}
                </p>
              </div>
            )}
            <div className="sm:col-span-2">
              <p className="text-xs text-ash">Address</p>
              <p className="text-white">{order.customer.address}</p>
            </div>
            {order.customer.notes && (
              <div className="sm:col-span-2">
                <p className="text-xs text-ash">Notes</p>
                <p className="text-zinc-300">{order.customer.notes}</p>
              </div>
            )}
            {order.booking && (
              <div className="sm:col-span-2 rounded-xl border border-bolt/30 bg-bolt/5 p-3">
                <p className="text-xs text-bolt">Same-day emergency booking</p>
                <p className="font-semibold text-white">
                  {order.booking.date} · {order.booking.time}
                </p>
              </div>
            )}
            {order.customer.accessDetails && (
              <div className="sm:col-span-2">
                <p className="text-xs text-ash">Access details</p>
                <p className="whitespace-pre-line text-zinc-300">
                  {order.customer.accessDetails}
                </p>
              </div>
            )}
            {order.customer.keyCollection && (
              <div className="sm:col-span-2">
                <p className="text-xs text-ash">Key collection</p>
                <p className="whitespace-pre-line text-zinc-300">
                  {order.customer.keyCollection}
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-graphite p-6">
          <h2 className="font-display text-lg font-bold text-white">Items</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {order.items.map((it) => (
              <li
                key={`${it.productId}::${it.variantId || ""}`}
                className="flex items-center justify-between border-b border-white/5 pb-2 last:border-b-0"
              >
                <div>
                  <p className="font-semibold text-white">{it.name}</p>
                  {it.variantLabel && (
                    <p className="text-[11px] uppercase tracking-wider text-bolt">
                      {it.variantLabel}
                    </p>
                  )}
                  <p className="text-xs text-ash">
                    {it.qty} × {formatGBP(it.unitPrice)} · {it.unit}
                  </p>
                </div>
                <p className="font-bold text-bolt">
                  {formatGBP(it.lineTotal)}
                </p>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-1 text-sm">
            <div className="flex justify-between">
              <dt className="text-ash">Subtotal</dt>
              <dd className="font-bold text-white">
                {formatGBP(order.subtotal)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ash">Deposit (50%)</dt>
              <dd
                className={
                  depositPaid ? "text-emerald-300" : "text-amber-300"
                }
              >
                {formatGBP(order.deposit)} ·{" "}
                {depositPaid ? "PAID" : "OUTSTANDING"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ash">Balance (50%)</dt>
              <dd
                className={
                  balancePaid
                    ? "text-emerald-300"
                    : order.paymentMode === "full"
                      ? "text-zinc-500"
                      : "text-amber-300"
                }
              >
                {formatGBP(order.balance)} ·{" "}
                {balancePaid
                  ? "PAID"
                  : order.paymentMode === "full"
                    ? "—"
                    : "OUTSTANDING"}
              </dd>
            </div>
          </dl>
        </section>

        <section className="rounded-2xl border border-white/10 bg-graphite p-6">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-white">
            <ShieldIcon className="h-5 w-5 text-bolt" />
            Certificate
          </h2>
          <p className="mt-1 text-xs text-ash">
            Uploading a file only stages it — it does <strong>not</strong> issue
            the certificate. To make it visible to the customer (and email
            them), fill in the number &amp; type and click{" "}
            <strong>Issue / update certificate</strong>. Changing the order
            status alone does not issue a certificate.
          </p>

          {order.certificate ? (
            <p className="mt-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">
              ✓ Certificate #{order.certificate.number} is issued and visible to
              the customer
              {order.certificate.fileUrl ? " (with a downloadable file)." : "."}
            </p>
          ) : (
            <p className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-300">
              ⚠ No certificate is attached to this order yet — the customer sees
              nothing until you click “Issue / update certificate” below.
            </p>
          )}

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label}>Certificate number</label>
              <input
                value={cert.number}
                onChange={(e) =>
                  setCert((c) => ({ ...c, number: e.target.value }))
                }
                placeholder="DES-2026-0042"
                className={input}
              />
            </div>
            <div>
              <label className={label}>Type</label>
              <input
                value={cert.type}
                onChange={(e) =>
                  setCert((c) => ({ ...c, type: e.target.value }))
                }
                className={input}
              />
            </div>
            <div>
              <label className={label}>Expires</label>
              <input
                type="date"
                value={cert.expiresAt}
                onChange={(e) =>
                  setCert((c) => ({ ...c, expiresAt: e.target.value }))
                }
                onClick={(e) => {
                  const el = e.currentTarget as HTMLInputElement & {
                    showPicker?: () => void;
                  };
                  try {
                    el.showPicker?.();
                  } catch {
                    /* native icon still works */
                  }
                }}
                className={`${input} cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer`}
              />
            </div>
            <div>
              <label className={label}>File URL (Cloudinary)</label>
              <input
                value={cert.fileUrl}
                onChange={(e) =>
                  setCert((c) => ({ ...c, fileUrl: e.target.value }))
                }
                placeholder="https://res.cloudinary.com/..."
                className={input}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={label}>Notes</label>
              <textarea
                rows={2}
                value={cert.notes}
                onChange={(e) =>
                  setCert((c) => ({ ...c, notes: e.target.value }))
                }
                className={`${input} resize-none`}
              />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <input
              ref={fileInput}
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadFile(f);
              }}
            />
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              disabled={busy === "upload"}
              className="rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm font-semibold text-white hover:border-bolt/40 hover:text-bolt disabled:opacity-50"
            >
              {busy === "upload" ? "Uploading…" : "Upload certificate"}
            </button>
            <button
              type="button"
              onClick={issueCert}
              disabled={busy === "cert"}
              className="group flex items-center gap-2 rounded-full bg-bolt px-6 py-2.5 text-sm font-bold text-ink hover:scale-[1.04] disabled:opacity-50"
            >
              {busy === "cert" ? "Saving…" : "Issue / update certificate"}
              {busy !== "cert" && <ArrowIcon className="h-4 w-4" />}
            </button>
          </div>

          {cert.fileUrl && (
            <p className="mt-3 truncate text-xs text-emerald-300">
              <CheckIcon className="-mt-1 mr-1 inline h-3 w-3" />
              {cert.fileUrl}
            </p>
          )}
        </section>
      </div>

      {/* RIGHT — quick actions */}
      <aside className="space-y-5">
        <div className="rounded-2xl border border-white/10 bg-graphite p-6">
          <h3 className="font-display text-base font-bold text-white">
            Order status
          </h3>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as OrderPublic["status"])}
            className={`${input} mt-3`}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s} className="bg-ink">
                {s}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={updateStatus}
            disabled={busy === "status"}
            className="mt-3 w-full rounded-xl bg-bolt px-4 py-2.5 text-sm font-bold text-ink hover:scale-[1.02] disabled:opacity-50"
          >
            {busy === "status" ? "Saving…" : "Update status"}
          </button>
        </div>

        {!balancePaid && order.paymentMode !== "full" && (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6">
            <h3 className="font-display text-base font-bold text-amber-200">
              Mark balance received
            </h3>
            <p className="mt-1 text-xs text-amber-100/80">
              Use this when the customer pays the {formatGBP(order.balance)}{" "}
              balance outside Stripe (e.g. bank transfer). This unlocks the
              certificate download for them.
            </p>
            <button
              type="button"
              onClick={markBalancePaid}
              disabled={busy === "balance"}
              className="mt-4 w-full rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-bold text-ink hover:scale-[1.02] disabled:opacity-50"
            >
              {busy === "balance"
                ? "Saving…"
                : `Mark ${formatGBP(order.balance)} as received`}
            </button>
          </div>
        )}

        <div
          className={`rounded-2xl border p-6 ${
            fullyPaid
              ? "border-emerald-500/30 bg-emerald-500/5"
              : "border-white/10 bg-graphite"
          }`}
        >
          <h3 className="font-display text-base font-bold text-white">
            Payment summary
          </h3>
          <p className="mt-2 text-3xl font-display font-bold text-bolt">
            {formatGBP(order.subtotal)}
          </p>
          <p className="text-xs text-ash">
            {fullyPaid
              ? "Fully paid"
              : `${formatGBP(order.balance)} outstanding`}
          </p>
        </div>
      </aside>
    </div>
  );
}
