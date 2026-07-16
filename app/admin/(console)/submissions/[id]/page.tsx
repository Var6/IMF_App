import Link from "next/link";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import { Policy } from "@/models/Policy";
import { Partner } from "@/models/Partner";
import { toPolicyFull } from "@/lib/serialize";
import { PolicyDetails } from "@/components/PolicyDetails";
import { Chat } from "@/components/Chat";
import { SubmissionActions } from "./SubmissionActions";

/** Default suggested coin reward. Admin can override before creating. */
const DEFAULT_REWARD = 300;

export default async function AdminSubmissionDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await connectDB();

  const policy = await Policy.findById(id)
    .populate({ path: "partner", model: Partner, select: "name email mobile coins" })
    .lean();
  if (!policy) notFound();

  const partnerInfo = (policy as never as {
    partner?: { _id?: string; name?: string; email?: string; mobile?: string; coins?: number };
  }).partner;

  const full = toPolicyFull(policy as never);

  return (
    <div>
      <Link
        href="/admin/submissions"
        className="text-sm text-slate-500 hover:text-brand-600"
      >
        ← All submissions
      </Link>

      {/* Partner banner */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm">
        <div>
          <p className="text-xs text-slate-500">Submitted by</p>
          <p className="font-semibold text-slate-900">
            {partnerInfo?.name ?? "Unknown partner"}
          </p>
          <p className="text-sm text-slate-500">
            {partnerInfo?.email} · {partnerInfo?.mobile}
          </p>
        </div>
        {partnerInfo?._id && (
          <Link
            href={`/admin/partners/${String(partnerInfo._id)}`}
            className="btn-secondary"
          >
            View partner profile →
          </Link>
        )}
      </div>

      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <PolicyDetails policy={full} />
          <Chat policyId={full.id} currentRole="admin" />
        </div>
        <div className="lg:sticky lg:top-6 lg:self-start">
          <SubmissionActions
            policyId={full.id}
            status={full.status}
            partnerName={partnerInfo?.name ?? "the partner"}
            suggestedReward={DEFAULT_REWARD}
            initialNotes={full.adminNotes ?? ""}
          />
        </div>
      </div>
    </div>
  );
}
