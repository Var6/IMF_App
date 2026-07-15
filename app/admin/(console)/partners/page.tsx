import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Partner } from "@/models/Partner";
import { StatusBadge } from "@/components/Logo";
import { statusLabel, formatDate, formatNumber } from "@/lib/format";

export const metadata = { title: "Partners" };

const FILTERS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "verified", label: "Verified" },
  { key: "rejected", label: "Rejected" },
];

export default async function PartnersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const filter: Record<string, unknown> =
    status && status !== "all" ? { status } : {};

  await connectDB();
  const partners = await Partner.find(filter as never)
    .sort({ createdAt: -1 })
    .select("name email mobile status coins createdAt")
    .lean();

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Partners</h1>
      <p className="text-slate-500">
        Review registrations, verify accounts and manage rewards.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const active = (status ?? "all") === f.key;
          return (
            <Link
              key={f.key}
              href={f.key === "all" ? "/admin/partners" : `/admin/partners?status=${f.key}`}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                active
                  ? "bg-brand-600 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      <div className="card mt-4 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase text-slate-500">
                <th className="px-4 py-3">Partner</th>
                <th className="px-4 py-3">Mobile</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Coins</th>
                <th className="px-4 py-3">Registered</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {partners.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                    No partners found.
                  </td>
                </tr>
              )}
              {partners.map((p) => (
                <tr
                  key={String((p as { _id: unknown })._id)}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-800">
                      {(p as { name: string }).name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {(p as { email: string }).email}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {(p as { mobile: string }).mobile}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      status={(p as { status: string }).status}
                      label={statusLabel((p as { status: string }).status)}
                    />
                  </td>
                  <td className="px-4 py-3 font-semibold text-amber-600">
                    {formatNumber((p as { coins?: number }).coins ?? 0)} 🪙
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {formatDate((p as { createdAt: Date }).createdAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/partners/${String((p as { _id: unknown })._id)}`}
                      className="font-medium text-brand-600 hover:underline"
                    >
                      Manage →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
