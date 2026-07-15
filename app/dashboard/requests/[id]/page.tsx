import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentPartner } from "@/lib/current";
import { connectDB } from "@/lib/db";
import { Policy } from "@/models/Policy";
import { toPolicyFull } from "@/lib/serialize";
import { PolicyDetails } from "@/components/PolicyDetails";
import { Chat } from "@/components/Chat";

export default async function PartnerPolicyDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const partner = await getCurrentPartner();
  await connectDB();

  const policy = await Policy.findOne({ _id: id, partner: partner!._id }).lean();
  if (!policy) notFound();

  const full = toPolicyFull(policy as never);

  return (
    <div>
      <Link
        href="/dashboard/requests"
        className="text-sm text-slate-500 hover:text-brand-600"
      >
        ← My requests
      </Link>

      {full.status === "created" && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-semibold text-emerald-800">
                Policy created successfully!
              </p>
              <p className="text-sm text-emerald-700">
                Policy number <strong>{full.policyNumber}</strong> has been issued.
              </p>
            </div>
          </div>
          {full.rewardCredited && (
            <div className="rounded-xl bg-white px-4 py-2 text-center shadow-sm">
              <p className="text-xs text-slate-500">Reward credited</p>
              <p className="font-bold text-amber-600">+{full.rewardCoins} 🪙</p>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_400px]">
        <PolicyDetails policy={full} />
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Chat policyId={full.id} currentRole="partner" />
        </div>
      </div>
    </div>
  );
}
