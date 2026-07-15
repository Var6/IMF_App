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
