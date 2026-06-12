"use client";

import { Fragment, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { OrderPublic } from "../OrdersSection";
import { formatGBP } from "@/lib/products";
import {
  ArrowIcon,
  CheckIcon,
  CloseIcon,
  ShieldIcon,
} from "../Icons";

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

const STATUS_TONE: Record<OrderPublic["status"], string> = {
  pending_deposit: "bg-amber-500/15 text-amber-300",
  pending_payment: "bg-amber-500/15 text-amber-300",
  deposit_paid: "bg-bolt/15 text-bolt",
  paid_in_full: "bg-emerald-500/15 text-emerald-300",
  in_progress: "bg-blue-500/15 text-blue-300",
  ready_for_balance: "bg-purple-500/15 text-purple-300",
  completed: "bg-emerald-500/15 text-emerald-300",
  cancelled: "bg-zinc-500/15 text-zinc-400",
};

const DEFAULT_CERT_TYPES = [
  "EICR — Landlord Electrical Safety Certificate",
  "PAT Testing Compliance Certificate",
  "Fire Alarm Test Certificate",
  "HMO Emergency Lighting Certificate",
  "Call-Out Report",
];

export default function AdminOrdersTable({
  orders,
}: {
  orders: OrderPublic[];
}) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-graphite">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="bg-white/5 text-xs uppercase tracking-wider text-ash">
          <tr>
            <th className="px-5 py-3">Order</th>
            <th className="px-5 py-3">Customer</th>
            <th className="px-5 py-3">Date</th>
            <th className="px-5 py-3">Payment</th>
            <th className="px-5 py-3">Status</th>
            <th className="px-5 py-3 text-right">Total</th>
            <th className="px-5 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className="px-5 py-10 text-center text-sm text-ash"
              >
                No orders yet.
              </td>
            </tr>
          ) : (
            orders.map((o) => {
              const depositPaid = o.payments.deposit?.status === "paid";
              const balancePaid = o.payments.balance?.status === "paid";
              const open = openId === o.id;
              return (
                <Fragment key={o.id}>
                  <tr
                    className="border-t border-white/5 transition-colors hover:bg-white/[0.03]"
                  >
                    <td className="px-5 py-3">
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="font-display font-bold text-white hover:text-bolt"
                      >
                        #{o.id.slice(-6).toUpperCase()}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-zinc-200">
                      <p className="font-semibold">{o.customer.name}</p>
                      <p className="text-[11px] text-ash">
                        {o.customer.email}
                      </p>
                    </td>
                    <td className="px-5 py-3 text-[11px] text-ash">
                      {new Date(o.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-3 text-xs">
                      <p
                        className={
                          depositPaid ? "text-emerald-300" : "text-ash"
                        }
                      >
                        {o.paymentMode === "full" ? "Full" : "Deposit"}:{" "}
                        {depositPaid ? "Paid" : "Pending"}
                      </p>
                      {o.paymentMode !== "full" && (
                        <p
                          className={
                            balancePaid
                              ? "text-emerald-300"
                              : "text-ash"
                          }
                        >
                          Balance: {balancePaid ? "Paid" : "Pending"}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${
                          STATUS_TONE[o.status]
                        }`}
                      >
                        {STATUS_LABEL[o.status]}
                      </span>
                      {o.certificate && (
                        <p className="mt-1 text-[10px] uppercase tracking-wider text-emerald-300">
                          Cert # {o.certificate.number}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right font-bold text-bolt">
                      {formatGBP(o.subtotal)}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setOpenId(open ? null : o.id)}
                          className={`rounded-full px-3 py-1 text-xs font-bold transition-colors ${
                            open
                              ? "bg-bolt/30 text-bolt"
                              : "bg-bolt/10 text-bolt hover:bg-bolt/20"
                          }`}
                        >
                          {open
                            ? "Close"
                            : o.certificate
                              ? "Update cert"
                              : "Upload cert"}
                        </button>
                        <Link
                          href={`/admin/orders/${o.id}`}
                          className="rounded-full bg-white/5 px-3 py-1 text-xs font-bold text-white hover:bg-white/10"
                        >
                          Open
                        </Link>
                      </div>
                    </td>
                  </tr>
                  <AnimatePresence>
                    {open && (
                      <tr>
                        <td colSpan={7} className="bg-ink/60 p-0">
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{
                              duration: 0.25,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                            className="overflow-hidden"
                          >
                            <div className="border-t border-bolt/20 p-6">
                              <CertForm
                                order={o}
                                onDone={() => setOpenId(null)}
                              />
                            </div>
                          </motion.div>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </Fragment>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

function CertForm({
  order,
  onDone,
}: {
  order: OrderPublic;
  onDone: () => void;
}) {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(
    null,
  );
  const [cert, setCert] = useState({
    number:
      order.certificate?.number ||
      `DES-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    type:
      order.certificate?.type ||
      defaultCertTypeFor(order) ||
      DEFAULT_CERT_TYPES[0],
    notes: order.certificate?.notes || "",
    expiresAt: order.certificate?.expiresAt
      ? new Date(order.certificate.expiresAt).toISOString().slice(0, 10)
      : defaultExpiresFor(order),
    fileUrl: order.certificate?.fileUrl || "",
  });

  const input =
    "w-full rounded-xl border border-white/10 bg-ink px-3 py-2 text-sm text-white placeholder:text-ash focus:border-bolt/60 focus:outline-none focus:ring-2 focus:ring-bolt/20";
  const label =
    "mb-1 block text-[11px] font-semibold uppercase tracking-wider text-ash";

  const flash = (kind: "ok" | "err", text: string) => {
    setMsg({ kind, text });
    setTimeout(() => setMsg(null), 6000);
  };

  const upload = async (file: File) => {
    setBusy("upload");
    setMsg(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const r = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
      });
      const d = await r.json();
      if (!r.ok) {
        flash("err", d.error || "Upload failed.");
      } else {
        setCert((c) => ({ ...c, fileUrl: d.url }));
        flash("ok", "File uploaded to Cloudinary.");
      }
    } catch {
      flash("err", "Upload failed.");
    } finally {
      setBusy(null);
    }
  };

  const issue = async () => {
    if (!cert.number || !cert.type) {
      flash("err", "Certificate number and type are required.");
      return;
    }
    setBusy("issue");
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
      if (!r.ok) {
        flash("err", d.error || "Failed.");
      } else {
        flash(
          "ok",
          d.emailed
            ? "Certificate issued — customer emailed."
            : `Certificate issued.${d.emailNote ? ` (Email skipped: ${d.emailNote})` : ""}`,
        );
        setTimeout(() => {
          router.refresh();
          onDone();
        }, 800);
      }
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
      <div>
        <h3 className="flex items-center gap-2 font-display text-base font-bold text-white">
          <ShieldIcon className="h-4 w-4 text-bolt" />
          {order.certificate
            ? "Update certificate"
            : "Issue certificate"}{" "}
          — #{order.id.slice(-6).toUpperCase()}
        </h3>
        <p className="mt-1 text-xs text-ash">
          Customer: {order.customer.name} ({order.customer.email})
        </p>

        {msg && (
          <p
            className={`mt-3 rounded-lg border px-3 py-2 text-xs font-semibold ${
              msg.kind === "ok"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                : "border-red-500/30 bg-red-500/10 text-red-200"
            }`}
          >
            {msg.text}
          </p>
        )}

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <label className={label}>Certificate number</label>
            <input
              value={cert.number}
              onChange={(e) =>
                setCert((c) => ({ ...c, number: e.target.value }))
              }
              className={input}
            />
          </div>
          <div>
            <label className={label}>Type</label>
            <select
              value={cert.type}
              onChange={(e) =>
                setCert((c) => ({ ...c, type: e.target.value }))
              }
              className={input}
            >
              {DEFAULT_CERT_TYPES.map((t) => (
                <option key={t} value={t} className="bg-ink">
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={label}>Expires</label>
            <input
              type="date"
              value={cert.expiresAt}
              onChange={(e) =>
                setCert((c) => ({ ...c, expiresAt: e.target.value }))
              }
              className={input}
            />
          </div>
          <div>
            <label className={label}>File URL</label>
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

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <input
            ref={fileInput}
            type="file"
            accept="image/*,application/pdf"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) upload(f);
            }}
          />
          <button
            type="button"
            disabled={busy === "upload"}
            onClick={() => fileInput.current?.click()}
            className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white hover:border-bolt/40 hover:text-bolt disabled:opacity-50"
          >
            {busy === "upload" ? "Uploading…" : "Upload file (Cloudinary)"}
          </button>
          <button
            type="button"
            disabled={busy === "issue"}
            onClick={issue}
            className="group flex items-center gap-2 rounded-full bg-bolt px-5 py-2 text-xs font-bold text-ink hover:scale-[1.04] disabled:opacity-50"
          >
            {busy === "issue"
              ? "Saving…"
              : order.certificate
                ? "Update & email customer"
                : "Issue & email customer"}
            {busy !== "issue" && <ArrowIcon className="h-3.5 w-3.5" />}
          </button>
          <button
            type="button"
            onClick={onDone}
            className="ml-auto inline-flex items-center gap-1 text-xs text-ash hover:text-white"
          >
            <CloseIcon className="h-3.5 w-3.5" /> Close
          </button>
        </div>

        {cert.fileUrl && (
          <p className="mt-3 flex items-center gap-1.5 truncate text-[11px] text-emerald-300">
            <CheckIcon className="h-3 w-3 shrink-0" />
            <a
              href={cert.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate hover:underline"
            >
              {cert.fileUrl}
            </a>
          </p>
        )}
      </div>

      {/* Summary aside */}
      <aside className="rounded-xl border border-white/10 bg-graphite p-4 text-xs">
        <p className="text-[10px] uppercase tracking-wider text-ash">
          Order summary
        </p>
        <p className="mt-1 font-display text-base font-bold text-white">
          {formatGBP(order.subtotal)} · {order.paymentMode}
        </p>
        <ul className="mt-3 space-y-1.5 text-[11px] text-zinc-300">
          {order.items.map((it) => (
            <li
              key={`${it.productId}::${it.variantId || ""}`}
              className="flex items-center justify-between gap-2"
            >
              <span>
                <span className="font-semibold text-white">{it.name}</span>
                {it.variantLabel && (
                  <span className="block text-[10px] uppercase tracking-wider text-bolt">
                    {it.variantLabel}
                  </span>
                )}
              </span>
              <span>{formatGBP(it.lineTotal)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[10px] uppercase tracking-wider text-ash">
          Service address
        </p>
        <p className="mt-1 text-[11px] text-zinc-200">
          {order.customer.address}
        </p>
      </aside>
    </div>
  );
}

function defaultCertTypeFor(order: OrderPublic) {
  const ids = new Set(order.items.map((i) => i.productId));
  if (ids.has("eicr")) return "EICR — Landlord Electrical Safety Certificate";
  if (ids.has("pat")) return "PAT Testing Compliance Certificate";
  if (ids.has("fire-alarm-testing")) return "Fire Alarm Test Certificate";
  if (ids.has("hmo-emergency-lighting"))
    return "HMO Emergency Lighting Certificate";
  return undefined;
}

function defaultExpiresFor(order: OrderPublic) {
  const ids = new Set(order.items.map((i) => i.productId));
  const d = new Date();
  if (ids.has("eicr")) d.setFullYear(d.getFullYear() + 5);
  else d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().slice(0, 10);
}
