import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Policy } from "@/models/Policy";
import { Partner } from "@/models/Partner";
import { StatusBadge } from "@/components/Logo";
import { statusLabel, formatDate } from "@/lib/format";
import { categoryName } from "@/lib/catalog";

export const metadata = { title: "Submissions" };

const FILTERS = [
  { key: "all", label: "All" },
  { key: "submitted", label: "New" },
  { key: "under_review", label: "Under review" },
  { key: "created", label: "Created" },
  { key: "rejected", label: "Rejected" },
];

export default async function SubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const filter: Record<string, unknown> =
    status && status !== "all" ? { status } : {};

  await connectDB();
  const policies = await Policy.find(filter as never)
    .sort({ createdAt: -1 })
    .populate({ path: "partner", model: Partner, select: "name email" })
    .lean();

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Submissions</h1>
      <p className="text-slate-500">
        Review policy requests, issue policy numbers and credit rewards.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const active = (status ?? "all") === f.key;
          return (
            <Link
              key={f.key}
              href={
                f.key === "all"
                  ? "/admin/submissions"
                  : `/admin/submissions?status=${f.key}`
              }
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
                <th className="px-4 py-3">Plan / Insurer</th>
                <th className="px-4 py-3">Partner</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {policies.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-slate-400">
                    No submissions found.
                  </td>
                </tr>
              )}
              {policies.map((pol) => {
                const x = pol as never as {
                  _id: unknown;
                  planName?: string;
                  insurerName: string;
                  category: string;
                  applicantName: string;
                  status: string;
                  createdAt: Date;
                  partner?: { name?: string; email?: string };
                };
                return (
                  <tr
                    key={String(x._id)}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-800">
                        {x.planName || categoryName(x.category)}
                      </p>
                      <p className="text-xs text-slate-400">{x.insurerName}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {x.partner?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {categoryName(x.category)}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{x.applicantName}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={x.status} label={statusLabel(x.status)} />
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {formatDate(x.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/submissions/${String(x._id)}`}
                        className="font-medium text-brand-600 hover:underline"
                      >
                        Open →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
