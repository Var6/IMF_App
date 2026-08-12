import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Policy } from "@/models/Policy";
import { ChatMessage } from "@/models/ChatMessage";
import { requireRole } from "@/lib/auth";
import { policySchema } from "@/lib/validation";
import { validateDetails } from "@/lib/forms";

export const runtime = "nodejs";

/**
 * Partner edits and resubmits a REJECTED policy. The category/insurer are kept
 * from the original submission; only the answers/documents/notes change. On
 * success the request goes back into the admin queue (status "submitted").
 */
export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const session = await requireRole("partner");
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const { id } = await ctx.params;

  const body = await req.json().catch(() => null);
  const parsed = policySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const d = parsed.data;

  await connectDB();
  const policy = await Policy.findOne({ _id: id, partner: session.sub });
  if (!policy) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  if (policy.status !== "rejected") {
    return NextResponse.json(
      { error: "Only rejected requests can be edited and resubmitted." },
      { status: 400 }
    );
  }

  const details = (d.details ?? {}) as Record<string, unknown>;
  const fieldErrors = validateDetails(policy.category, details);
  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json(
      { error: "Please complete all required fields.", fieldErrors },
      { status: 400 }
    );
  }

  policy.planName = d.planName || undefined;
  policy.details = details;
  policy.markModified("details");
  policy.set("documents", d.documents ?? []);
  policy.partnerNotes = d.partnerNotes || undefined;
  policy.applicantName = String(details.customerName ?? "").trim();
  policy.applicantMobile = String(details.customerMobile ?? "").trim();
  policy.applicantEmail =
    String(details.customerEmail ?? "").trim().toLowerCase() || undefined;
  policy.status = "submitted";
  policy.rejectionReason = "";
  await policy.save();

  // Leave a note in the request chat so the admin sees it was resubmitted.
  await ChatMessage.create({
    policy: policy._id,
    senderRole: "partner",
    senderName: session.name,
    text: "🔁 Resubmitted this request for approval after making changes.",
  });

  return NextResponse.json({ ok: true, id: String(policy._id) });
}
