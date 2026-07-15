import Link from "next/link";
import { getCurrentPartner } from "@/lib/current";
import { CATEGORIES } from "@/lib/catalog";
import { connectDB } from "@/lib/db";
import { Policy } from "@/models/Policy";

export default async function ServicesHome() {
  const partner = await getCurrentPartner();
  await connectDB();

  const [total, created, pending] = partner
    ? await Promise.all([
        Policy.countDocuments({ partner: partner._id }),
        Policy.countDocuments({ partner: partner._id, status: "created" }),
        Policy.countDocuments({
          partner: partner._id,
          status: { $in: ["submitted", "under_review"] },
        }),
      ])
    : [0, 0, 0];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back, {partner?.name.split(" ")[0]} 👋
        </h1>
        <p className="text-slate-500">
          Choose a category to view insurer partners and submit a new policy.
        </p>
      </div>

      {/* Quick stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat label="Reward coins" value={`${(partner?.coins ?? 0).toLocaleString("en-IN")} 🪙`} accent="amber" />
        <Stat label="Total requests" value={total} />
        <Stat label="Policies created" value={created} accent="emerald" />
        <Stat label="In progress" value={pending} accent="blue" />
      </div>

      <h2 className="mb-4 text-lg font-semibold text-slate-900">
        Insurance services
      </h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {CATEGORIES.map((c) => (
          <Link
            key={c.slug}
            href={`/dashboard/services/${c.slug}`}
            className="card group p-5 transition-shadow hover:shadow-md"
          >
            <div className="text-4xl">{c.icon}</div>
            <h3 className="mt-3 font-semibold text-slate-900 group-hover:text-brand-700">
              {c.name}
            </h3>
            <p className="mt-1 text-sm text-slate-500">{c.tagline}</p>
            <p className="mt-3 text-xs font-medium text-brand-600">
              {c.insurers.length} partners →
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: "amber" | "emerald" | "blue";
}) {
  const color =
    accent === "amber"
      ? "text-amber-600"
      : accent === "emerald"
        ? "text-emerald-600"
        : accent === "blue"
          ? "text-blue-600"
          : "text-slate-900";
  return (
    <div className="card p-4">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
