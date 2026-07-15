import type { PolicyDoc } from "@/models/Policy";
import { publicUrlForKey } from "@/lib/r2";

/** A plain, client-safe view of a policy (with resolved document URLs). */
export interface PolicySummary {
  id: string;
  category: string;
  insurerName: string;
  planName: string;
  planType: string;
  proposerName: string;
  sumAssured: number;
  premiumAmount: number;
  premiumFrequency: string;
  status: string;
  policyNumber?: string;
  rewardCoins: number;
  rewardCredited: boolean;
  createdAt: string;
}

export function toPolicySummary(p: PolicyDoc): PolicySummary {
  return {
    id: String(p._id),
    category: p.category,
    insurerName: p.insurerName,
    planName: p.planName,
    planType: p.planType,
    proposerName: p.proposerName,
    sumAssured: p.sumAssured,
    premiumAmount: p.premiumAmount,
    premiumFrequency: p.premiumFrequency,
    status: p.status,
    policyNumber: p.policyNumber || undefined,
    rewardCoins: p.rewardCoins ?? 0,
    rewardCredited: Boolean(p.rewardCredited),
    createdAt:
      p.createdAt instanceof Date
        ? p.createdAt.toISOString()
        : String(p.createdAt ?? ""),
  };
}

export interface PolicyFull extends PolicySummary {
  insurerSlug: string;
  proposerDob: string;
  proposerGender: string;
  proposerMobile: string;
  proposerEmail?: string;
  proposerPan?: string;
  proposerAadhaar?: string;
  proposerAddress?: string;
  occupation?: string;
  annualIncome?: number;
  tobaccoUser: boolean;
  medicalHistory?: string;
  nominee: {
    name: string;
    relation: string;
    dob?: string;
    sharePercent: number;
    appointeeName?: string;
  };
  policyTermYears: number;
  premiumPayingTermYears: number;
  proposedStartDate?: string;
  partnerNotes?: string;
  adminNotes?: string;
  rejectionReason?: string;
  documents: { label: string; url: string | null }[];
}

export function toPolicyFull(p: PolicyDoc): PolicyFull {
  return {
    ...toPolicySummary(p),
    insurerSlug: p.insurerSlug,
    proposerDob: p.proposerDob,
    proposerGender: p.proposerGender,
    proposerMobile: p.proposerMobile,
    proposerEmail: p.proposerEmail || undefined,
    proposerPan: p.proposerPan || undefined,
    proposerAadhaar: p.proposerAadhaar || undefined,
    proposerAddress: p.proposerAddress || undefined,
    occupation: p.occupation || undefined,
    annualIncome: p.annualIncome ?? undefined,
    tobaccoUser: Boolean(p.tobaccoUser),
    medicalHistory: p.medicalHistory || undefined,
    nominee: {
      name: p.nominee?.name ?? "",
      relation: p.nominee?.relation ?? "",
      dob: p.nominee?.dob || undefined,
      sharePercent: p.nominee?.sharePercent ?? 100,
      appointeeName: p.nominee?.appointeeName || undefined,
    },
    policyTermYears: p.policyTermYears,
    premiumPayingTermYears: p.premiumPayingTermYears,
    proposedStartDate: p.proposedStartDate || undefined,
    partnerNotes: p.partnerNotes || undefined,
    adminNotes: p.adminNotes || undefined,
    rejectionReason: p.rejectionReason || undefined,
    documents: (p.documents ?? []).map((d) => ({
      label: d.label,
      url: publicUrlForKey(d.key),
    })),
  };
}
