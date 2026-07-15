/**
 * Insurance service catalog.
 *
 * Reference data sourced from citizenimf.com (Citizen IMF — an IRDA-licensed
 * insurance brokerage). Categories and insurer partners are defined here as
 * static config so the whole app has one source of truth.
 */

export type CategorySlug =
  | "life"
  | "health"
  | "car"
  | "two-wheeler"
  | "travel"
  | "personal-accident"
  | "home"
  | "shop"
  | "marine";

export interface Insurer {
  slug: string;
  name: string;
}

export interface ServiceCategory {
  slug: CategorySlug;
  name: string;
  tagline: string;
  icon: string; // emoji used in the UI cards
  insurers: Insurer[];
}

const insurer = (name: string): Insurer => ({
  slug: name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, ""),
  name,
});

export const CATEGORIES: ServiceCategory[] = [
  {
    slug: "life",
    name: "Life Insurance",
    tagline: "Secure your family's financial future",
    icon: "🛡️",
    insurers: [
      insurer("LIC of India"),
      insurer("Max Life Insurance"),
      insurer("Bajaj Allianz Life"),
      insurer("Tata AIA Life"),
      insurer("ICICI Prudential Life"),
      insurer("PNB MetLife"),
    ],
  },
  {
    slug: "health",
    name: "Health Insurance",
    tagline: "Affordable cover for you and your family",
    icon: "🏥",
    insurers: [
      insurer("Care Health Insurance"),
      insurer("Niva Bupa"),
      insurer("Star Health"),
      insurer("ICICI Lombard"),
      insurer("Bajaj Allianz General"),
      insurer("National Insurance"),
    ],
  },
  {
    slug: "car",
    name: "Car Insurance",
    tagline: "Comprehensive 4-wheeler protection",
    icon: "🚗",
    insurers: [
      insurer("ICICI Lombard"),
      insurer("Bajaj Allianz General"),
      insurer("Tata AIG"),
      insurer("National Insurance"),
    ],
  },
  {
    slug: "two-wheeler",
    name: "Two-Wheeler Insurance",
    tagline: "Ride worry-free with the right cover",
    icon: "🏍️",
    insurers: [
      insurer("ICICI Lombard"),
      insurer("Bajaj Allianz General"),
      insurer("Tata AIG"),
      insurer("National Insurance"),
    ],
  },
  {
    slug: "travel",
    name: "Travel Insurance",
    tagline: "Stay covered anywhere in the world",
    icon: "✈️",
    insurers: [
      insurer("Tata AIG"),
      insurer("Bajaj Allianz General"),
      insurer("ICICI Lombard"),
    ],
  },
  {
    slug: "personal-accident",
    name: "Personal Accident",
    tagline: "Income protection against accidents",
    icon: "🩹",
    insurers: [
      insurer("Care Health Insurance"),
      insurer("Bajaj Allianz General"),
      insurer("National Insurance"),
    ],
  },
  {
    slug: "home",
    name: "Home Insurance",
    tagline: "Protect your home and belongings",
    icon: "🏠",
    insurers: [
      insurer("Bajaj Allianz General"),
      insurer("ICICI Lombard"),
      insurer("National Insurance"),
    ],
  },
  {
    slug: "shop",
    name: "Shop Insurance",
    tagline: "Cover for your shop and stock",
    icon: "🏪",
    insurers: [
      insurer("National Insurance"),
      insurer("Bajaj Allianz General"),
    ],
  },
  {
    slug: "marine",
    name: "Marine Cargo",
    tagline: "Protection for goods in transit",
    icon: "🚢",
    insurers: [
      insurer("National Insurance"),
      insurer("ICICI Lombard"),
    ],
  },
];

/** Insurer logo files (in /public/partners). Keyed by insurer slug. */
export const PARTNER_LOGOS: Record<string, string> = {
  "lic-of-india": "/partners/lic.jpg",
  "max-life-insurance": "/partners/max-life.jpg",
  "bajaj-allianz-life": "/partners/bajaj.jpg",
  "bajaj-allianz-general": "/partners/bajaj.jpg",
  "tata-aia-life": "/partners/tata.jpg",
  "tata-aig": "/partners/tata.jpg",
  "icici-prudential-life": "/partners/icic.jpg",
  "icici-lombard": "/partners/icic.jpg",
  "pnb-metlife": "/partners/pnb.png",
  "care-health-insurance": "/partners/care.jpg",
  "niva-bupa": "/partners/niva.jpg",
  "national-insurance": "/partners/national.jpg",
};

export function insurerLogo(slug: string): string | null {
  return PARTNER_LOGOS[slug] ?? null;
}

/** Distinct partner logos for "trusted by" strips. */
export const FEATURED_PARTNER_LOGOS: { name: string; src: string }[] = [
  { name: "LIC", src: "/partners/lic.jpg" },
  { name: "Max Life", src: "/partners/max-life.jpg" },
  { name: "Bajaj Allianz", src: "/partners/bajaj.jpg" },
  { name: "Tata AIA / AIG", src: "/partners/tata.jpg" },
  { name: "ICICI", src: "/partners/icic.jpg" },
  { name: "PNB MetLife", src: "/partners/pnb.png" },
  { name: "Care Health", src: "/partners/care.jpg" },
  { name: "Niva Bupa", src: "/partners/niva.jpg" },
  { name: "National", src: "/partners/national.jpg" },
];

export function getCategory(slug: string): ServiceCategory | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getInsurer(
  categorySlug: string,
  insurerSlug: string
): { category: ServiceCategory; insurer: Insurer } | undefined {
  const category = getCategory(categorySlug);
  if (!category) return undefined;
  const found = category.insurers.find((i) => i.slug === insurerSlug);
  if (!found) return undefined;
  return { category, insurer: found };
}

export function categoryName(slug: string): string {
  return getCategory(slug)?.name ?? slug;
}
