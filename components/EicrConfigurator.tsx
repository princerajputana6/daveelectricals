"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { findProduct, formatGBP } from "@/lib/products";
import AddToCartButton from "./AddToCartButton";
import { CheckIcon } from "./Icons";

type EicrType = "res" | "com";
type Phase = "1ph" | "3ph";

const RES_OPTIONS = [
  { id: "res-1bhk", label: "1 BHK" },
  { id: "res-2bhk", label: "2 BHK" },
  { id: "res-3bhk", label: "3 BHK" },
  { id: "res-4bhk", label: "4 BHK" },
  { id: "res-5bhk", label: "5 BHK" },
];

const COM_AREAS = [
  { id: "sml", label: "Under 1,000 sq ft" },
  { id: "med", label: "1,000 – 2,500 sq ft" },
  { id: "lrg", label: "2,500 – 5,000 sq ft" },
  { id: "xl", label: "Over 5,000 sq ft" },
];

export default function EicrConfigurator() {
  const product = findProduct("eicr")!;
  const [type, setType] = useState<EicrType>("res");
  const [resId, setResId] = useState("res-2bhk");
  const [comArea, setComArea] = useState("med");
  const [phase, setPhase] = useState<Phase>("3ph");

  const variantId = useMemo(() => {
    if (type === "res") return resId;
    return `com-${comArea}-${phase}`;
  }, [type, resId, comArea, phase]);

  const variant = product.variants?.find((v) => v.id === variantId);
  const price = variant?.price ?? 0;

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
          sub="1 – 5 BHK"
        />
        <TypeChip
          active={type === "com"}
          onClick={() => setType("com")}
          label="Commercial"
          sub="By floor area & phase"
        />
      </div>

      {type === "res" ? (
        <motion.div
          key="res"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <label className={lblCls}>Property size</label>
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
          className="grid gap-3 sm:grid-cols-2"
        >
          <div>
            <label className={lblCls}>Floor area</label>
            <select
              value={comArea}
              onChange={(e) => setComArea(e.target.value)}
              className={inputCls}
            >
              {COM_AREAS.map((a) => (
                <option key={a.id} value={a.id} className="bg-ink">
                  {a.label}
                </option>
              ))}
            </select>
          </div>
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
        </motion.div>
      )}

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
