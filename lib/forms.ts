/**
 * Per-service policy forms.
 *
 * Each insurance category has its own set of fields (sourced from the
 * citizenimf.com product quote forms). Forms are defined as data here and
 * rendered generically by <DynamicPolicyForm/>. Partner answers are stored in
 * the Policy `details` object keyed by field `name`.
 *
 * Convention: every form includes contact fields named `customerName`,
 * `customerMobile`, and (optionally) `customerEmail` — these get promoted to
 * the top-level Policy applicant fields on submit.
 */

export type FieldType =
  | "text"
  | "tel"
  | "email"
  | "number"
  | "date"
  | "select"
  | "textarea";

export interface FormField {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  full?: boolean; // span both columns
}

export interface FormSection {
  title: string;
  icon?: string;
  fields: FormField[];
}

export interface ServiceForm {
  planTypeLabel?: string;
  sections: FormSection[];
}

const opt = (values: [string, string][]) =>
  values.map(([value, label]) => ({ value, label }));

/** A contact section, with a configurable name-field label. */
function contact(
  nameLabel = "Full Name",
  { email = true, city = true } = {}
): FormSection {
  const fields: FormField[] = [
    { name: "customerName", label: nameLabel, type: "text", required: true, placeholder: nameLabel },
    { name: "customerMobile", label: "Mobile Number", type: "tel", required: true, placeholder: "10-digit mobile" },
  ];
  if (email) fields.push({ name: "customerEmail", label: "Email", type: "email", placeholder: "name@example.com" });
  if (city) fields.push({ name: "customerCity", label: "City", type: "text", placeholder: "City" });
  return { title: "Customer contact details", icon: "👤", fields };
}

const AGE_BANDS = opt([
  ["18-25", "18-25 Years"],
  ["26-35", "26-35 Years"],
  ["36-45", "36-45 Years"],
  ["46-55", "46-55 Years"],
  ["56-65", "56-65 Years"],
  ["65+", "65+ Years"],
]);

const YEARS = (() => {
  const list: [string, string][] = [];
  for (let y = 2026; y >= 2005; y--) list.push([String(y), String(y)]);
  return opt(list);
})();

export const SERVICE_FORMS: Record<string, ServiceForm> = {
  life: {
    sections: [
      {
        title: "Life insurance details",
        icon: "🛡️",
        fields: [
          { name: "planType", label: "Plan Type", type: "select", required: true, options: opt([["term", "Term Life Insurance"], ["ulip", "ULIP (Unit Linked)"], ["endowment", "Endowment Plan"], ["pension", "Pension / Retirement"], ["child", "Child Insurance Plan"], ["whole", "Whole Life Plan"]]) },
          { name: "age", label: "Age", type: "select", required: true, options: AGE_BANDS.slice(0, 5) },
          { name: "gender", label: "Gender", type: "select", required: true, options: opt([["male", "Male"], ["female", "Female"], ["other", "Other"]]) },
          { name: "annualIncome", label: "Annual Income", type: "select", options: opt([["<3", "Under ₹3 Lakhs"], ["3-5", "₹3-5 Lakhs"], ["5-10", "₹5-10 Lakhs"], ["10-25", "₹10-25 Lakhs"], ["25+", "₹25+ Lakhs"]]) },
          { name: "coverage", label: "Coverage Needed (Sum Assured)", type: "select", required: true, options: opt([["10", "₹10 Lakhs"], ["25", "₹25 Lakhs"], ["50", "₹50 Lakhs"], ["100", "₹1 Crore"], ["200", "₹2 Crores"]]) },
          { name: "tobacco", label: "Tobacco / Smoker?", type: "select", options: opt([["no", "No"], ["yes", "Yes"]]) },
          { name: "nomineeName", label: "Nominee Name", type: "text", placeholder: "Nominee full name" },
          { name: "nomineeRelation", label: "Nominee Relationship", type: "text", placeholder: "Spouse / Son / Mother…" },
        ],
      },
      contact("Full Name"),
    ],
  },

  keyman: {
    sections: [
      {
        title: "Keyman insurance details",
        icon: "🔑",
        fields: [
          { name: "companyName", label: "Company Name", type: "text", required: true, placeholder: "Company name" },
          { name: "keymanName", label: "Keyman Name", type: "text", required: true, placeholder: "Key person's name" },
          { name: "designation", label: "Designation", type: "text", placeholder: "e.g. Director / CEO" },
          { name: "annualIncome", label: "Annual Income (₹)", type: "number", placeholder: "Annual income" },
          { name: "coverage", label: "Coverage Amount", type: "select", required: true, options: opt([["50L", "₹50 Lakhs"], ["1C", "₹1 Crore"], ["2C", "₹2 Crores"], ["5C", "₹5 Crores"]]) },
        ],
      },
      contact("Contact Person", { city: false }),
    ],
  },

  health: {
    sections: [
      {
        title: "Health insurance details",
        icon: "🏥",
        fields: [
          { name: "age", label: "Eldest Member Age", type: "select", required: true, options: AGE_BANDS },
          { name: "members", label: "Members to Cover", type: "select", required: true, options: opt([["self", "Self"], ["self-spouse", "Self + Spouse"], ["self-1child", "Self + 1 Child"], ["self-spouse-1child", "Self + Spouse + 1 Child"], ["self-spouse-2child", "Self + Spouse + 2 Children"], ["self-parents", "Self + Parents"]]) },
          { name: "sumInsured", label: "Sum Insured", type: "select", required: true, options: opt([["3", "₹3 Lakhs"], ["5", "₹5 Lakhs"], ["10", "₹10 Lakhs"], ["15", "₹15 Lakhs"], ["25", "₹25 Lakhs"], ["50", "₹50 Lakhs"], ["100", "₹1 Crore"]]) },
        ],
      },
      contact("Full Name"),
    ],
  },

  car: {
    sections: [
      {
        title: "Car insurance details",
        icon: "🚗",
        fields: [
          { name: "registrationNumber", label: "Registration Number", type: "text", required: true, placeholder: "e.g. MH12AB1234" },
          { name: "carModel", label: "Car Make & Model", type: "select", required: true, options: opt([["maruti-swift", "Maruti Swift"], ["hyundai-creta", "Hyundai Creta"], ["tata-nexon", "Tata Nexon"], ["mahindra-xuv700", "Mahindra XUV700"], ["honda-city", "Honda City"], ["toyota-innova", "Toyota Innova"], ["skoda-octavia", "Skoda Octavia"], ["bmw-3-series", "BMW 3 Series"], ["mercedes-c-class", "Mercedes C-Class"], ["other", "Other"]]) },
          { name: "manufacturingYear", label: "Manufacturing Year", type: "select", required: true, options: YEARS },
          { name: "policyType", label: "Policy Type", type: "select", options: opt([["comprehensive", "Comprehensive"], ["third-party", "Third-party"], ["own-damage", "Own Damage"]]) },
        ],
      },
      contact("Full Name"),
    ],
  },

  "two-wheeler": {
    sections: [
      {
        title: "Two-wheeler insurance details",
        icon: "🏍️",
        fields: [
          { name: "registrationNumber", label: "Registration Number", type: "text", required: true, placeholder: "e.g. MH12AB1234" },
          { name: "bikeModel", label: "Bike Make & Model", type: "select", required: true, options: opt([["hero-splendor", "Hero Splendor Plus"], ["honda-activa", "Honda Activa 6G"], ["bajaj-pulsar", "Bajaj Pulsar 150"], ["tvs-jupiter", "TVS Jupiter"], ["yamaha-fz", "Yamaha FZ-S"], ["royal-enfield", "Royal Enfield Classic"], ["ktm-duke", "KTM Duke 200"], ["other", "Other"]]) },
          { name: "manufacturingYear", label: "Manufacturing Year", type: "select", required: true, options: YEARS },
          { name: "policyType", label: "Policy Type", type: "select", options: opt([["comprehensive", "Comprehensive"], ["third-party", "Third-party"], ["own-damage", "Own Damage"]]) },
        ],
      },
      contact("Full Name"),
    ],
  },

  commercial: {
    sections: [
      {
        title: "Commercial vehicle details",
        icon: "🚚",
        fields: [
          { name: "registrationNumber", label: "Registration Number", type: "text", placeholder: "e.g. MH12AB1234" },
          { name: "vehicleType", label: "Vehicle Type", type: "select", required: true, options: opt([["truck", "Truck"], ["tractor", "Tractor"], ["bus", "Bus"], ["taxi", "Taxi"], ["tempo", "Tempo"], ["jcb", "JCB / Construction"], ["other", "Other"]]) },
          { name: "vehicleAge", label: "Vehicle Age", type: "select", required: true, options: opt([["new", "Brand New"], ["0-1", "0-1 Years"], ["1-3", "1-3 Years"], ["3-5", "3-5 Years"], ["5-10", "5-10 Years"], ["10+", "10+ Years"]]) },
          { name: "gvw", label: "Gross Vehicle Weight", type: "select", options: opt([["<3.5", "Less than 3.5 Tons"], ["3.5-7.5", "3.5 - 7.5 Tons"], ["7.5-12", "7.5 - 12 Tons"], ["12-16", "12 - 16 Tons"], ["16+", "Above 16 Tons"]]) },
        ],
      },
      contact("Owner / Company Name"),
    ],
  },

  travel: {
    sections: [
      {
        title: "Travel insurance details",
        icon: "✈️",
        fields: [
          { name: "destination", label: "Destination", type: "select", required: true, options: opt([["domestic", "Domestic (Within India)"], ["asia", "Asia"], ["europe", "Europe"], ["americas", "Americas (USA/Canada)"], ["australia", "Australia / NZ"], ["middle-east", "Middle East"], ["worldwide", "Worldwide"]]) },
          { name: "tripType", label: "Trip Type", type: "select", required: true, options: opt([["leisure", "Leisure / Holiday"], ["business", "Business Travel"], ["study", "Student Travel"], ["adventure", "Adventure / Sports"]]) },
          { name: "tripDuration", label: "Trip Duration", type: "select", required: true, options: opt([["1-7", "1-7 Days"], ["8-15", "8-15 Days"], ["16-30", "16-30 Days"], ["31-90", "1-3 Months"], ["90+", "3+ Months"]]) },
          { name: "travelers", label: "Number of Travelers", type: "select", required: true, options: opt([["1", "1 Person"], ["2", "2 People"], ["3-5", "3-5 People"], ["6+", "6+ People"]]) },
          { name: "ageGroup", label: "Age Group", type: "select", options: opt([["18-30", "18-30 Years"], ["31-50", "31-50 Years"], ["51-65", "51-65 Years"], ["65+", "65+ Years"]]) },
        ],
      },
      contact("Full Name", { city: false }),
    ],
  },

  home: {
    sections: [
      {
        title: "Home insurance details",
        icon: "🏠",
        fields: [
          { name: "propertyType", label: "Property Type", type: "select", required: true, options: opt([["apartment", "Apartment / Flat"], ["villa", "Independent House / Villa"], ["bungalow", "Bungalow"], ["studio", "Studio Apartment"], ["duplex", "Duplex"], ["penthouse", "Penthouse"]]) },
          { name: "propertyValue", label: "Property Value", type: "select", required: true, options: opt([["10-25", "₹10-25 Lakhs"], ["25-50", "₹25-50 Lakhs"], ["50-100", "₹50 Lakhs - 1 Crore"], ["100-200", "₹1-2 Crores"], ["200+", "₹2+ Crores"]]) },
          { name: "carpetArea", label: "Carpet Area", type: "select", options: opt([["<500", "Under 500 sq ft"], ["500-1000", "500-1000 sq ft"], ["1000-1500", "1000-1500 sq ft"], ["1500-2500", "1500-2500 sq ft"], ["2500+", "2500+ sq ft"]]) },
        ],
      },
      contact("Owner Name"),
    ],
  },

  shop: {
    sections: [
      {
        title: "Shop insurance details",
        icon: "🏪",
        fields: [
          { name: "businessType", label: "Business Type", type: "select", required: true, options: opt([["retail", "Retail Store"], ["restaurant", "Restaurant / Cafe"], ["electronics", "Electronics Shop"], ["pharmacy", "Pharmacy"], ["clothing", "Clothing Store"], ["grocery", "Grocery Store"], ["other", "Other"]]) },
          { name: "shopSize", label: "Shop Size", type: "select", required: true, options: opt([["<500", "Under 500 sq ft"], ["500-1000", "500-1000 sq ft"], ["1000-2000", "1000-2000 sq ft"], ["2000+", "Above 2000 sq ft"]]) },
        ],
      },
      contact("Owner Name"),
    ],
  },

  "personal-accident": {
    sections: [
      {
        title: "Personal accident details",
        icon: "🩹",
        fields: [
          { name: "age", label: "Age", type: "number", required: true, placeholder: "Age in years" },
          { name: "occupation", label: "Occupation", type: "select", required: true, options: opt([["office-worker", "Office Worker"], ["businessman", "Businessman"], ["doctor", "Doctor"], ["teacher", "Teacher"], ["engineer", "Engineer"], ["driver", "Driver"], ["other", "Other"]]) },
          { name: "coverage", label: "Coverage Amount", type: "select", required: true, options: opt([["5", "₹5 Lakh"], ["10", "₹10 Lakh"], ["25", "₹25 Lakh"], ["50", "₹50 Lakh"], ["100", "₹1 Crore"]]) },
        ],
      },
      contact("Full Name"),
    ],
  },

  marine: {
    sections: [
      {
        title: "Marine cargo details",
        icon: "🚢",
        fields: [
          { name: "cargoType", label: "Cargo Type", type: "select", required: true, options: opt([["electronics", "Electronics & Technology"], ["textiles", "Textiles & Garments"], ["machinery", "Machinery & Equipment"], ["automotive", "Automotive Parts"], ["pharma", "Pharmaceuticals"], ["food", "Food & Beverages"], ["chemicals", "Chemicals"], ["raw-materials", "Raw Materials"], ["consumer", "Consumer Goods"], ["other", "Other"]]) },
          { name: "cargoValue", label: "Cargo Value (₹)", type: "number", required: true, placeholder: "Declared value of goods" },
          { name: "origin", label: "From (Origin)", type: "text", required: true, placeholder: "Origin port / city" },
          { name: "shipDestination", label: "To (Destination)", type: "text", required: true, placeholder: "Destination port / city" },
          { name: "shipmentMode", label: "Shipment Mode", type: "select", required: true, options: opt([["sea-fcl", "Sea Freight (FCL)"], ["sea-lcl", "Sea Freight (LCL)"], ["air", "Air Freight"], ["multimodal", "Multi-modal"], ["road", "Road Transport"], ["rail", "Rail Transport"]]) },
        ],
      },
      contact("Company / Contact Name"),
    ],
  },
};

export function getServiceForm(category: string): ServiceForm | undefined {
  return SERVICE_FORMS[category];
}

export function allFields(form: ServiceForm): FormField[] {
  return form.sections.flatMap((s) => s.fields);
}

/** Human-readable value for a stored answer (resolves select option labels). */
export function fieldDisplayValue(field: FormField, raw: unknown): string {
  const v = raw == null ? "" : String(raw);
  if (!v) return "—";
  if (field.type === "select") {
    return field.options?.find((o) => o.value === v)?.label ?? v;
  }
  return v;
}

/** Ordered [label, value] rows for a submission's details (for display). */
export function detailRows(
  category: string,
  details: Record<string, unknown> | undefined
): { label: string; value: string }[] {
  const form = getServiceForm(category);
  if (!form || !details) return [];
  return allFields(form)
    .filter((f) => !f.name.startsWith("customer"))
    .map((f) => ({ label: f.label, value: fieldDisplayValue(f, details[f.name]) }))
    .filter((r) => r.value && r.value !== "—");
}

/** Validate a submission's details against its form. Returns error map by field name. */
export function validateDetails(
  category: string,
  details: Record<string, unknown>
): Record<string, string> {
  const form = getServiceForm(category);
  const errors: Record<string, string> = {};
  if (!form) {
    errors._form = "Unknown insurance category.";
    return errors;
  }
  for (const field of allFields(form)) {
    const value = details[field.name];
    if (field.required && (value == null || String(value).trim() === "")) {
      errors[field.name] = `${field.label} is required`;
    }
  }
  return errors;
}
