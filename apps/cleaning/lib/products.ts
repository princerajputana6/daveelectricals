export type ProductVariant = {
  id: string;
  label: string;
  price: number; // GBP ex VAT (VAT added at checkout)
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
    | "sparkle"
    | "clock"
    | "spray"
    | "clipboard"
    | "building"
    | "broom"
    | "shield"
    | "siren"
    | "plug";
  accent: string;
  /**
   * Price tiers. For cleaning services these are the property-size options
   * (Studio → 5 Bedrooms) taken from the guide-price matrix. If `variants` is
   * present, `price` is the cheapest one — used purely for the "From £X" label.
   * The server re-prices any selection by variant id (priceFor), so a tampered
   * client price is ignored.
   */
  variants?: ProductVariant[];
  variantLabel?: string;
  price?: number;
  /**
   * Quoted per property rather than sold at a fixed price — the UI shows a
   * "Get a quote" CTA (→ contact) instead of an instant booking flow.
   */
  enquiryOnly?: boolean;
  /**
   * Not shown in public grids. Still purchasable by id (used by the /test
   * Stripe payment-verification page).
   */
  hidden?: boolean;
};

/* ─────────────────────────── Cleaning price matrix ───────────────────────────
 * Guide prices by property size × service type (all ex VAT — VAT is added at
 * checkout). Studio → 5 Bedrooms are instantly bookable; "6+ Bedrooms" is
 * quote-only. Each service is a product whose variants are the property sizes,
 * so the existing cart / Stripe checkout re-prices any selection by variant id.
 *
 *   Size          Regular  One-Off  Deep  End of Tenancy  After Builders
 *   Studio          40       60      110       150             140
 *   1 Bedroom       50       75      140       180             170
 *   2 Bedrooms      60      100      180       230             220
 *   3 Bedrooms      80      130      230       290             280
 *   4 Bedrooms     100      165      290       360             350
 *   5 Bedrooms     120      200      350       430             420
 *   6+ Bedrooms   ── Get a quote ──
 * ──────────────────────────────────────────────────────────────────────────── */

export const PROPERTY_SIZES = [
  { id: "studio", label: "Studio" },
  { id: "1bed", label: "1 Bedroom" },
  { id: "2bed", label: "2 Bedrooms" },
  { id: "3bed", label: "3 Bedrooms" },
  { id: "4bed", label: "4 Bedrooms" },
  { id: "5bed", label: "5 Bedrooms" },
] as const;

/** Shown as the final, quote-only row of every size selector. */
export const PROPERTY_SIZE_QUOTE = { id: "6plus", label: "6+ Bedrooms" };

function sizeVariants(prices: [number, number, number, number, number, number]): ProductVariant[] {
  return PROPERTY_SIZES.map((s, i) => ({
    id: s.id,
    label: s.label,
    price: prices[i],
  }));
}

function service(
  slug: string,
  name: string,
  tagline: string,
  description: string,
  iconKey: Product["iconKey"],
  prices: [number, number, number, number, number, number],
  badge?: string,
): Product {
  return {
    id: slug,
    slug,
    name,
    shortName: name,
    tagline,
    description,
    unit: "per clean",
    badge,
    iconKey,
    accent: "#14a1e6",
    variants: sizeVariants(prices),
    variantLabel: "Property size",
    price: prices[0],
    highlights: [],
  };
}

export const products: Product[] = [
  service(
    "regular-cleaning",
    "Regular Cleaning",
    "Weekly or fortnightly upkeep",
    "Consistent, reliable cleaning arranged around your schedule.",
    "sparkle",
    [40, 50, 60, 80, 100, 120],
    "From £40",
  ),
  service(
    "one-off-cleaning",
    "One-Off Cleaning",
    "A single professional clean",
    "Professional cleaning whenever you need an extra helping hand — no commitment.",
    "clock",
    [60, 75, 100, 130, 165, 200],
    "From £60",
  ),
  service(
    "deep-cleaning",
    "Deep Cleaning",
    "Top-to-bottom intensive clean",
    "A thorough, detailed clean for areas that need extra attention.",
    "spray",
    [110, 140, 180, 230, 290, 350],
    "From £110",
  ),
  service(
    "end-of-tenancy",
    "End of Tenancy Cleaning",
    "Move-outs & handovers",
    "A comprehensive property clean for tenants, landlords and estate agents.",
    "clipboard",
    [150, 180, 230, 290, 360, 430],
    "From £150",
  ),
  service(
    "after-builders",
    "After Builders Cleaning",
    "Post-renovation cleaning",
    "Dust and residue removal after renovation, refurbishment or building work.",
    "building",
    [140, 170, 220, 280, 350, 420],
    "From £140",
  ),

  // ── Quote-only services (priced after a short assessment) ──────────────────
  {
    id: "carpet-upholstery",
    slug: "carpet-upholstery",
    name: "Carpet & Upholstery Cleaning",
    shortName: "Carpet & Upholstery",
    tagline: "Carpets, rugs & soft furnishings",
    description:
      "Restore carpets, rugs and upholstered furniture with professional cleaning. Priced per property on request.",
    unit: "per property",
    iconKey: "broom",
    accent: "#14a1e6",
    enquiryOnly: true,
    highlights: [],
  },
  {
    id: "commercial-cleaning",
    slug: "commercial-cleaning",
    name: "Commercial Cleaning",
    shortName: "Commercial Cleaning",
    tagline: "Offices, retail & managed property",
    description:
      "Reliable cleaning for businesses and managed properties, priced following a short assessment.",
    unit: "per site",
    iconKey: "shield",
    accent: "#14a1e6",
    enquiryOnly: true,
    highlights: [],
  },

  // ── Same-day emergency slot booking (used by /book) ────────────────────────
  {
    id: "same-day-call-out",
    slug: "same-day-cleaning-call-out",
    name: "Same-Day Emergency Clean",
    shortName: "Same-Day Emergency Clean",
    tagline: "Fast-response cleaning",
    description:
      "A same-day emergency cleaning call-out, paid in full to secure your slot.",
    unit: "per visit",
    badge: "Same-day",
    iconKey: "siren",
    accent: "#14a1e6",
    price: 89,
    highlights: [],
  },

  // ── Live Stripe checkout test (hidden) ─────────────────────────────────────
  {
    id: "test-payment",
    slug: "test-payment",
    name: "Test Payment (£1)",
    shortName: "Test Payment",
    tagline: "Live Stripe payment test — £1",
    description:
      "A £1 item used only to verify the live Stripe checkout end to end. Not a real service.",
    unit: "one-off",
    badge: "Test only",
    iconKey: "plug",
    accent: "#14a1e6",
    price: 1,
    hidden: true,
    highlights: [],
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

/** The "From £X" figure for a service card. */
export function priceFrom(productId: string): number | undefined {
  const p = findProduct(productId);
  if (!p) return undefined;
  if (p.variants && p.variants.length) {
    return Math.min(...p.variants.map((v) => v.price));
  }
  return p.price;
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
