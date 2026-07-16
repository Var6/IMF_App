import type { PolicyDoc } from "@/models/Policy";
import { publicUrlForKey } from "@/lib/r2";
import { detailRows } from "@/lib/forms";
import { categoryName } from "@/lib/catalog";

/** A plain, client-safe view of a policy for lists/cards. */
export interface PolicySummary {
  id: string;
  category: string;
  categoryName: string;
  insurerName: string;
  planName?: string;
  applicantName: string;
  applicantMobile: string;
  status: string;
  policyNumber?: string;
  rewardCoins: number;
  rewardCredited: boolean;
  createdAt: string;
  keyFacts: { label: string; value: string }[];
}

function toRows(p: PolicyDoc) {
  return detailRows(p.category, (p.details ?? {}) as Record<string, unknown>);
}

export function toPolicySummary(p: PolicyDoc): PolicySummary {
  return {
    id: String(p._id),
    category: p.category,
    categoryName: categoryName(p.category),
    insurerName: p.insurerName,
    planName: p.planName || undefined,
    applicantName: p.applicantName,
    applicantMobile: p.applicantMobile,
    status: p.status,
    policyNumber: p.policyNumber || undefined,
    rewardCoins: p.rewardCoins ?? 0,
    rewardCredited: Boolean(p.rewardCredited),
    createdAt:
      p.createdAt instanceof Date
        ? p.createdAt.toISOString()
        : String(p.createdAt ?? ""),
    keyFacts: toRows(p).slice(0, 3),
  };
}

export interface PolicyFull extends PolicySummary {
  insurerSlug: string;
  applicantEmail?: string;
  detailRows: { label: string; value: string }[];
  partnerNotes?: string;
  adminNotes?: string;
  rejectionReason?: string;
  documents: { label: string; url: string | null }[];
}

export function toPolicyFull(p: PolicyDoc): PolicyFull {
  return {
    ...toPolicySummary(p),
    insurerSlug: p.insurerSlug,
    applicantEmail: p.applicantEmail || undefined,
    detailRows: toRows(p),
    partnerNotes: p.partnerNotes || undefined,
    adminNotes: p.adminNotes || undefined,
    rejectionReason: p.rejectionReason || undefined,
    documents: (p.documents ?? []).map((d) => ({
      label: d.label,
      url: publicUrlForKey(d.key),
    })),
  };
}
