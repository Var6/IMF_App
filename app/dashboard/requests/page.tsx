import Link from "next/link";
import { getCurrentPartner } from "@/lib/current";
import { connectDB } from "@/lib/db";
import { Policy } from "@/models/Policy";
import { toPolicySummary } from "@/lib/serialize";
import { PolicyCard } from "@/components/PolicyCard";

export const metadata = { title: "My Requests" };

export default async function RequestsPage() {
  const partner = await getCurrentPartner();
  await connectDB();
  const policies = await Policy.find({ partner: partner!._id })
    .sort({ createdAt: -1 })
    .lean();

  const summaries = policies.map((p) => toPolicySummary(p as never));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My requests</h1>
          <p className="text-slate-500">
            Track every policy you&apos;ve submitted and chat with the admin.
          </p>
        </div>
        <Link href="/dashboard" className="btn-primary">
          + New policy
        </Link>
      </div>

      {summaries.length === 0 ? (
        <div className="card p-10 text-center">
          <div className="text-4xl">📄</div>
          <h2 className="mt-3 font-semibold text-slate-900">No requests yet</h2>
          <p className="mt-1 text-sm text-slate-500">
            Pick an insurance service to create your first policy.
          </p>
          <Link href="/dashboard" className="btn-primary mt-4 inline-flex">
            Browse services
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {summaries.map((p) => (
            <PolicyCard
              key={p.id}
              policy={p}
              href={`/dashboard/requests/${p.id}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
