"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  findProduct,
  formatGBP,
  eicrCommercialVariantId,
  eicrCommercialPrice,
  EICR_COM_MAX_FUSEBOXES,
  EICR_COM_MAX_CIRCUITS,
  EICR_COM_INCLUDED_CIRCUITS,
} from "@/lib/products";
import { company } from "@/lib/content";
import AddToCartButton from "./AddToCartButton";
import { CheckIcon, BoltIcon, PhoneIcon } from "./Icons";

type EicrType = "res" | "com";
type Phase = "1ph" | "3ph";

const RES_OPTIONS = [
  { id: "res-1bhk", label: "1 bedroom" },
  { id: "res-2bhk", label: "2 bedrooms" },
  { id: "res-3bhk", label: "3 bedrooms" },
  { id: "res-4bhk", label: "4 bedrooms" },
  { id: "res-5bhk", label: "5 bedrooms" },
];

const clamp = (n: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, Number.isFinite(n) ? n : lo));

export default function EicrConfigurator() {
  const product = findProduct("eicr")!;
  const [type, setType] = useState<EicrType>("res");
  const [resId, setResId] = useState("res-2bhk");
  const [phase, setPhase] = useState<Phase>("1ph");
  const [fuseboxes, setFuseboxes] = useState(1);
  const [circuits, setCircuits] = useState(EICR_COM_INCLUDED_CIRCUITS);

  const variantId = useMemo(() => {
    if (type === "res") return resId;
    return eicrCommercialVariantId(phase, fuseboxes, circuits);
  }, [type, resId, phase, fuseboxes, circuits]);

  const price =
    type === "res"
      ? product.variants?.find((v) => v.id === resId)?.price ?? 0
      : eicrCommercialPrice(phase, fuseboxes, circuits);

  const inputCls =
    "w-full rounded-xl border border-white/10 bg-ink px-4 py-2.5 text-sm text-white focus:border-bolt/60 focus:outline-none focus:ring-2 focus:ring-bolt/20";
  const lblCls =
    "mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-ash";

  return (
    <div className="relative mt-5 space-y-4">
      {/* Type — Residential / Commercial */}
      <div className="grid grid-cols-2 gap-2">
        <TypeChip
          active={type === "res"}
          onClick={() => setType("res")}
          label="Residential"
          sub="1 – 5 bedrooms"
        />
        <TypeChip
          active={type === "com"}
          onClick={() => setType("com")}
          label="Commercial"
          sub="By phase, fuse boxes & circuits"
        />
      </div>

      {type === "res" ? (
        <motion.div
          key="res"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <label className={lblCls}>Number of bedrooms</label>
          <select
            value={resId}
            onChange={(e) => setResId(e.target.value)}
            className={inputCls}
          >
            {RES_OPTIONS.map((o) => {
              const v = product.variants?.find((x) => x.id === o.id);
              return (
                <option key={o.id} value={o.id} className="bg-ink">
                  {o.label} · {v ? formatGBP(v.price) : ""}
                </option>
              );
            })}
          </select>
        </motion.div>
      ) : (
        <motion.div
          key="com"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="grid gap-3 sm:grid-cols-3"
        >
          <div>
            <label className={lblCls}>Phase</label>
            <select
              value={phase}
              onChange={(e) => setPhase(e.target.value as Phase)}
              className={inputCls}
            >
              <option value="1ph" className="bg-ink">
                Single phase
              </option>
              <option value="3ph" className="bg-ink">
                3 Phase
              </option>
            </select>
          </div>
          <div>
            <label className={lblCls}>Fuse boxes</label>
            <select
              value={fuseboxes}
              onChange={(e) => setFuseboxes(clamp(+e.target.value, 1, EICR_COM_MAX_FUSEBOXES))}
              className={inputCls}
            >
              {Array.from({ length: EICR_COM_MAX_FUSEBOXES }, (_, i) => i + 1).map(
                (n) => (
                  <option key={n} value={n} className="bg-ink">
                    {n} fuse box{n > 1 ? "es" : ""}
                  </option>
                ),
              )}
            </select>
          </div>
          <div>
            <label className={lblCls}>Circuits</label>
            <select
              value={circuits}
              onChange={(e) => setCircuits(clamp(+e.target.value, 1, EICR_COM_MAX_CIRCUITS))}
              className={inputCls}
            >
              {Array.from({ length: EICR_COM_MAX_CIRCUITS }, (_, i) => i + 1).map(
                (n) => (
                  <option key={n} value={n} className="bg-ink">
                    {n} circuit{n > 1 ? "s" : ""}
                  </option>
                ),
              )}
            </select>
          </div>
        </motion.div>
      )}

      {/* Express EICR — same-day, call to check availability (Sr15) */}
      <a
        href={`tel:${company.phonePrimary}`}
        className="flex items-center justify-between gap-3 rounded-xl border border-bolt/30 bg-bolt/5 px-4 py-3 no-underline transition-colors hover:border-bolt/60 hover:bg-bolt/10"
      >
        <span className="flex items-center gap-2 text-xs font-semibold text-bolt">
          <BoltIcon className="h-4 w-4 shrink-0" />
          Express EICR — same-day EICR / remedial. Check availability.
        </span>
        <span className="flex items-center gap-1.5 whitespace-nowrap text-xs font-bold text-white">
          <PhoneIcon className="h-3.5 w-3.5" />
          Call · +£30
        </span>
      </a>

      {/* Price row */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-t border-white/10 pt-5">
        <div>
          <p className="font-display text-3xl font-bold text-gradient-bolt sm:text-4xl">
            {formatGBP(price)}
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-ash">
            <CheckIcon className="h-3 w-3 text-bolt" />
            ex VAT · pay 50% now
          </p>
        </div>
        <AddToCartButton productId="eicr" variantId={variantId} />
      </div>
    </div>
  );
}

function TypeChip({
  active,
  onClick,
  label,
  sub,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  sub: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative rounded-xl border p-3 text-left transition-all ${
        active
          ? "border-bolt bg-bolt/10"
          : "border-white/10 bg-ink hover:border-bolt/40"
      }`}
    >
      <span className="flex items-center justify-between">
        <span
          className={`font-display text-sm font-bold ${active ? "text-bolt" : "text-white"}`}
        >
          {label}
        </span>
        <span
          className={`grid h-5 w-5 place-items-center rounded-full border-2 ${
            active ? "border-bolt bg-bolt" : "border-white/30"
          }`}
        >
          {active && <span className="h-2 w-2 rounded-full bg-ink" />}
        </span>
      </span>
      <span className="mt-0.5 block text-[11px] text-ash">{sub}</span>
    </button>
  );
}
