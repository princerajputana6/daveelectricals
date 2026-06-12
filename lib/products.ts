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
      { id: "1-bed", label: "1 Bed property", price: 110 },
      { id: "2-bed", label: "2 Bed property", price: 120 },
      { id: "3-bed", label: "3 Bed property", price: 130 },
      { id: "4-bed", label: "4 Bed property", price: 135 },
      { id: "5-bed", label: "5 Bed property", price: 140 },
    ],
    variantLabel: "Property size",
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
    iconKey: "bulb",
    accent: "#ffd400",
    variants: [
      { id: "fa-1", label: "1 device / call point", price: 110 },
      { id: "fa-2", label: "2 devices / call points", price: 110 },
      { id: "fa-3", label: "3 devices / call points", price: 110 },
      { id: "fa-4", label: "4 devices / call points", price: 110 },
      { id: "fa-5", label: "5 devices / call points", price: 110 },
    ],
    variantLabel: "Number of devices",
    price: 110,
    highlights: [
      "Inspection & fault reporting",
      "Compliance certification",
      "Qualified, NAPIT-registered engineers",
      "Insurance & council approved",
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
