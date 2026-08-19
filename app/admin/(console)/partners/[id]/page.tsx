import Link from "next/link";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import { Partner } from "@/models/Partner";
import { Policy } from "@/models/Policy";
import { CoinTransaction } from "@/models/CoinTransaction";
import { publicUrlForKey } from "@/lib/r2";
import { Avatar } from "@/components/Avatar";
import { StatusBadge } from "@/components/Logo";
import { statusLabel, formatDate, formatDateTime, formatNumber } from "@/lib/format";
import { categoryName } from "@/lib/catalog";
import { PartnerActions } from "./PartnerActions";

export default async function AdminPartnerDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await connectDB();

  const partner = await Partner.findById(id).lean();
  if (!partner) notFound();
  const p = partner as never as {
    _id: unknown;
    name: string;
    email: string;
    mobile: string;
    status: string;
    coins?: number;
    aadhaarNumber: string;
    panNumber: string;
    dob?: string;
    gender?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    selfieKey?: string;
    aadhaarImageKey?: string;
    panImageKey?: string;
    marksheet10Key?: string;
    marksheet12Key?: string;
    graduationKey?: string;
    postGraduationKey?: string;
    rejectionReason?: string;
    createdAt: Date;
    bank?: {
      accountHolderName?: string;
      accountNumber?: string;
      ifsc?: string;
      bankName?: string;
      branch?: string;
    };
  };

  const [policies, txns] = await Promise.all([
    Policy.find({ partner: id })
      .sort({ createdAt: -1 })
      .select("planName category insurerName status rewardCoins createdAt")
      .lean(),
    CoinTransaction.find({ partner: id }).sort({ createdAt: -1 }).limit(20).lean(),
  ]);

  const docs = [
    { label: "Selfie", url: publicUrlForKey(p.selfieKey) },
    { label: "Aadhaar card", url: publicUrlForKey(p.aadhaarImageKey) },
    { label: "PAN card", url: publicUrlForKey(p.panImageKey) },
    { label: "10th marksheet", url: publicUrlForKey(p.marksheet10Key) },
    { label: "12th marksheet", url: publicUrlForKey(p.marksheet12Key) },
    { label: "Graduation marksheet", url: publicUrlForKey(p.graduationKey) },
    {
      label: "Post-graduation marksheet",
      url: publicUrlForKey(p.postGraduationKey),
    },
  ].filter((d) => d.url);

  return (
    <div>
      <Link href="/admin/partners" className="text-sm text-slate-500 hover:text-brand-600">
        ← All partners
      </Link>

      <div className="mt-3 flex flex-wrap items-center gap-4">
        <Avatar name={p.name} src={publicUrlForKey(p.selfieKey)} size={64} />
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">{p.name}</h1>
            <StatusBadge status={p.status} label={statusLabel(p.status)} />
          </div>
          <p className="text-slate-500">
            {p.email} · {p.mobile} · joined {formatDate(p.createdAt)}
          </p>
        </div>
        <div className="ml-auto rounded-xl bg-amber-50 px-4 py-2 text-center">
          <p className="text-xs text-amber-600">Coin balance</p>
          <p className="text-xl font-bold text-amber-700">
            {formatNumber(p.coins ?? 0)} 🪙
          </p>
        </div>
      </div>

      {p.status === "rejected" && p.rejectionReason && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          <strong>Rejected:</strong> {p.rejectionReason}
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Left: details */}
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="card p-5">
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
                KYC
              </h3>
              <Row label="Aadhaar" value={p.aadhaarNumber} />
              <Row label="PAN" value={p.panNumber} />
              <Row label="Date of birth" value={p.dob} />
              <Row label="Gender" value={p.gender} />
              <Row
                label="Address"
                value={[p.address, p.city, p.state, p.pincode].filter(Boolean).join(", ")}
              />
            </div>
            <div className="card p-5">
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
                Bank account
              </h3>
              <Row label="Holder" value={p.bank?.accountHolderName} />
              <Row label="Account no." value={p.bank?.accountNumber} />
              <Row label="IFSC" value={p.bank?.ifsc} />
              <Row label="Bank" value={p.bank?.bankName} />
              <Row label="Branch" value={p.bank?.branch} />
            </div>
          </div>

          {/* Documents */}
          <div className="card p-5">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
              Uploaded documents
            </h3>
            {docs.length === 0 ? (
              <p className="text-sm text-slate-400">No documents uploaded.</p>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {docs.map((d) => (
                  <a
                    key={d.label}
                    href={d.url!}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border border-slate-200 p-3 text-center text-sm text-brand-600 hover:bg-slate-50"
                  >
                    📎 {d.label}
                    <span className="mt-1 block text-xs text-slate-400">View ↗</span>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Their policies */}
          <div className="card p-5">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
              Submissions ({policies.length})
            </h3>
            {policies.length === 0 ? (
              <p className="text-sm text-slate-400">No submissions yet.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {policies.map((pol) => {
                  const x = pol as never as {
                    _id: unknown;
                    planName?: string;
                    category: string;
                    insurerName: string;
                    status: string;
                    rewardCoins?: number;
                    createdAt: Date;
                  };
                  return (
                    <Link
                      key={String(x._id)}
                      href={`/admin/submissions/${String(x._id)}`}
                      className="flex items-center justify-between py-2.5 hover:bg-slate-50"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-800">
                          {x.planName || categoryName(x.category)}
                        </p>
                        <p className="text-xs text-slate-400">
                          {x.insurerName} · {formatDate(x.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        {x.status === "created" && (
                          <span className="text-xs font-semibold text-amber-600">
                            +{x.rewardCoins} 🪙
                          </span>
                        )}
                        <StatusBadge status={x.status} label={statusLabel(x.status)} />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Coin history */}
          <div className="card p-5">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
              Coin history
            </h3>
            {txns.length === 0 ? (
              <p className="text-sm text-slate-400">No coin activity.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {txns.map((t) => {
                  const x = t as never as {
                    _id: unknown;
                    amount: number;
                    reason: string;
                    balanceAfter: number;
                    createdAt: Date;
                  };
                  return (
                    <div
                      key={String(x._id)}
                      className="flex items-center justify-between py-2 text-sm"
                    >
                      <div>
                        <p className="text-slate-700">{x.reason}</p>
                        <p className="text-xs text-slate-400">
                          {formatDateTime(x.createdAt)}
                        </p>
                      </div>
                      <span
                        className={`font-bold ${
                          x.amount >= 0 ? "text-emerald-600" : "text-red-600"
                        }`}
                      >
                        {x.amount >= 0 ? "+" : ""}
                        {x.amount} 🪙
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: actions */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <PartnerActions partnerId={String(p._id)} status={p.status} />
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-slate-100 py-2 text-sm last:border-0">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-medium text-slate-800">{value || "—"}</span>
    </div>
  );
}
