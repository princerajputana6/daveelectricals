"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { OrderPublic } from "./OrdersSection";
import { formatGBP } from "@/lib/products";
import { ArrowIcon, CheckIcon, ShieldIcon } from "./Icons";

export default function CertificateViewer({
  order,
  customerName,
}: {
  order: OrderPublic;
  customerName: string;
}) {
  const [devtoolsOpen, setDevtoolsOpen] = useState(false);

  const cert = order.certificate!;
  const fullyPaid =
    order.payments.deposit?.status === "paid" &&
    (order.paymentMode === "full" ||
      order.payments.balance?.status === "paid");
  const outstanding = fullyPaid ? 0 : order.balance;

  // === Anti-inspect (best-effort) ===
  useEffect(() => {
    const preventContext = (e: MouseEvent) => e.preventDefault();
    const preventKeys = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && (k === "i" || k === "j" || k === "c")) ||
        (e.metaKey && e.altKey && (k === "i" || k === "j" || k === "c")) ||
        (e.ctrlKey && k === "u") ||
        (e.metaKey && k === "u") ||
        (e.ctrlKey && k === "s") ||
        (e.metaKey && k === "s")
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };
    const preventDrag = (e: DragEvent) => e.preventDefault();
    const preventSelect = (e: Event) => e.preventDefault();

    document.addEventListener("contextmenu", preventContext);
    document.addEventListener("keydown", preventKeys);
    document.addEventListener("dragstart", preventDrag);
    document.addEventListener("selectstart", preventSelect);

    // DevTools detection via window-size delta + debugger timing
    let raf = 0;
    const threshold = 160;
    const tick = () => {
      const widthGap = window.outerWidth - window.innerWidth;
      const heightGap = window.outerHeight - window.innerHeight;
      if (widthGap > threshold || heightGap > threshold) {
        setDevtoolsOpen(true);
      } else {
        setDevtoolsOpen(false);
      }
      raf = window.setTimeout(tick, 800) as unknown as number;
    };
    tick();

    // Debugger trick — slows down DevTools navigation
    const dbgInterval = window.setInterval(() => {
      const before = performance.now();
      // eslint-disable-next-line no-debugger
      debugger;
      const after = performance.now();
      if (after - before > 100) setDevtoolsOpen(true);
    }, 1500);

    return () => {
      document.removeEventListener("contextmenu", preventContext);
      document.removeEventListener("keydown", preventKeys);
      document.removeEventListener("dragstart", preventDrag);
      document.removeEventListener("selectstart", preventSelect);
      window.clearTimeout(raf);
      window.clearInterval(dbgInterval);
    };
  }, []);

  return (
    <div className="relative min-h-[100svh] select-none bg-ink py-24 sm:py-32">
      <style jsx global>{`
        body { -webkit-user-select: none; user-select: none; -webkit-touch-callout: none; }
        .cert-no-print img { pointer-events: none; }
      `}</style>

      {devtoolsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 backdrop-blur-xl">
          <div className="max-w-md rounded-3xl border border-bolt/30 bg-graphite p-10 text-center">
            <ShieldIcon className="mx-auto h-12 w-12 text-bolt" />
            <h2 className="mt-5 font-display text-2xl font-bold text-white">
              Inspection disabled
            </h2>
            <p className="mt-3 text-sm text-ash">
              For security reasons, this certificate cannot be viewed while
              developer tools are open. Please close DevTools to continue.
            </p>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <Link
          href="/account"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-bolt"
        >
          <ArrowIcon className="h-4 w-4 rotate-180" /> Back to account
        </Link>

        <h1 className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl">
          {cert.type}
        </h1>
        <p className="mt-1 text-sm text-ash">
          Certificate # {cert.number} · Order #{order.id.slice(-6).toUpperCase()}
        </p>

        {!fullyPaid && (
          <div className="mt-6 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-5 text-amber-100">
            <p className="flex items-center gap-2 font-display text-base font-bold">
              <ShieldIcon className="h-5 w-5" /> Balance owed —{" "}
              {formatGBP(outstanding)}
            </p>
            <p className="mt-1.5 text-sm">
              The certificate is shown blurred below. Pay the remaining{" "}
              {formatGBP(outstanding)} from your account dashboard to unlock the
              clean copy and download.
            </p>
            <Link
              href="/account"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-amber-300 px-5 py-2 text-sm font-bold text-ink"
            >
              Pay {formatGBP(outstanding)} balance
              <ArrowIcon className="h-4 w-4" />
            </Link>
          </div>
        )}

        {/* CERTIFICATE BODY */}
        <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white text-ink shadow-2xl">
          <div className="relative">
            <div
              className={`p-10 transition-all duration-500 ${
                fullyPaid ? "blur-0" : "blur-md saturate-50"
              }`}
            >
              <div className="flex items-center justify-between border-b-4 border-bolt pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
                    Dave Electrical Services Ltd
                  </p>
                  <p className="mt-1 font-display text-xl font-bold">
                    {cert.type}
                  </p>
                </div>
                <span className="grid h-14 w-14 place-items-center rounded-xl bg-ink text-bolt">
                  <ShieldIcon className="h-8 w-8" />
                </span>
              </div>

              <div className="mt-8 space-y-2 text-sm">
                <p className="text-xs uppercase tracking-wider text-zinc-500">
                  Certificate issued to
                </p>
                <p className="font-display text-2xl font-bold">
                  {customerName}
                </p>
                <p className="text-zinc-600">{order.customer.address}</p>
              </div>

              <dl className="mt-8 grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-xs uppercase tracking-wider text-zinc-500">
                    Certificate #
                  </dt>
                  <dd className="font-display text-lg font-bold">
                    {cert.number}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-zinc-500">
                    Issued
                  </dt>
                  <dd className="font-display text-lg font-bold">
                    {new Date(cert.issuedAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-zinc-500">
                    Expires
                  </dt>
                  <dd className="font-display text-lg font-bold">
                    {cert.expiresAt
                      ? new Date(cert.expiresAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-zinc-500">
                    Order
                  </dt>
                  <dd className="font-display text-lg font-bold">
                    #{order.id.slice(-6).toUpperCase()}
                  </dd>
                </div>
              </dl>

              {cert.notes && (
                <div className="mt-8 rounded-xl border-l-4 border-bolt bg-zinc-50 p-4 text-sm text-zinc-700">
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Inspector&apos;s notes
                  </p>
                  <p className="mt-1">{cert.notes}</p>
                </div>
              )}

              {cert.fileUrl && (
                <div className="cert-no-print mt-8">
                  <img
                    src={cert.fileUrl}
                    alt={`${cert.type} – ${cert.number}`}
                    className="w-full rounded-xl border border-zinc-200"
                  />
                </div>
              )}

              <div className="mt-10 flex flex-wrap items-end justify-between gap-6 border-t border-zinc-200 pt-5 text-xs text-zinc-500">
                <div>
                  <p className="font-semibold uppercase tracking-wider">
                    Issued by
                  </p>
                  <p className="mt-1 font-display text-base text-ink">
                    Dave Electrical Services Ltd
                  </p>
                  <p>NAPIT Registered — 30178</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold uppercase tracking-wider">
                    Certificate
                  </p>
                  <p className="mt-1 font-display text-base text-ink">
                    NAP/30178/18/1
                  </p>
                </div>
              </div>
            </div>

            {!fullyPaid && (
              <div className="pointer-events-none absolute inset-0 grid place-items-center">
                <div className="rounded-2xl border-4 border-amber-500 bg-amber-500/95 px-8 py-4 font-display text-2xl font-bold tracking-wide text-ink shadow-2xl sm:text-3xl">
                  BALANCE OWED — {formatGBP(outstanding)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action bar */}
        {fullyPaid && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4 text-emerald-100">
            <p className="flex items-center gap-2 text-sm">
              <CheckIcon className="h-5 w-5 text-emerald-300" /> Fully paid —
              ready to download.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => window.print()}
                className="rounded-full bg-bolt px-5 py-2 text-sm font-bold text-ink"
              >
                Print / Save PDF
              </button>
              {cert.fileUrl && (
                <a
                  href={cert.fileUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-emerald-500/30 bg-emerald-500/20 px-5 py-2 text-sm font-bold text-emerald-100"
                >
                  Download original
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
