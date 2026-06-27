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
  iconKey: "test" | "shield" | "bulb" | "clock" | "plug" | "building";
  accent: string;
  /**
   * For products with multiple price tiers (EICR by bed count, PAT by appliance count).
   * If `variants` is provided, `price` is the cheapest variant — used purely for display.
   */
  variants?: ProductVariant[];
  variantLabel?: string;
  price?: number;
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
  { id: "basic", label: "Basic battery alarms & heat detector", price: 69.99 },
  { id: "mains", label: "Mains wired alarm & interlinked heat detector", price: 89.99 },
  { id: "zone8", label: "Up to 8 zone alarm system", price: 129.99 },
] as const;
export const FA_FAULT = [
  { id: "no", label: "Not required", price: 0 },
  { id: "yes", label: "Fault find / fix — £150 for the first hour", price: 150 },
] as const;

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
      "Full Electrical Installation Condition Report for a residential property. Covers consumer unit, circuits, sockets and fixed wiring — issued by a fully NAPIT-registered electrician with photographic evidence.",
    unit: "per property",
    badge: "Most popular",
    iconKey: "shield",
    accent: "#ffd400",
    variants: [
      // Residential — by BHK / bed count
      { id: "res-1bhk", label: "Residential · 1 BHK", price: 110 },
      { id: "res-2bhk", label: "Residential · 2 BHK", price: 120 },
      { id: "res-3bhk", label: "Residential · 3 BHK", price: 130 },
      { id: "res-4bhk", label: "Residential · 4 BHK", price: 135 },
      { id: "res-5bhk", label: "Residential · 5 BHK", price: 140 },
      // Commercial — by floor area × phase
      { id: "com-sml-1ph", label: "Commercial · < 1,000 sq ft · Single phase", price: 180 },
      { id: "com-sml-3ph", label: "Commercial · < 1,000 sq ft · 3 phase", price: 230 },
      { id: "com-med-1ph", label: "Commercial · 1,000 – 2,500 sq ft · Single phase", price: 250 },
      { id: "com-med-3ph", label: "Commercial · 1,000 – 2,500 sq ft · 3 phase", price: 310 },
      { id: "com-lrg-1ph", label: "Commercial · 2,500 – 5,000 sq ft · Single phase", price: 350 },
      { id: "com-lrg-3ph", label: "Commercial · 2,500 – 5,000 sq ft · 3 phase", price: 420 },
      { id: "com-xl-1ph", label: "Commercial · 5,000+ sq ft · Single phase", price: 500 },
      { id: "com-xl-3ph", label: "Commercial · 5,000+ sq ft · 3 phase", price: 600 },
    ],
    variantLabel: "Property type",
    price: 110,
    highlights: [
      "Compliant with Landlord Electrical Safety Standards",
      "Photographic evidence included",
      "Issued by NAPIT registered engineer",
      "Bulk pricing for portfolios",
    ],
  },
  {
    id: "pat",
    slug: "pat-testing",
    name: "PAT — Portable Appliance Testing",
    shortName: "PAT Testing",
    tagline: "Portable Appliance Testing made simple",
    description:
      "Portable Appliance Testing for your office, home or workplace. Includes an itemised report, legal compliance certificate, and minor repairs free of charge. Trusted by start-ups to large brands across West London.",
    unit: "per visit",
    badge: "Same-day available",
    iconKey: "test",
    accent: "#ffd400",
    variants: [
      { id: "upto-5", label: "From 1 to 5 appliances", price: 65 },
      { id: "upto-10", label: "From 1 to 10 appliances", price: 75 },
      { id: "upto-20", label: "From 1 to 20 appliances", price: 85 },
      { id: "upto-30", label: "From 1 to 30 appliances", price: 95 },
    ],
    variantLabel: "Number of appliances",
    price: 65,
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
    badge: "From £69.99",
    iconKey: "bulb",
    accent: "#ffd400",
    variants: fireAlarmVariants(),
    variantLabel: "Alarm type",
    price: 69.99,
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
      "London emergency light testing & inspection deals. Multi-service engineers and surveyors to save you multiple service visits — everything is covered under one order, with the date and approximate time confirmed by email.",
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
    id: "hmo-emergency-lighting",
    slug: "hmo-emergency-lighting",
    name: "HMO Emergency Lighting",
    shortName: "HMO Emergency Lighting",
    tagline: "BS5266 / BS5588 compliant testing",
    description:
      "Emergency lighting testing for HMO properties — system inspection, testing regime and certification. Helps you meet your fire safety obligations under the Regulatory Reform (Fire Safety) Order 2005.",
    unit: "per property",
    iconKey: "bulb",
    accent: "#ffd400",
    price: 120,
    highlights: [
      "Conforms to BS5266 & BS5588",
      "Full testing & certification",
      "HMO compliance support",
      "Fault reporting included",
    ],
  },
  {
    id: "call-out",
    slug: "electrical-call-out",
    name: "Electrical Call Out",
    shortName: "Call Out",
    tagline: "Quick-response fault visits",
    description:
      "Quick-response electrical call out — fault finding, light fittings, sockets, switches, consumer unit issues and more. Fully insured, NAPIT-registered electrician on-site.",
    unit: "per visit",
    iconKey: "clock",
    accent: "#ffd400",
    price: 90,
    highlights: [
      "Same-week scheduling",
      "Fault finding included",
      "All standard parts covered",
      "Fully insured & registered",
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
