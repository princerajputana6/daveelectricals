export type Product = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  /** Price in pounds */
  price: number;
  unit: string;
  badge?: string;
  highlights: string[];
  iconKey: "test" | "shield";
  accent: string;
};

export const products: Product[] = [
  {
    id: "pat-testing-pkg",
    slug: "pat-testing",
    name: "PAT Testing — up to 25 appliances",
    shortName: "PAT Testing",
    tagline: "Portable Appliance Testing made simple",
    description:
      "A full PAT testing visit covering up to 25 portable appliances. Includes an itemised report, legal compliance certificate, and minor repairs free of charge. Trusted by start-ups to large brands across West London.",
    price: 75,
    unit: "per visit",
    badge: "Most popular",
    highlights: [
      "Up to 25 appliances tested in one visit",
      "Itemised report & legal certificate",
      "Minor repairs included free",
      "Same-day & out-of-hours options",
    ],
    iconKey: "test",
    accent: "#ffd400",
  },
  {
    id: "eicr-landlord",
    slug: "eicr-landlord-safety",
    name: "Landlord Electrical Safety Certificate (EICR)",
    shortName: "Landlord EICR",
    tagline: "Required by law for every let property",
    description:
      "Full Electrical Installation Condition Report for a single residential property. Covers consumer unit, circuits, sockets and fixed wiring — issued by a fully NAPIT-registered electrician with photographic evidence. Discounted rates for bulk EICRs.",
    price: 99,
    unit: "per property",
    badge: "Bulk discount available",
    highlights: [
      "Compliant with Landlord Electrical Safety Standards",
      "Photographic evidence included",
      "Issued by NAPIT registered engineer",
      "Bulk pricing for portfolios",
    ],
    iconKey: "shield",
    accent: "#ffd400",
  },
];

export function findProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
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
