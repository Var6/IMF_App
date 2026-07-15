import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Policy } from "@/models/Policy";
import { requireRole } from "@/lib/auth";
import { policySchema } from "@/lib/validation";
import { getInsurer } from "@/lib/catalog";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const session = await requireRole("partner");
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = policySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const d = parsed.data;

  const match = getInsurer(d.category, d.insurerSlug);
  if (!match) {
    return NextResponse.json(
      { error: "Unknown insurer or category." },
      { status: 400 }
    );
  }

  await connectDB();

  const policy = await Policy.create({
    partner: session.sub,
    category: d.category,
    insurerSlug: d.insurerSlug,
    insurerName: match.insurer.name,
    planName: d.planName,
    planType: d.planType,

    proposerName: d.proposerName,
    proposerDob: d.proposerDob,
    proposerGender: d.proposerGender,
    proposerMobile: d.proposerMobile,
    proposerEmail: d.proposerEmail || undefined,
    proposerPan: d.proposerPan || undefined,
    proposerAadhaar: d.proposerAadhaar || undefined,
    proposerAddress: d.proposerAddress || undefined,
    occupation: d.occupation || undefined,
    annualIncome: d.annualIncome,
    tobaccoUser: Boolean(d.tobaccoUser),
    medicalHistory: d.medicalHistory || undefined,

    nominee: {
      name: d.nomineeName,
      relation: d.nomineeRelation,
      dob: d.nomineeDob || undefined,
      sharePercent: d.nomineeSharePercent,
      appointeeName: d.appointeeName || undefined,
    },

    sumAssured: d.sumAssured,
    premiumAmount: d.premiumAmount,
    premiumFrequency: d.premiumFrequency,
    policyTermYears: d.policyTermYears,
    premiumPayingTermYears: d.premiumPayingTermYears,
    proposedStartDate: d.proposedStartDate || undefined,

    documents: d.documents ?? [],
    partnerNotes: d.partnerNotes || undefined,
    status: "submitted",
  });

  return NextResponse.json({ ok: true, id: String(policy._id) });
}
