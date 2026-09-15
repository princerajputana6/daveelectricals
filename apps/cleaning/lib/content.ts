import { withBase } from "@/lib/basePath";

export const company = {
  name: "Dave Cleaning Services",
  legalName: "Dave Cleaning Services",
  phonePrimary: "02035244041",
  // NOTE: placeholder — per brief, use a dedicated cleaning email only once the
  // new address/domain is confirmed. Do NOT reuse the electrical email.
  email: "hello@davecleaning.co.uk",
  address: "7 Nursery Gardens, Hounslow, London TW4 5EY",
  // Re-used display keys (kept so the shared components render):
  napit: "Fully Insured & Vetted",
  certificate: "Satisfaction Guaranteed",
  whatsapp: "442035244041",
  yearsExperience: 10,
  /** Link across to the sister electrical company. */
  sisterSite: {
    name: "Dave Electrical Services",
    url: process.env.NEXT_PUBLIC_SISTER_URL || "https://www.daveelectrical.co.uk",
  },
  social: {
    linkedin: "https://www.linkedin.com/company/daveelectricalservices/",
    instagram: "https://www.instagram.com/daveelectricalservices/",
  },
};

export const nav = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Landlords", href: "/landlords" },
  { label: "Areas", href: "/our-reach" },
  { label: "Contact", href: "/contact" },
];

export const stats = [
  { value: 4, suffix: ".9★", label: "Average customer rating" },
  { value: 500, suffix: "+", label: "Properties cleaned" },
  { value: 7, suffix: "/7", label: "Flexible scheduling" },
  { value: 100, suffix: "%", label: "Satisfaction focused" },
];

export type SectorEntry = { name: string; icon: string };
export const sectors: SectorEntry[] = [
  { name: "Residential Homes", icon: "house" },
  { name: "Landlords & Estate Agents", icon: "council" },
  { name: "Offices", icon: "building" },
  { name: "Restaurants & Hospitality", icon: "restaurant" },
  { name: "Retail", icon: "shop" },
  { name: "Residential Blocks", icon: "building" },
  { name: "Schools", icon: "school" },
  { name: "Air BnB", icon: "house" },
];

export const services = [
  {
    slug: "regular-cleaning",
    icon: "sparkle",
    short_label: "Regular",
    title: "Regular Cleaning",
    short: "Keep your home consistently clean, fresh, and comfortable.",
    body:
      "Keep your home consistently clean, fresh and comfortable with a regular cleaning visit arranged around your schedule. Weekly or fortnightly, our team handles the everyday upkeep so you don't have to — with the same reliable, professional standard every time.",
    points: [
      "Dusting accessible surfaces",
      "Vacuuming & mopping hard floors",
      "Kitchen surface cleaning",
      "Bathroom cleaning",
      "Bins emptied & general tidying",
    ],
  },
  {
    slug: "one-off-cleaning",
    icon: "clock",
    short_label: "One-Off",
    title: "One-Off Cleaning",
    short: "Professional cleaning whenever you need an extra helping hand.",
    body:
      "Professional cleaning whenever you need an extra helping hand — no ongoing commitment. Ideal before or after guests, for seasonal refreshes, moving preparation or simply when life gets busy.",
    points: [
      "Occasional cleaning",
      "Before or after guests",
      "Seasonal cleaning",
      "Moving preparation",
      "General home refresh",
    ],
  },
  {
    slug: "deep-cleaning",
    icon: "spray",
    short_label: "Deep",
    title: "Deep Cleaning",
    short: "A more intensive clean for areas that need extra attention.",
    body:
      "A more intensive, top-to-bottom clean for areas that need extra attention. We tackle built-up dirt and grime, detailed kitchen and bathroom cleaning, doors, frames and the hard-to-reach spots a regular clean doesn't cover.",
    points: [
      "Built-up dirt and grime",
      "Detailed kitchen cleaning",
      "Detailed bathroom cleaning",
      "Doors, frames & hard-to-reach areas",
      "Thorough vacuuming and mopping",
    ],
  },
  {
    slug: "end-of-tenancy",
    icon: "clipboard",
    short_label: "End of Tenancy",
    title: "End of Tenancy Cleaning",
    short:
      "A comprehensive property clean for tenants, landlords and estate agents.",
    body:
      "A comprehensive property clean designed for tenants, landlords and estate agents. Perfect for move-outs, new-tenant preparation, property handovers and landlord inspections — helping meet inventory and deposit expectations.",
    points: [
      "Tenant move-outs",
      "New tenant preparation",
      "Property handovers",
      "Landlord inspections",
      "Estate-agent managed properties",
    ],
  },
  {
    slug: "after-builders",
    icon: "building",
    short_label: "After Builders",
    title: "After Builders Cleaning",
    short:
      "Professional cleaning after renovation, refurbishment or building work.",
    body:
      "Professional cleaning after renovation, refurbishment or building work. We remove dust and residue, clean every surface and floor, and present the property ready to use, move into or hand over.",
    points: [
      "Dust & residue removal",
      "Surface cleaning",
      "Floor cleaning",
      "Kitchen and bathroom cleaning",
      "Final property presentation",
    ],
  },
  {
    slug: "carpet-upholstery",
    icon: "broom",
    short_label: "Carpet & Upholstery",
    title: "Carpet & Upholstery Cleaning",
    short:
      "Restore carpets, rugs and upholstered furniture with professional cleaning.",
    body:
      "Restore carpets, rugs and upholstered furniture with professional cleaning that lifts dirt and refreshes fibres. Available on request — ask us to confirm availability for your property.",
    points: ["Carpets", "Sofas & chairs", "Rugs", "Upholstered furniture"],
  },
  {
    slug: "commercial-cleaning",
    icon: "shield",
    short_label: "Commercial",
    title: "Commercial Cleaning",
    short: "Reliable cleaning for businesses and managed properties.",
    body:
      "Reliable cleaning for businesses and managed properties — from offices and retail premises to restaurants, communal areas and residential blocks. Priced following a short assessment of your requirements.",
    points: [
      "Offices & retail premises",
      "Restaurants",
      "Communal areas & residential blocks",
      "Property management companies",
      "Serviced apartments",
    ],
  },
];

/** Section 5 — Why Choose DAVE Cleaning Services? */
export const whyChoose = [
  {
    title: "Reliable Appointments",
    body: "Cleaning arranged around your schedule, and a team that turns up when we say we will.",
  },
  {
    title: "Professional Service",
    body: "A professional approach from your first enquiry all the way through to completion.",
  },
  {
    title: "Attention to Detail",
    body: "Careful, thorough cleaning throughout your property — not just the obvious surfaces.",
  },
  {
    title: "Domestic & Commercial",
    body: "Solutions for homes, landlords and businesses of every size.",
  },
  {
    title: "Responsive Admin Team",
    body: "Clear communication and straightforward booking, with a real person to help.",
  },
  {
    title: "Flexible Cleaning Options",
    body: "One-off, regular and specialist cleaning available to suit your needs.",
  },
];

/** Section 6 — How It Works */
export const howItWorks = [
  {
    title: "Tell Us What You Need",
    body: "Let us know your property, postcode and cleaning requirements.",
  },
  {
    title: "Receive Your Quote",
    body: "We provide a clear quotation based on the work required.",
  },
  {
    title: "Confirm Your Booking",
    body: "Choose an available date and time that works for you.",
  },
  {
    title: "We Get Cleaning",
    body: "Our team attends and carries out the agreed cleaning service.",
  },
];

/** Section 8 — What's Included */
export const whatsIncluded = [
  {
    area: "Kitchen",
    body: "Worktops and accessible surfaces, sink and taps, hob, appliance exteriors, cupboard exteriors, bins and floors.",
  },
  {
    area: "Bathroom",
    body: "Toilet, bath or shower, sink and taps, mirrors, fixtures, surfaces and floors.",
  },
  {
    area: "Bedrooms",
    body: "Accessible surfaces, mirrors, bins, vacuuming and floor cleaning.",
  },
  {
    area: "Living Areas",
    body: "Dusting accessible surfaces, vacuuming, hard-floor cleaning and general tidying.",
  },
];

export const whatsIncludedExtras =
  "Optional extras can include inside ovens, inside fridges, inside windows, or carpet cleaning where those services are available.";

/** Section 7 — Landlords & Estate Agents */
export const landlords = {
  heading: "Property Cleaning Without the Hassle",
  intro:
    "Managing multiple properties can mean constantly coordinating tenants, cleaners and contractors. Dave Cleaning Services can make the process easier by helping coordinate bookings directly with tenants where required.",
  points: [
    "End of tenancy cleaning",
    "Move-in cleaning",
    "Deep cleaning",
    "Communal-area cleaning",
    "Regular managed-property cleaning",
    "Before-and-after photographs",
    "Multiple-property bookings",
  ],
  ctaHeading: "Managing Several Properties?",
  ctaBody: "Contact us to discuss ongoing cleaning support for your portfolio.",
};

/** Section 11 — Frequently Asked Questions */
export const faqs = [
  {
    q: "Do you bring all the equipment and supplies?",
    a: "Yes. Our Hounslow & Feltham team is fully equipped. You only need to provide access, water and power.",
  },
  {
    q: "How long does an end of tenancy clean take?",
    a: "It depends on the size and condition. As a guide, 2-bed flats take ~4–6 hours for a 2–3 person team. We quote by property, not by the hour.",
  },
  {
    q: "Is carpet cleaning included?",
    a: "Deep carpet cleaning is an optional add-on. Many tenants include it to meet inventory / landlord expectations.",
  },
  {
    q: "What if my landlord/agent requests a re-visit?",
    a: "Contact us within 7 days with your checkout notes and we'll arrange a targeted re-clean where needed (policy applies).",
  },
  {
    q: "Do you dismantle or repair appliances?",
    a: "No. We do not dismantle or reassemble appliances or perform repair-type work. We clean surfaces and accessible parts thoroughly.",
  },
];

/** Section 15 — Pricing (starting / guide prices). */
export type PriceRow = {
  size: string;
  regular: string;
  oneOff: string;
  deep: string;
  endOfTenancy: string;
  afterBuilders: string;
};
export const pricingRows: PriceRow[] = [
  { size: "Studio", regular: "From £40", oneOff: "From £60", deep: "From £110", endOfTenancy: "From £150", afterBuilders: "From £140" },
  { size: "1 Bedroom", regular: "From £50", oneOff: "From £75", deep: "From £140", endOfTenancy: "From £180", afterBuilders: "From £170" },
  { size: "2 Bedrooms", regular: "From £60", oneOff: "From £100", deep: "From £180", endOfTenancy: "From £230", afterBuilders: "From £220" },
  { size: "3 Bedrooms", regular: "From £80", oneOff: "From £130", deep: "From £230", endOfTenancy: "From £290", afterBuilders: "From £280" },
  { size: "4 Bedrooms", regular: "From £100", oneOff: "From £165", deep: "From £290", endOfTenancy: "From £360", afterBuilders: "From £350" },
  { size: "5 Bedrooms", regular: "From £120", oneOff: "From £200", deep: "From £350", endOfTenancy: "From £430", afterBuilders: "From £420" },
  { size: "6+ Bedrooms", regular: "Get a Quote", oneOff: "Get a Quote", deep: "Get a Quote", endOfTenancy: "Get a Quote", afterBuilders: "Get a Quote" },
];

export const pricingNotes = [
  {
    title: "Regular Cleaning",
    body: "Weekly cleaning from £20/hour and fortnightly cleaning from £21/hour, with a minimum 2-hour booking.",
  },
  {
    title: "Carpet & Upholstery Cleaning",
    body: "Carpet cleaning from £30 per room. Sofa cleaning from £45, armchairs from £25, dining chairs from £10 each, and mattress cleaning from £25. Whole-property carpet cleaning available on request.",
  },
  {
    title: "Commercial Cleaning",
    body: "Regular office and commercial cleaning from £22/hour, one-off commercial cleaning from £25/hour, and commercial deep cleaning from £30/hour. Larger offices, retail premises, communal areas and managed properties are priced following an assessment.",
  },
];

export const pricingImportantNote =
  "Prices shown are guide prices only. The final price will depend on the property size, number of bathrooms, condition of the property, level of cleaning required, and any additional services requested. Parking and congestion charges may apply where applicable.";

export const areasCoverText =
  "We cover London and the surrounding areas within the M25 — and beyond. Wherever your property sits across the capital, our team can help with domestic, commercial and property cleaning.";

/** Points shown in the "Why choose us" list on the home page. */
export const accreditationPoints = [
  "A professional, vetted and fully insured cleaning team",
  "Reliable appointments arranged around your schedule",
  "Clear, upfront quotes with no hidden charges",
  "Domestic, commercial and end-of-tenancy specialists",
];

export const badges = [
  "Fully Insured",
  "Vetted & Trusted Cleaners",
  "Satisfaction Guaranteed",
  "Domestic & Commercial",
  "Flexible Appointments",
];

export const guarantees: {
  title: string;
  body: string;
  points?: string[];
}[] = [
  {
    title: "Satisfaction",
    body: "If something isn't right, tell us within 7 days and we'll arrange a targeted re-clean where needed (policy applies).",
  },
  {
    title: "Fully Insured",
    body: "Our cleaning is carried out by a vetted, fully insured team for complete peace of mind.",
  },
  {
    title: "Transparency",
    body: "We believe in complete transparency on every job, every step of the way.",
    points: [
      "Clear communication throughout every booking.",
      "Guide pricing up front, with a firm quote before we start.",
      "No hidden costs — just honest, straightforward pricing.",
      "Before-and-after photographs available on request.",
    ],
  },
];

/**
 * Optional hero background. Drop an image at /public/hero-bg.jpg or set
 * NEXT_PUBLIC_HERO_BG_URL in your env (Cloudinary, etc.).
 */
export const heroBackground = {
  src: process.env.NEXT_PUBLIC_HERO_BG_URL || withBase("/hero-bg.jpg"),
};

export const heroHighlight = {
  eyebrow: "We are specialists in",
  title: "End of Tenancy & Deep Cleaning",
  subtitle: "Trusted by landlords and estate agents",
};

export type Accreditation = {
  name: string;
  src: string;
};

/** Kept for the shared component; not shown on the cleaning site by default. */
export const accreditations: Accreditation[] = [
  { name: "Fully Insured", src: withBase("/logo.jpeg") },
];

export type ClientBrand = {
  name: string;
  sub?: string;
  bg: string;
  fg: string;
  accent?: string;
  font?: "serif" | "sans" | "display" | "mono" | "italic";
  monogram?: string;
  monoBg?: string;
  monoFg?: string;
  spacing?: "tight" | "wide" | "ultra";
  caseStyle?: "upper" | "lower" | "normal";
};

/** Kept for the shared marquee component; not shown by default. */
export const realClients: ClientBrand[] = [
  { name: "Riverside Lettings", sub: "Estate Agents", bg: "#ffffff", fg: "#135ca6", accent: "#1877d1", font: "sans", caseStyle: "upper", monogram: "RL", monoBg: "#1877d1", monoFg: "#ffffff" },
  { name: "Hounslow Homes", sub: "Property Management", bg: "#1877d1", fg: "#ffffff", accent: "#ffffff", font: "display", caseStyle: "upper", monogram: "HH", monoBg: "#ffffff", monoFg: "#1877d1" },
];

export const clientSectors = [
  { name: "Riverside Lettings", sector: "Estate Agents" },
  { name: "Hounslow Homes", sector: "Property Management" },
  { name: "Feltham Serviced Apartments", sector: "Air BnB" },
  { name: "Twickenham Offices", sector: "Commercial" },
];

/**
 * Google Reviews section. Replace `url`, `rating`, `count` and the `reviews`
 * list with the client's real Google Business Profile details.
 */
export const googleReviews = {
  url:
    process.env.NEXT_PUBLIC_GOOGLE_REVIEWS_URL ||
    "https://www.google.com/maps/search/Dave+Cleaning+Services",
  rating: 4.9,
  count: 120,
  reviews: [
    {
      name: "Rebecca Turner",
      when: "2 weeks ago",
      stars: 5,
      avatarBg: "#1a73e8",
      text: "Booked an end of tenancy clean at short notice. The flat looked spotless and we got our full deposit back. Friendly, thorough and great value.",
    },
    {
      name: "Amir Hussain",
      when: "1 month ago",
      stars: 5,
      avatarBg: "#0f9d58",
      text: "We use Dave Cleaning for our office every week. Reliable, tidy and the admin team is really easy to deal with. Highly recommended.",
    },
    {
      name: "Sophie Clarke",
      when: "1 month ago",
      stars: 5,
      avatarBg: "#db4437",
      text: "Deep clean before moving in — kitchen and bathrooms came up like new. Turned up on time and worked really hard. Will use again.",
    },
    {
      name: "Daniel Wright",
      when: "2 months ago",
      stars: 5,
      avatarBg: "#f4b400",
      text: "As a landlord with several properties, their coordination with tenants is brilliant. Before-and-after photos every time. Genuinely hassle-free.",
    },
    {
      name: "Maria Gonzalez",
      when: "3 months ago",
      stars: 5,
      avatarBg: "#8e24aa",
      text: "After-builders clean following our renovation. They removed all the dust and residue and left the house ready to enjoy. Superb job.",
    },
  ],
};

export const testimonials = [
  {
    quote:
      "The end of tenancy clean was faultless — the agent signed off the property with no issues at all and we got our deposit back in full.",
    author: "Private Tenant",
    role: "Residential client",
  },
  {
    quote:
      "Reliable weekly office cleaning with a team we can trust. Communication is clear and the standard never slips.",
    author: "Office Manager",
    role: "Commercial client",
  },
  {
    quote:
      "They coordinate cleans directly with our tenants across multiple properties. It saves us hours every single week.",
    author: "Lettings Manager",
    role: "Estate agent",
  },
];

// ── Kept exports (unused on the cleaning site, retained so shared components
//    that import them still compile). ────────────────────────────────────────
export const emergencyLightingFaqs = [
  { q: "Placeholder", a: "Not used on the cleaning site." },
];
export const emergencyLightingRegime = [
  { when: "—", who: "—", what: "Not used on the cleaning site." },
];
export const emergencyLightingTestingProcess = [
  { step: "1", title: "—", tag: "—", items: [{ k: "—", v: "Not used." }] },
];
export const emergencyLightingBestPractices = [
  { k: "—", v: "Not used on the cleaning site." },
];
