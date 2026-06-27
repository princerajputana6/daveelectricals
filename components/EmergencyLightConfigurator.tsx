"use client";

import { useMemo, useState } from "react";
import {
  findProduct,
  formatGBP,
  EL_TIERS,
  EL_ADDON_PRICE,
  EL_ADDON_MAX,
  CERT_OPTIONS,
  emergencyLightVariantId,
} from "@/lib/products";
import AddToCartButton from "./AddToCartButton";
import { CheckIcon } from "./Icons";

export default function EmergencyLightConfigurator() {
  const product = findProduct("emergency-light-testing")!;
  const [tierId, setTierId] = useState<string>(EL_TIERS[0].id);
  const [add, setAdd] = useState(0);
  const [certId, setCertId] = useState<string>("std");

  const variantId = useMemo(
    () => emergencyLightVariantId(tierId, add, certId),
    [tierId, add, certId],
  );
  const variant = product.variants?.find((v) => v.id === variantId);
  const price = variant?.price ?? 0;

  const inputCls =
    "w-full rounded-xl border border-white/10 bg-ink px-4 py-2.5 text-sm text-white focus:border-bolt/60 focus:outline-none focus:ring-2 focus:ring-bolt/20";
  const lblCls =
    "mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-ash";

  return (
    <div className="relative mt-5 space-y-4">
      {/* Number of tests */}
      <div>
        <label className={lblCls}>Please select the number of tests required</label>
        <select
          value={tierId}
          onChange={(e) => setTierId(e.target.value)}
          className={inputCls}
        >
          {EL_TIERS.map((t) => (
            <option key={t.id} value={t.id} className="bg-ink">
              EM Lights {t.lights}X · {formatGBP(t.price)} Plus vat
            </option>
          ))}
        </select>
      </div>

      {/* Additional tests at £5 per light */}
      <div>
        <label className={lblCls}>Additional Tests at £{EL_ADDON_PRICE} per light</label>
        <select
          value={add}
          onChange={(e) => setAdd(Number(e.target.value))}
          className={inputCls}
        >
          <option value={0} className="bg-ink">
            No additional tests required
          </option>
          {Array.from({ length: EL_ADDON_MAX }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n} className="bg-ink">
              +{n} (+{formatGBP(n * EL_ADDON_PRICE)})
            </option>
          ))}
        </select>
      </div>

      {/* Certificate delivery */}
      <CertDelivery certId={certId} onChange={setCertId} lblCls={lblCls} />

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
        <AddToCartButton productId={product.id} variantId={variantId} />
      </div>
    </div>
  );
}

export function CertDelivery({
  certId,
  onChange,
  lblCls,
}: {
  certId: string;
  onChange: (id: string) => void;
  lblCls: string;
}) {
  return (
    <fieldset>
      <legend className={lblCls}>Certificate delivery</legend>
      <div className="space-y-2">
        {CERT_OPTIONS.map((c) => (
          <label
            key={c.id}
            className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm transition-all ${
              certId === c.id
                ? "border-bolt bg-bolt/10"
                : "border-white/10 bg-ink hover:border-bolt/40"
            }`}
          >
            <input
              type="radio"
              name="cert-delivery"
              value={c.id}
              checked={certId === c.id}
              onChange={() => onChange(c.id)}
              className="sr-only"
            />
            <span
              className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border-2 ${
                certId === c.id ? "border-bolt bg-bolt" : "border-white/30"
              }`}
            >
              {certId === c.id && <span className="h-1.5 w-1.5 rounded-full bg-ink" />}
            </span>
            <span className="leading-tight text-white">
              {c.label}{" "}
              <span className={c.price > 0 ? "font-bold text-bolt" : "text-ash"}>
                {c.price > 0 ? `+${formatGBP(c.price)}` : "Free"}
              </span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
