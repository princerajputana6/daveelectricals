export type ProductVariant = {
  id: string;
  label: string;
  price: number; // GBP ex VAT
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  unit: string;
  badge?: string;
  highlights: string[];
  iconKey:
    | "test"
    | "shield"
    | "bulb"
    | "clock"
    | "plug"
    | "building"
    | "siren"
    | "ev"
    | "solar"
    | "clipboard"
    | "bell"
    | "camera";
  accent: string;
  /**
   * For products with multiple price tiers (EICR by bed count, PAT by appliance count).
   * If `variants` is provided, `price` is the cheapest variant — used purely for display.
   */
  variants?: ProductVariant[];
  variantLabel?: string;
  price?: number;
  /**
   * Quoted per site rather than sold at a fixed price — the card shows a
   * "call for a quote" CTA instead of an Add to cart button.
   */
  enquiryOnly?: boolean;
  /**
   * Not shown in the public shop grid. Still fully purchasable by id (used for
   * the /test payment-verification page).
   */
  hidden?: boolean;
};

/* ───────── Multi-option product matrices (Emergency Light / Fire Alarm) ────
 * These products have several dropdowns that each affect the price. We
 * enumerate every combination into flat variants with composite ids so the
 * server can re-price any selection by id (preventing client-side tampering).
 * The configurator components build the same composite id from the dropdowns. */

export const CERT_OPTIONS = [
  { id: "std", label: "Standard — within 24–48 hours after site visit", price: 0 },
  { id: "exp", label: "Express — within 2–4 hours after site visit", price: 30 },
] as const;

// Emergency Light Testing — base tiers (number of EM lights tested)
export const EL_TIERS = [
  { id: "5x", lights: 5, price: 109 },
  { id: "10x", lights: 10, price: 159 },
  { id: "20x", lights: 20, price: 200 },
  { id: "40x", lights: 40, price: 280 },
  { id: "60x", lights: 60, price: 360 },
  { id: "80x", lights: 80, price: 440 },
  { id: "100x", lights: 100, price: 520 },
  { id: "120x", lights: 120, price: 600 },
  { id: "140x", lights: 140, price: 680 },
] as const;
export const EL_ADDON_PRICE = 5;
export const EL_ADDON_MAX = 10;

export function emergencyLightVariantId(
  tierId: string,
  add: number,
  certId: string,
) {
  return `el-${tierId}-a${add}-${certId}`;
}

function emergencyLightVariants(): ProductVariant[] {
  const out: ProductVariant[] = [];
  for (const t of EL_TIERS) {
    for (let add = 0; add <= EL_ADDON_MAX; add++) {
      for (const c of CERT_OPTIONS) {
        out.push({
          id: emergencyLightVariantId(t.id, add, c.id),
          label:
            `EM Lights ${t.lights}X` +
            (add > 0 ? ` · +${add} extra test${add > 1 ? "s" : ""}` : "") +
            (c.price > 0 ? " · Express cert" : ""),
          price: t.price + add * EL_ADDON_PRICE + c.price,
        });
      }
    }
  }
  return out;
}

// Fire Alarm Testing — system type
export const FA_TYPES = [
  { id: "basic", label: "Basic battery alarms & heat detector", price: 79.99 },
  { id: "mains", label: "Mains wired alarm & interlinked heat detector", price: 99.99 },
  { id: "zone8", label: "Up to 8 zone alarm system", price: 139.99 },
] as const;
export const FA_FAULT = [
  { id: "no", label: "Not required", price: 0 },
  { id: "yes", label: "Fault find / fix — £150 for the first hour", price: 150 },
] as const;

/* EICR commercial pricing (Sr15) — priced by phase + number of fuse boxes +
 * number of circuits, rather than floor area:
 *   £250 base  → single phase, 1 fuse box, up to 25 circuits
 *   +£7        → every additional circuit beyond 25
 *   +£50       → 3-phase
 *   +£50       → every additional fuse box (up to 30)
 * We still enumerate every combination into flat variants with composite ids so
 * the server re-prices any selection by id (preventing client-side tampering) —
 * the checkout / order pipeline is unchanged. */
export const EICR_COM_BASE = 250;
export const EICR_COM_INCLUDED_CIRCUITS = 25;
export const EICR_COM_CIRCUIT_ADDON = 7;
export const EICR_COM_3PHASE_ADDON = 50;
export const EICR_COM_FUSEBOX_ADDON = 50;
export const EICR_COM_MAX_FUSEBOXES = 30;
export const EICR_COM_MAX_CIRCUITS = 60;

export function eicrCommercialVariantId(
  phase: "1ph" | "3ph",
  fuseboxes: number,
  circuits: number,
) {
  return `com-${phase}-fb${fuseboxes}-c${circuits}`;
}

export function eicrCommercialPrice(
  phase: "1ph" | "3ph",
  fuseboxes: number,
  circuits: number,
) {
  return (
    EICR_COM_BASE +
    (phase === "3ph" ? EICR_COM_3PHASE_ADDON : 0) +
    Math.max(0, circuits - EICR_COM_INCLUDED_CIRCUITS) * EICR_COM_CIRCUIT_ADDON +
    Math.max(0, fuseboxes - 1) * EICR_COM_FUSEBOX_ADDON
  );
}

function eicrCommercialVariants(): ProductVariant[] {
  const out: ProductVariant[] = [];
  for (const phase of ["1ph", "3ph"] as const) {
    for (let fb = 1; fb <= EICR_COM_MAX_FUSEBOXES; fb++) {
      for (let c = 1; c <= EICR_COM_MAX_CIRCUITS; c++) {
        out.push({
          id: eicrCommercialVariantId(phase, fb, c),
          label:
            `Commercial · ${phase === "3ph" ? "3 phase" : "Single phase"} · ` +
            `${fb} fuse box${fb > 1 ? "es" : ""} · ${c} circuit${c > 1 ? "s" : ""}`,
          price: eicrCommercialPrice(phase, fb, c),
        });
      }
    }
  }
  return out;
}

export function fireAlarmVariantId(
  typeId: string,
  faultId: string,
  certId: string,
) {
  return `fa-${typeId}-${faultId}-${certId}`;
}

function fireAlarmVariants(): ProductVariant[] {
  const out: ProductVariant[] = [];
  for (const t of FA_TYPES) {
    for (const f of FA_FAULT) {
      for (const c of CERT_OPTIONS) {
        out.push({
          id: fireAlarmVariantId(t.id, f.id, c.id),
          label:
            t.label +
            (f.price > 0 ? " · +Fault find/fix" : "") +
            (c.price > 0 ? " · Express cert" : ""),
          price: +(t.price + f.price + c.price).toFixed(2),
        });
      }
    }
  }
  return out;
}

export const products: Product[] = [
  {
    id: "eicr",
    slug: "eicr-landlord-safety",
    name: "EICR — Electrical Installation Condition Report",
    shortName: "EICR Landlord Certificate",
    tagline: "Required by law for every let property",
    description:
      "Protect your property. Ensure your tenants and property are fully protected by booking your electrical safety inspection today. Failure to comply will invalidate most landlord insurance policies, potentially leaving your whole property exposed to disaster. We provide a comprehensive electrical safety testing service specifically designed to safeguard landlords and their properties.",
    unit: "per property",
    badge: "Most popular",
    iconKey: "shield",
    accent: "#ffd400",
    variants: [
      // Residential — by bedroom count (Sr15: BHK → bedrooms)
      { id: "res-1bhk", label: "Residential · 1 bedroom", price: 110 },
      { id: "res-2bhk", label: "Residential · 2 bedrooms", price: 120 },
      { id: "res-3bhk", label: "Residential · 3 bedrooms", price: 130 },
      { id: "res-4bhk", label: "Residential · 4 bedrooms", price: 135 },
      { id: "res-5bhk", label: "Residential · 5 bedrooms", price: 140 },
      // Commercial — by phase × fuse boxes × circuits (Sr15)
      ...eicrCommercialVariants(),
    ],
    variantLabel: "Property type",
    price: 110,
    highlights: [
      "Compliant with Landlord Electrical Safety Standards",
      "Photographic evidence provided on request",
      "Issued by NAPIT registered engineer",
      "Bulk pricing for portfolios",
      "In-house booking team to get the job done",
    ],
  },
  {
    id: "pat",
    slug: "pat-testing",
    name: "PAT — Portable Appliance Testing",
    shortName: "PAT Testing",
    tagline: "Portable Appliance Testing made simple",
    description:
      "Portable Appliance Testing for your office, home or workplace. Includes an itemised report, legal compliance certificate, and minor repairs free of charge. Trusted by start-ups to large brands within & surrounding the M25.",
    unit: "per visit",
    badge: "Same-day available",
    iconKey: "test",
    accent: "#ffd400",
    // Sr16 — full attached PAT price ladder (1 → 1000 appliances), list price + £20.
    variants: [
      { id: "pat-5", label: "From 1 to 5 PAT tests", price: 69 },
      { id: "pat-10", label: "From 1 to 10 PAT tests", price: 74 },
      { id: "pat-20", label: "From 1 to 20 PAT tests", price: 84 },
      { id: "pat-30", label: "From 1 to 30 PAT tests", price: 94 },
      { id: "pat-50", label: "From 1 to 50 PAT tests", price: 104 },
      { id: "pat-60", label: "From 1 to 60 PAT tests", price: 110 },
      { id: "pat-70", label: "From 1 to 70 PAT tests", price: 114 },
      { id: "pat-80", label: "From 1 to 80 PAT tests", price: 124 },
      { id: "pat-100", label: "From 1 to 100 PAT tests", price: 149 },
      { id: "pat-150", label: "From 1 to 150 PAT tests", price: 170 },
      { id: "pat-200", label: "From 1 to 200 PAT tests", price: 194 },
      { id: "pat-300", label: "From 1 to 300 PAT tests", price: 274 },
      { id: "pat-400", label: "From 1 to 400 PAT tests", price: 324 },
      { id: "pat-500", label: "From 1 to 500 PAT tests", price: 374 },
      { id: "pat-600", label: "From 1 to 600 PAT tests", price: 445 },
      { id: "pat-700", label: "From 1 to 700 PAT tests", price: 515 },
      { id: "pat-800", label: "From 1 to 800 PAT tests", price: 585 },
      { id: "pat-900", label: "From 1 to 900 PAT tests", price: 655 },
      { id: "pat-1000", label: "From 1 to 1000 PAT tests", price: 715 },
    ],
    variantLabel: "Number of appliances",
    price: 69,
    highlights: [
      "Itemised report & legal certificate",
      "Minor repairs included free",
      "Same-day & out-of-hours options",
      "Trusted by start-ups to large brands",
    ],
  },
  {
    id: "fire-alarm-testing",
    slug: "fire-alarm-testing",
    name: "Fire Alarm Testing",
    shortName: "Fire Alarm Testing",
    tagline: "Compliant fire alarm system inspection",
    description:
      "Fire alarm testing carried out by qualified engineers. Full system inspection, fault reporting and certification — designed to keep your property safe and your insurance valid.",
    unit: "per visit",
    badge: "From £79.99",
    iconKey: "bulb",
    accent: "#ffd400",
    variants: fireAlarmVariants(),
    variantLabel: "Alarm type",
    price: 79.99,
    highlights: [
      "Inspection & fault reporting",
      "Compliance certification",
      "Qualified, NAPIT-registered engineers",
      "Insurance & council approved",
    ],
  },
  {
    id: "emergency-light-testing",
    slug: "emergency-light-testing",
    name: "Emergency Light Testing",
    shortName: "Emergency Light Testing",
    tagline: "For all business sectors — from £109",
    description:
      "We routinely complete Emergency Lighting drain-down tests to ensure that, should this safety system ever be called into action, it provides the vital illumination required. Includes testing your lights, checking battery and backup duration, a wider inspection and a final report.",
    unit: "per visit",
    badge: "From £109",
    iconKey: "bulb",
    accent: "#ffd400",
    variants: emergencyLightVariants(),
    variantLabel: "Number of tests",
    price: 109,
    highlights: [
      "Itemised report & legal certificate",
      "Additional tests at £5 per light",
      "Standard or express certificate delivery",
      "Multi-service engineers — one visit",
    ],
  },
  {
    id: "em-lighting-log-book",
    slug: "emergency-lighting-log-book",
    name: "Emergency Lighting Log Book",
    shortName: "Emergency Lighting Log Book",
    tagline: "Stay compliant — professional on-site log book",
    description:
      "Ensure your emergency lighting is always operational with regular testing and inspections using this professional on-site log book — critical for safe evacuations during fires, power outages and other emergencies. Helps you adhere to British Standard BS5266-1 and the Regulatory Reform (Fire Safety) Order.",
    unit: "per book",
    badge: "New",
    iconKey: "clipboard",
    accent: "#ffd400",
    price: 110,
    highlights: [
      "Track & maintain mandatory test records",
      "Simple tick-list system for easy record-keeping",
      "Adheres to BS5266-1 & the Fire Safety Order",
      "A4 book, 80 pages — records 1,700+ fittings",
    ],
  },
  {
    id: "em-lighting-service-contract",
    slug: "emergency-lighting-service-contract",
    name: "Emergency Lighting Service Contract",
    shortName: "Em Lighting Service Contract",
    tagline: "Year-round BS5266 compliance, handled for you",
    description:
      "An annual contract that keeps your emergency lighting compliant without you having to track a thing. We schedule and carry out the monthly flick tests and the annual 3-hour drain-down test, log every result, report any faults and issue your certification — so your escape routes stay lit and your Fire Safety Order obligations stay covered.",
    unit: "per site, per year",
    badge: "Contract",
    iconKey: "bulb",
    accent: "#ffd400",
    enquiryOnly: true,
    highlights: [
      "Scheduled monthly flick tests & annual 3-hour test",
      "All results logged — no record-keeping for you",
      "Fault reporting with repair quotes if needed",
      "Certification issued to BS5266-1",
    ],
  },
  {
    id: "test-payment",
    slug: "test-payment",
    name: "Test Payment (£1)",
    shortName: "Test Payment",
    tagline: "Live Stripe payment test — £1",
    description:
      "A £1 item used only to verify the live Stripe checkout end to end. Not a real service. Refund it from the Stripe dashboard after testing.",
    unit: "one-off",
    badge: "Test only",
    iconKey: "plug",
    accent: "#ffd400",
    price: 1,
    hidden: true,
    highlights: [
      "Charges a real £1 on the live Stripe keys",
      "Choose “Pay in full” at checkout for exactly £1",
      "Refundable from the Stripe dashboard",
    ],
  },
  {
    id: "video-call",
    slug: "video-call-troubleshooting",
    name: "Video Call Troubleshooting",
    shortName: "Video Call Troubleshooting",
    tagline: "NEW — real-time electrical troubleshooting",
    description:
      "Real-time electrical troubleshooting over a video call with an expert electrician. We'll help you fix it yourself with a step-by-step walkthrough — a fixed fee, with no call-out required.",
    unit: "per call",
    badge: "New",
    iconKey: "clock",
    accent: "#ffd400",
    price: 15,
    highlights: [
      "Video call support with an expert electrician",
      "Step-by-step walkthrough",
      "Fixed fee — only £15",
      "Fast help with no call-out required",
    ],
  },
  {
    id: "call-out",
    slug: "electrical-call-out",
    name: "Electrical Call Out",
    shortName: "Call Out",
    tagline: "Quick-response fault visits",
    description:
      "Experienced electricians are critical for electrical call-outs because they quickly identify hazards like overloaded circuits, burning smells, or faulty wiring. Their expertise ensures safety, prevents fires, and provides long-term solutions rather than temporary, dangerous workarounds.",
    unit: "per visit",
    iconKey: "clock",
    accent: "#ffd400",
    price: 90,
    highlights: [
      "Rapid fault-finding",
      "Safety & compliance",
      "Specialised tools",
      "Full, in-depth report on completion",
    ],
  },
  {
    id: "same-day-call-out",
    slug: "same-day-emergency-call-out",
    name: "Same Day Emergency Call Out",
    shortName: "Same Day Emergency",
    tagline: "24/7 emergency electrician",
    description:
      "Same-day emergency electrical response — 24 hours a day, 365 days a year. From light fittings and sockets to commercial properties, air conditioning systems and main supplies — we get the power back up.",
    unit: "per visit",
    badge: "24/7 response",
    iconKey: "clock",
    accent: "#ffd400",
    price: 110,
    highlights: [
      "24/7 manned service",
      "365 days a year",
      "Domestic & commercial",
      "Fully trained professionals",
    ],
  },
];

export function findProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function findVariant(
  product: Product,
  variantId: string | undefined,
): ProductVariant | undefined {
  if (!product.variants || !variantId) return undefined;
  return product.variants.find((v) => v.id === variantId);
}

/**
 * Resolve a price (and label) for a product + variant combo.
 * Throws if the product expects a variant and none provided.
 */
export function priceFor(
  productId: string,
  variantId?: string,
): { price: number; label: string; variantLabel?: string } {
  const product = findProduct(productId);
  if (!product) throw new Error(`Unknown product: ${productId}`);
  if (product.variants && product.variants.length > 0) {
    const variant = findVariant(product, variantId);
    if (!variant) {
      throw new Error(
        `Product ${product.shortName} requires a ${product.variantLabel || "variant"} selection.`,
      );
    }
    return {
      price: variant.price,
      label: variant.label,
      variantLabel: product.variantLabel,
    };
  }
  if (product.price === undefined) {
    throw new Error(`Product ${product.shortName} has no price configured.`);
  }
  return { price: product.price, label: product.shortName };
}

export const currency = {
  code: "GBP",
  symbol: "£",
};

export function formatGBP(amount: number): string {
  return `${currency.symbol}${amount.toFixed(2)}`;
}

/** Convert pounds to pence for payment gateway */
export function toPence(amount: number): number {
  return Math.round(amount * 100);
}
