import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentPartner } from "@/lib/current";
import { connectDB } from "@/lib/db";
import { Policy } from "@/models/Policy";
import { categoryName } from "@/lib/catalog";
import { DynamicPolicyForm } from "@/components/DynamicPolicyForm";

export default async function EditPolicyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const partner = await getCurrentPartner();
  await connectDB();

  const policy = await Policy.findOne({ _id: id, partner: partner!._id }).lean();
  if (!policy) notFound();

  // Only rejected requests can be edited & resubmitted.
  if (policy.status !== "rejected") {
    redirect(`/dashboard/requests/${id}`);
  }

  const details: Record<string, string> = {};
  for (const [k, v] of Object.entries(policy.details ?? {})) {
    details[k] = v == null ? "" : String(v);
  }
  const initialDocs = (policy.documents ?? []).map((d) => ({
    label: d.label,
    key: d.key,
  }));

  return (
    <div>
      <Link
        href={`/dashboard/requests/${id}`}
        className="text-sm text-slate-500 hover:text-brand-600"
      >
        ← Back to request
      </Link>

      <h1 className="mt-3 text-2xl font-bold text-slate-900">
        Edit & resubmit request
      </h1>
      <p className="text-sm text-slate-500">
        {categoryName(policy.category)} · {policy.insurerName}
      </p>

      {policy.rejectionReason && (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
          <p className="text-sm font-semibold text-red-800">
            ⚠️ This request was rejected. Please fix the issue below and resubmit.
          </p>
          <p className="mt-1 text-sm text-red-700">
            <strong>Reason:</strong> {policy.rejectionReason}
          </p>
        </div>
      )}

      <div className="mt-6">
        <DynamicPolicyForm
          category={policy.category}
          insurerSlug={policy.insurerSlug}
          insurerName={policy.insurerName}
          policyId={id}
          initialDetails={details}
          initialPlanName={policy.planName ?? ""}
          initialNotes={policy.partnerNotes ?? ""}
          initialDocs={initialDocs}
        />
      </div>
    </div>
  );
}
