"use client";

import { useMemo, useState } from "react";
import {
  findProduct,
  formatGBP,
  FA_TYPES,
  FA_FAULT,
  fireAlarmVariantId,
} from "@/lib/products";
import AddToCartButton from "./AddToCartButton";
import { CertDelivery } from "./EmergencyLightConfigurator";
import { CheckIcon } from "./Icons";

export default function FireAlarmConfigurator() {
  const product = findProduct("fire-alarm-testing")!;
  const [typeId, setTypeId] = useState<string>(FA_TYPES[0].id);
  const [faultId, setFaultId] = useState<string>("no");
  const [certId, setCertId] = useState<string>("std");

  const variantId = useMemo(
    () => fireAlarmVariantId(typeId, faultId, certId),
    [typeId, faultId, certId],
  );
  const variant = product.variants?.find((v) => v.id === variantId);
  const price = variant?.price ?? 0;

  const inputCls =
    "w-full rounded-xl border border-white/10 bg-ink px-4 py-2.5 text-sm text-white focus:border-bolt/60 focus:outline-none focus:ring-2 focus:ring-bolt/20";
  const lblCls =
    "mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-ash";

  return (
    <div className="relative mt-5 space-y-4">
      {/* Alarm type */}
      <div>
        <label className={lblCls}>Please select your alarm type</label>
        <select
          value={typeId}
          onChange={(e) => setTypeId(e.target.value)}
          className={inputCls}
        >
          {FA_TYPES.map((t) => (
            <option key={t.id} value={t.id} className="bg-ink">
              {t.label} · {formatGBP(t.price)}
              {t.id === "basic" ? "" : " +VAT"}
            </option>
          ))}
        </select>
      </div>

      {/* Fault find or fix */}
      <div>
        <label className={lblCls}>Fault find or fix service — £150 for the first hour</label>
        <select
          value={faultId}
          onChange={(e) => setFaultId(e.target.value)}
          className={inputCls}
        >
          {FA_FAULT.map((f) => (
            <option key={f.id} value={f.id} className="bg-ink">
              {f.label}
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
