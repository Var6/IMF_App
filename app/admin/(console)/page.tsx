import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Partner } from "@/models/Partner";
import { Policy } from "@/models/Policy";
import { categoryName } from "@/lib/catalog";
import { formatNumber } from "@/lib/format";

export const metadata = { title: "Admin Dashboard" };

export default async function AdminDashboard() {
  await connectDB();

  const [
    totalPartners,
    pendingPartners,
    verifiedPartners,
    totalPolicies,
    submittedPolicies,
    reviewPolicies,
    createdPolicies,
    rejectedPolicies,
  ] = await Promise.all([
    Partner.countDocuments({}),
    Partner.countDocuments({ status: "pending" }),
    Partner.countDocuments({ status: "verified" }),
    Policy.countDocuments({}),
    Policy.countDocuments({ status: "submitted" }),
    Policy.countDocuments({ status: "under_review" }),
    Policy.countDocuments({ status: "created" }),
    Policy.countDocuments({ status: "rejected" }),
  ]);

  // Total reward coins issued across all partners.
  const coinAgg = await Partner.aggregate<{ _id: null; total: number }>([
    { $group: { _id: null, total: { $sum: "$coins" } } },
  ]);
  const totalCoins = coinAgg[0]?.total ?? 0;

  // Top earners (who is earning the most).
  const topEarners = await Partner.find({ status: "verified" })
    .sort({ coins: -1 })
    .limit(5)
    .select("name email coins")
    .lean();

  // Most active partners by created policies (who is working).
  const activeAgg = await Policy.aggregate<{
    _id: unknown;
    created: number;
    reward: number;
  }>([
    { $match: { status: "created" } },
    {
      $group: {
        _id: "$partner",
        created: { $sum: 1 },
        reward: { $sum: "$rewardCoins" },
      },
    },
    { $sort: { created: -1 } },
    { $limit: 5 },
  ]);
  const activePartners = await Promise.all(
    activeAgg.map(async (a) => {
      const p = await Partner.findById(a._id).select("name email").lean();
      return {
        name: (p as { name?: string })?.name ?? "Unknown",
        created: a.created,
        reward: a.reward,
      };
    })
  );

  // Policies by category.
  const byCategory = await Policy.aggregate<{ _id: string; count: number }>([
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
  const maxCat = Math.max(1, ...byCategory.map((c) => c.count));

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
      <p className="text-slate-500">
        Overview of partners, submissions and rewards.
      </p>

      {/* KPI cards */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi label="Total partners" value={totalPartners} icon="👥" />
        <Kpi
          label="Pending verification"
          value={pendingPartners}
          icon="⏳"
          accent="amber"
          href="/admin/partners?status=pending"
        />
        <Kpi label="Policies created" value={createdPolicies} icon="✅" accent="emerald" />
        <Kpi label="Coins issued" value={`${formatNumber(totalCoins)} 🪙`} icon="🪙" accent="amber" />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi label="Verified partners" value={verifiedPartners} icon="🟢" />
        <Kpi label="New submissions" value={submittedPolicies} icon="📥" accent="blue" href="/admin/submissions?status=submitted" />
        <Kpi label="Under review" value={reviewPolicies} icon="🔍" accent="blue" />
        <Kpi label="Rejected policies" value={rejectedPolicies} icon="🚫" accent="red" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Top earners */}
        <div className="card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">🏆 Top earning partners</h2>
            <Link href="/admin/partners" className="text-xs font-medium text-brand-600">
              View all →
            </Link>
          </div>
          {topEarners.length === 0 ? (
            <Empty text="No partners yet." />
          ) : (
            <div className="space-y-2">
              {topEarners.map((p, i) => (
                <div
                  key={String((p as { _id: unknown })._id)}
                  className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {(p as { name: string }).name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {(p as { email: string }).email}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-amber-600">
                    {formatNumber((p as { coins?: number }).coins ?? 0)} 🪙
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Most active */}
        <div className="card p-5">
          <h2 className="mb-3 font-semibold text-slate-900">
            🔥 Most active (policies created)
          </h2>
          {activePartners.length === 0 ? (
            <Empty text="No policies created yet." />
          ) : (
            <div className="space-y-2">
              {activePartners.map((p, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                      {i + 1}
                    </span>
                    <p className="text-sm font-medium text-slate-800">{p.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-800">
                      {p.created} created
                    </p>
                    <p className="text-xs text-amber-600">{p.reward} 🪙 rewarded</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Policies by category */}
      <div className="card mt-6 p-5">
        <h2 className="mb-4 font-semibold text-slate-900">Policies by category</h2>
        {byCategory.length === 0 ? (
          <Empty text="No policies yet." />
        ) : (
          <div className="space-y-3">
            {byCategory.map((c) => (
              <div key={c._id} className="flex items-center gap-3">
                <span className="w-40 text-sm text-slate-600">
                  {categoryName(c._id)}
                </span>
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-brand-500"
                    style={{ width: `${(c.count / maxCat) * 100}%` }}
                  />
                </div>
                <span className="w-8 text-right text-sm font-semibold text-slate-700">
                  {c.count}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Kpi({
  label,
  value,
  icon,
  accent,
  href,
}: {
  label: string;
  value: string | number;
  icon: string;
  accent?: "amber" | "emerald" | "blue" | "red";
  href?: string;
}) {
  const color =
    accent === "amber"
      ? "text-amber-600"
      : accent === "emerald"
        ? "text-emerald-600"
        : accent === "blue"
          ? "text-blue-600"
          : accent === "red"
            ? "text-red-600"
            : "text-slate-900";
  const inner = (
    <div className="card p-4 transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <span>{icon}</span>
      </div>
      <p className={`mt-1 text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

function Empty({ text }: { text: string }) {
  return (
    <div className="rounded-lg bg-slate-50 py-8 text-center text-sm text-slate-400">
      {text}
    </div>
  );
}
