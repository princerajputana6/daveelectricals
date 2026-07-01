export const company = {
  name: "Dave Electrical Services",
  legalName: "Dave Electrical Services Limited",
  phonePrimary: "02035244041",
  email: "info@daveelectrical.co.uk",
  address: "7 Nursery Gardens, Hounslow, London TW4 5EY",
  napit: "NAPIT Registered — 30178",
  certificate: "NAP/30178/18/1",
  whatsapp: "442035244041",
  yearsExperience: 10,
  social: {
    linkedin: "https://www.linkedin.com/company/daveelectricalservices/",
    instagram: "https://www.instagram.com/daveelectricalservices/",
  },
};

export const nav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Our Reach", href: "/our-reach" },
  { label: "Contact", href: "/contact" },
];

export const stats = [
  { value: 10, suffix: "+", label: "Years of experience" },
  { value: 24, suffix: "/7", label: "Emergency call-outs" },
  { value: 5000, suffix: "+", label: "Projects completed" },
  { value: 12, suffix: "mo", label: "Workmanship guarantee" },
];

export type SectorEntry = { name: string; icon: string };
export const sectors: SectorEntry[] = [
  { name: "Residential", icon: "house" },
  { name: "Restaurants & Hospitality", icon: "restaurant" },
  { name: "Retail", icon: "shop" },
  { name: "Manufacturing", icon: "factory" },
  { name: "Schools & Education", icon: "school" },
  { name: "Healthcare (GPs)", icon: "hospital" },
  { name: "Councils", icon: "council" },
  { name: "Clubs & Pubs", icon: "pub" },
];

export const services = [
  {
    slug: "eicr",
    icon: "shield",
    short_label: "EICR",
    title: "EICR — Electrical Installation Condition Report",
    short: "Periodic inspections, landlord & HMO certificates, full compliance.",
    body:
      "Inspection & Testing is a legal requirement in the UK. Beyond regulation, frequent inspection of your electrical systems is a critical factor in day-to-day health, safety and productivity. At Dave Electrical we assist you in meeting your legal obligations and provide periodic reports for peace of mind — industrial, commercial and domestic testing for insurance, councils, HMOs and the Electricity at Work Regulations.",
    points: [
      "EICR periodic inspection reports",
      "Landlord & HMO certificates",
      "Insurance & council compliance",
      "Photographic evidence included",
    ],
  },
  {
    slug: "eic",
    icon: "plug",
    short_label: "EIC",
    title: "EIC — Electrical Installation Certificate",
    short: "New installation certificates and minor works certification.",
    body:
      "Every new electrical installation, alteration or addition must be certified. Our NAPIT-registered electricians issue full Electrical Installation Certificates (EIC) and Minor Electrical Installation Works Certificates — covering consumer unit replacements, new circuits, rewires and fit-outs, with all necessary Part P building-regulation notifications.",
    points: [
      "New circuit & consumer-unit certificates",
      "Minor works (MEIWC) certification",
      "Part P notification included",
      "Issued by NAPIT registered engineer",
    ],
  },
  {
    slug: "em-lighting",
    icon: "bulb",
    short_label: "EM Lighting",
    title: "Emergency Lighting",
    short: "Design, installation and testing to BS5266 & BS5588 standards.",
    body:
      "Under the Regulatory Reform (Fire Safety) Order 2005 it is mandatory to undertake a written Fire Risk Assessment. We assist in the design and costing of suitable emergency lighting systems so escape routes are illuminated for safe evacuation on power failure. We provide the full testing regime — weekly flick tests, 6-monthly 1hr tests and 3-yearly 3hr tests — with certification of findings.",
    points: [
      "System design & costing",
      "Conforms to BS5266 & BS5588",
      "Weekly / 6-monthly / 3-yearly testing",
      "Fault reporting & certification",
    ],
  },
  {
    slug: "fire-alarm",
    icon: "bell",
    short_label: "Fire Alarm",
    title: "Fire Alarm Testing",
    short: "Compliant fire alarm system inspection and certification.",
    body:
      "Fire alarm testing carried out by qualified engineers. Full system inspection, fault reporting and certification — designed to keep your property safe, your insurance valid and your fire-safety obligations met. From single-zone homes to multi-zone commercial systems.",
    points: [
      "Full system inspection & fault reporting",
      "Compliance certification",
      "Quarterly & annual service plans",
      "Insurance & council approved",
    ],
  },
  {
    slug: "pat",
    icon: "test",
    short_label: "PAT",
    title: "PAT — Portable Appliance Testing",
    short: "Portable Appliance Testing made simple, compliant and hassle-free.",
    body:
      "Every business uses electrical appliances of some kind, making Portable Appliance Testing vital. PAT Testing gives you peace of mind by identifying electrical faults and offering advice to make sure your business avoids dangerous accidents. A record of testing helps with insurance claims and lets you avoid nasty fines. Our accredited engineers perform a thorough service with an itemised report and legal certificate.",
    points: [
      "Trusted by start-ups to large brands",
      "Itemised report & legal certificate",
      "Minor repairs included free",
      "Tested in one easy visit",
    ],
  },
  {
    slug: "call-out",
    icon: "clock",
    short_label: "Call Out",
    title: "Electrical Call Out",
    short: "Same-week fault visits — fully insured, NAPIT-registered electrician.",
    body:
      "Quick-response electrical call out — fault finding, light fittings, sockets, switches, consumer-unit issues and more. Same-week scheduling, no call-out gimmicks — just a straightforward visit from a fully insured, NAPIT-registered electrician.",
    points: [
      "Same-week scheduling",
      "Fault finding included",
      "All standard parts covered",
      "Fully insured & registered",
    ],
  },
  {
    slug: "em-call-out",
    icon: "siren",
    short_label: "EM Call Out",
    title: "Emergency Call Out — 24 / 7",
    short: "A fully manned 24/7, 365-days-a-year emergency electrical service.",
    body:
      "With 24 hour electrical emergency call-outs, Dave Electrical proudly offers a full manned response for all electrical services. We are only ever a phone call away from fixing your electrical issue — no matter the time of day or month of the year. From common repairs like light fittings and sockets to commercial properties, air conditioning systems and main supplies, we strive to get the power back up and running.",
    points: [
      "Manned 24 hours, 365 days a year",
      "Fully trained professional electricians",
      "Domestic & commercial response",
      "Same-day arrival across the M25",
    ],
  },
  {
    slug: "ev",
    icon: "ev",
    short_label: "EV Charger",
    title: "EV Charger Installations",
    short: "Domestic & commercial EV charger installation, tailored to your site.",
    body:
      "Dave Electrical has EV charger installation engineers and technicians that are fully trained and qualified to provide the best-quality workmanship and advice. We tailor every installation to meet your needs, budget and site restrictions. All equipment we supply is of the highest quality, and we offer free same-day quotations.",
    points: [
      "Domestic & commercial chargers",
      "OZEV-approved installers",
      "Tailored to your site & budget",
      "Free, same-day quotations",
    ],
  },
  {
    slug: "cctv",
    icon: "camera",
    short_label: "CCTV",
    title: "CCTV Installations",
    short: "Fully trained CCTV engineers — analogue & digital systems.",
    body:
      "Dave Electrical has CCTV installation engineers and technicians who are fully trained and qualified to provide the best-quality workmanship and advice. We tailor every installation to meet your security requirements as well as your budget and business restrictions, and all equipment we supply is of the highest quality. We offer free quotations for analogue and digital CCTV systems and can attend the same day.",
    points: [
      "Fully trained installation engineers",
      "Analogue & digital CCTV systems",
      "Same-day site visits available",
      "Configured & tested on the day",
    ],
  },
];

export const emergencyLightingFaqs = [
  {
    q: "What is Emergency Lighting?",
    a: "Emergency lights are self-contained units that are wired into the mains, but have the benefit of battery backup which enables them to remain illuminated should the mains power fail. The batteries can either be carried within the body of the individual light or accessed by lights via an independent wired circuit. The batteries are kept charged via the mains.",
  },
  {
    q: "What Standards should be observed in Emergency Lighting?",
    a: "These systems should conform to BS5266 and BS5588.",
  },
  {
    q: "Why do I need such lights?",
    a: "Because in the event of a power failure you must ensure your building is evacuated safely and quickly, and the escape routes and emergency exits need to be illuminated to achieve this.",
  },
  {
    q: "Do I need to have these emergency lights maintained?",
    a: "Yes. A Maintenance Contract is available from us and our Engineer will make 4 visits annually to check your systems out.",
  },
  {
    q: "I have people on the premises with special needs — what about the Disability Discrimination Act?",
    a: "Yes you must. It is an issue which should be brought to the attention of our surveyor so that we can advise on alterations necessary. Your Fire Strategy must protect their interests.",
  },
];

export const emergencyLightingRegime = [
  {
    when: "Weekly",
    who: "In-house",
    what:
      "A flick test to make sure the emergency light activates — recorded in the Fire Alarm Log Book.",
  },
  {
    when: "6 Monthly",
    who: "Engineer",
    what:
      "Engineer visit to undertake a 1hr test, report faults and certify findings; quotes for repairs if any.",
  },
  {
    when: "3 Yearly",
    who: "Engineer",
    what:
      "Engineer visit to undertake a 3hr test, report faults and certify findings; quotes for repairs if any.",
  },
];

export const guarantees = [
  {
    title: "Workmanship",
    body: "Our work is covered by a 12 month guarantee against faulty workmanship from the date of completion.",
  },
  {
    title: "Materials",
    body: "Materials supplied by Dave Electrical Services are covered by the relevant manufacturer's warranty.",
  },
  {
    title: "Transparency",
    body: "Where a repair cannot be fully guaranteed, we always discuss this with you before carrying out work.",
  },
];

export const accreditationPoints = [
  "Able to complete all work safely and to legally required standards",
  "Regularly assessed to ensure ongoing competence",
  "Operating to the latest health and safety regulations",
  "Able to issue the compliance certificates required by tenants, insurers and solicitors",
];

export const badges = [
  "Landlord Safety Certified",
  "NAPIT Registered",
  "TrustMark — Government Endorsed",
  "UKAS Accredited Scheme",
  "Competent Person Scheme",
];

/**
 * Optional hero background. Drop an image at /public/hero-bg.jpg or set
 * NEXT_PUBLIC_HERO_BG_URL in your env (Cloudinary, etc.).
 */
export const heroBackground = {
  src:
    process.env.NEXT_PUBLIC_HERO_BG_URL ||
    "/hero-bg.jpg",
};

export const heroHighlight = {
  eyebrow: "We are specialists in",
  title: "Landlord Electrical Safety Certificates",
  subtitle: "Discounted rates for bulk EICRs",
};

export type Accreditation = {
  /** Brand / scheme name — used for the image alt text */
  name: string;
  /** Logo image living in /public/accreditations/ */
  src: string;
};

/**
 * Individual accreditation / certification logos shown as a scrolling strip
 * on the home and services pages. Drop each logo (transparent PNG or SVG)
 * into /public/accreditations/ using the filenames below.
 */
export const accreditations: Accreditation[] = [
  { name: "NAPIT Registered", src: "/accreditations/napit.jpeg" },
  { name: "UKAS — United Kingdom Accreditation Service", src: "/accreditations/ukas.jpeg" },
  { name: "TrustMark — Government Endorsed Quality", src: "/accreditations/trustmark.jpeg" },
  { name: "EAL Recognised Partner", src: "/accreditations/eal.jpeg" },
  { name: "City & Guilds — Level 3 Qualified", src: "/accreditations/city-and-guilds.jpeg" },
  { name: "FIA — Fire Industry Association", src: "/accreditations/fia.jpeg" },
  { name: "Part P — Electrical Safety Registered Installer", src: "/accreditations/part-p.jpeg" },
  { name: "Registered Competent Person — Electrical", src: "/accreditations/registered-competent-person.jpeg" },
];

export type ClientBrand = {
  name: string;
  /** Optional secondary line shown beneath the name */
  sub?: string;
  /** Background colour of the tile */
  bg: string;
  /** Primary text colour */
  fg: string;
  /** Optional accent colour used for a top bar / highlight */
  accent?: string;
  /** Font treatment */
  font?: "serif" | "sans" | "display" | "mono" | "italic";
  /** Single-letter or short monogram drawn into a coloured chip */
  monogram?: string;
  monoBg?: string;
  monoFg?: string;
  /** Letter-spacing class for the name */
  spacing?: "tight" | "wide" | "ultra";
  /** Uppercase, lowercase or normal-case name */
  caseStyle?: "upper" | "lower" | "normal";
};

export const realClients: ClientBrand[] = [
  {
    name: "Ministry of Sound",
    sub: "Music Venue · London",
    bg: "#000000",
    fg: "#ffffff",
    accent: "#ffffff",
    font: "serif",
    caseStyle: "upper",
    spacing: "wide",
    monogram: "MoS",
    monoBg: "#ffffff",
    monoFg: "#000000",
  },
  {
    name: "Electric Brixton",
    sub: "Live Events · Brixton",
    bg: "#0a0a0a",
    fg: "#ffffff",
    accent: "#ffd400",
    font: "display",
    caseStyle: "upper",
    spacing: "tight",
    monogram: "⚡",
    monoBg: "#ffd400",
    monoFg: "#0a0a0a",
  },
  {
    name: "Rambert School",
    sub: "Ballet & Contemporary Dance",
    bg: "#ffffff",
    fg: "#111111",
    accent: "#e85a3a",
    font: "display",
    caseStyle: "upper",
    spacing: "tight",
    monogram: "R",
    monoBg: "#e85a3a",
    monoFg: "#ffffff",
  },
  {
    name: "Herbosch-Kiere",
    sub: "Marine Civil Engineering",
    bg: "#ffffff",
    fg: "#111111",
    accent: "#d62828",
    font: "sans",
    caseStyle: "upper",
    spacing: "tight",
    monogram: "HK",
    monoBg: "#d62828",
    monoFg: "#ffffff",
  },
  {
    name: "Gaughan",
    sub: "Building & Property Services",
    bg: "#1f4ea0",
    fg: "#ffffff",
    accent: "#ffd400",
    font: "sans",
    caseStyle: "normal",
    monogram: "G",
    monoBg: "#ffffff",
    monoFg: "#1f4ea0",
  },
  {
    name: "The Drury Club",
    sub: "Private Members · Soho",
    bg: "#0a0a0a",
    fg: "#ff3868",
    accent: "#ff3868",
    font: "italic",
    caseStyle: "upper",
    spacing: "wide",
    monogram: "DC",
    monoBg: "#ff3868",
    monoFg: "#0a0a0a",
  },
  {
    name: "Concept Eight",
    sub: "Architecture & Design",
    bg: "#ffffff",
    fg: "#111111",
    accent: "#c9b07a",
    font: "sans",
    caseStyle: "upper",
    spacing: "ultra",
    monogram: "C8",
    monoBg: "#111111",
    monoFg: "#ffffff",
  },
  {
    name: "Bhakti Yoga Institute",
    sub: "Wellness · Twickenham",
    bg: "#ffffff",
    fg: "#111111",
    accent: "#ec6cb9",
    font: "serif",
    caseStyle: "normal",
    monogram: "B",
    monoBg: "#ec6cb9",
    monoFg: "#ffffff",
  },
  {
    name: "Safe2",
    sub: "Compliance Platform",
    bg: "#ffffff",
    fg: "#0e7c66",
    accent: "#0e7c66",
    font: "sans",
    caseStyle: "normal",
    monogram: "S2",
    monoBg: "#0e7c66",
    monoFg: "#ffffff",
  },
  {
    name: "Thorgills",
    sub: "Estate Agents",
    bg: "#7a1717",
    fg: "#ffffff",
    accent: "#ffd400",
    font: "serif",
    caseStyle: "normal",
    monogram: "T",
    monoBg: "#ffd400",
    monoFg: "#7a1717",
  },
  {
    name: "Cheeky Burger",
    sub: "Restaurant",
    bg: "#cc1f1f",
    fg: "#ffffff",
    accent: "#ffd400",
    font: "display",
    caseStyle: "upper",
    spacing: "tight",
    monogram: "🍔",
    monoBg: "#ffffff",
    monoFg: "#cc1f1f",
  },
  {
    name: "SOS On The Spot",
    sub: "Sportswear Repair",
    bg: "#ffffff",
    fg: "#1455c5",
    accent: "#e60023",
    font: "sans",
    caseStyle: "upper",
    spacing: "tight",
    monogram: "SOS",
    monoBg: "#e60023",
    monoFg: "#ffffff",
  },
  {
    name: "Lon Dain GAA 1896",
    sub: "Gaelic Athletic Club",
    bg: "#ffffff",
    fg: "#c54a1a",
    accent: "#c54a1a",
    font: "serif",
    caseStyle: "upper",
    spacing: "tight",
    monogram: "GAA",
    monoBg: "#c54a1a",
    monoFg: "#ffffff",
  },
  {
    name: "W Chartered Accountants",
    sub: "Financial Services",
    bg: "#ffffff",
    fg: "#111111",
    accent: "#3c8db6",
    font: "sans",
    caseStyle: "normal",
    monogram: "W",
    monoBg: "#3c8db6",
    monoFg: "#ffffff",
  },
  {
    name: "Light Forms",
    sub: "Architectural Lighting",
    bg: "#ffffff",
    fg: "#111111",
    accent: "#c0a060",
    font: "serif",
    caseStyle: "upper",
    spacing: "ultra",
    monogram: "LF",
    monoBg: "#111111",
    monoFg: "#ffffff",
  },
  {
    name: "Thames Skin Clinic",
    sub: "Medical Aesthetics",
    bg: "#43586d",
    fg: "#ffffff",
    accent: "#ffffff",
    font: "serif",
    caseStyle: "upper",
    spacing: "ultra",
    monogram: "T",
    monoBg: "#ffffff",
    monoFg: "#43586d",
  },
  {
    name: "Barnard Marcus",
    sub: "Estate & Letting Agents",
    bg: "#ffffff",
    fg: "#111111",
    accent: "#ec1c8a",
    font: "sans",
    caseStyle: "lower",
    monogram: "BM",
    monoBg: "#ec1c8a",
    monoFg: "#ffffff",
  },
  {
    name: "Smart Heating",
    sub: "Maintenance Services",
    bg: "#ffffff",
    fg: "#0a3e6e",
    accent: "#d4145a",
    font: "sans",
    caseStyle: "lower",
    monogram: "SH",
    monoBg: "#0a3e6e",
    monoFg: "#ffffff",
  },
  {
    name: "99 Home",
    sub: "Online Estate Agent",
    bg: "#ffffff",
    fg: "#111111",
    accent: "#ffd400",
    font: "sans",
    caseStyle: "upper",
    monogram: "99",
    monoBg: "#ffd400",
    monoFg: "#111111",
  },
  {
    name: "Hyatt Place",
    sub: "Hotels & Hospitality",
    bg: "#ffffff",
    fg: "#111111",
    accent: "#1ea798",
    font: "sans",
    caseStyle: "upper",
    spacing: "wide",
    monogram: "H",
    monoBg: "#111111",
    monoFg: "#ffffff",
  },
  {
    name: "CRM Students",
    sub: "Student Accommodation",
    bg: "#ffffff",
    fg: "#5a5a5a",
    accent: "#e8743a",
    font: "sans",
    caseStyle: "upper",
    spacing: "wide",
    monogram: "CRM",
    monoBg: "#e8743a",
    monoFg: "#ffffff",
  },
  {
    name: "The Y",
    sub: "Hospitality",
    bg: "#ffffff",
    fg: "#5a5a5a",
    accent: "#9a9a9a",
    font: "serif",
    caseStyle: "normal",
    monogram: "Y",
    monoBg: "#5a5a5a",
    monoFg: "#ffffff",
  },
  {
    name: "ViBe Student Living",
    sub: "Student Accommodation",
    bg: "#f0a040",
    fg: "#ffffff",
    accent: "#ffffff",
    font: "sans",
    caseStyle: "normal",
    monogram: "ViBe",
    monoBg: "#ffffff",
    monoFg: "#f0a040",
  },
  {
    name: "Bingham Riverhouse",
    sub: "Boutique Hotel · Richmond",
    bg: "#324b56",
    fg: "#ffffff",
    accent: "#c9b07a",
    font: "italic",
    caseStyle: "normal",
    spacing: "wide",
    monogram: "BR",
    monoBg: "#c9b07a",
    monoFg: "#324b56",
  },
];

export const clientSectors = [
  { name: "Riverside Bar & Lounge", sector: "Hospitality" },
  { name: "Hounslow Council", sector: "Public Sector" },
  { name: "Crown & Anchor Pub", sector: "Clubs & Pubs" },
  { name: "Spice Route Restaurant", sector: "Restaurants" },
  { name: "Twickenham Primary", sector: "Education" },
  { name: "Feltham Retail Park", sector: "Retail" },
  { name: "Cranford GP Surgery", sector: "Healthcare" },
  { name: "Westfield Manufacturing", sector: "Industrial" },
  { name: "The Grand Banqueting", sector: "Events" },
  { name: "Heston Fitness Club", sector: "Leisure" },
  { name: "Bath Road Motors", sector: "Automotive" },
  { name: "Osterley Care Home", sector: "Healthcare" },
  { name: "Isleworth Pharmacy", sector: "Retail" },
  { name: "Whitton Sports Club", sector: "Leisure" },
  { name: "Hatton Cross Logistics", sector: "Industrial" },
  { name: "The Bell Tavern", sector: "Clubs & Pubs" },
  { name: "Norwood Academy", sector: "Education" },
  { name: "Brentford Bistro", sector: "Restaurants" },
  { name: "Lampton Estates", sector: "Residential" },
  { name: "Great West Offices", sector: "Commercial" },
  { name: "Hanworth Community Hall", sector: "Public Sector" },
  { name: "Syon Park Catering", sector: "Hospitality" },
  { name: "Chiswick Dental", sector: "Healthcare" },
  { name: "TW Property Group", sector: "Residential" },
];

export const testimonials = [
  {
    quote:
      "Dave Electrical sorted our restaurant rewire over a weekend with zero disruption to service. Professional, tidy and properly certified.",
    author: "Operations Manager",
    role: "Hospitality client",
  },
  {
    quote:
      "We needed a landlord certificate in a hurry — they turned it around fast and the paperwork was spotless. Highly recommended.",
    author: "Private Landlord",
    role: "Residential client",
  },
  {
    quote:
      "Their 24 hour call-out got our manufacturing line back up at 3am. Reliable, trustworthy and genuinely there when it matters.",
    author: "Facilities Lead",
    role: "Industrial client",
  },
];
