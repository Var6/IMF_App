import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Policy } from "@/models/Policy";
import { requireRole } from "@/lib/auth";
import { policySchema } from "@/lib/validation";
import { getInsurer } from "@/lib/catalog";
import { validateDetails } from "@/lib/forms";

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

  // Validate the service-specific answers against the category's form.
  const details = (d.details ?? {}) as Record<string, unknown>;
  const fieldErrors = validateDetails(d.category, details);
  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json(
      { error: "Please complete all required fields.", fieldErrors },
      { status: 400 }
    );
  }

  const applicantName = String(details.customerName ?? "").trim();
  const applicantMobile = String(details.customerMobile ?? "").trim();
  const applicantEmail = String(details.customerEmail ?? "").trim().toLowerCase();

  await connectDB();

  const policy = await Policy.create({
    partner: session.sub,
    category: d.category,
    insurerSlug: d.insurerSlug,
    insurerName: match.insurer.name,
    planName: d.planName || undefined,
    applicantName,
    applicantMobile,
    applicantEmail: applicantEmail || undefined,
    details,
    documents: d.documents ?? [],
    partnerNotes: d.partnerNotes || undefined,
    status: "submitted",
  });

  return NextResponse.json({ ok: true, id: String(policy._id) });
}
