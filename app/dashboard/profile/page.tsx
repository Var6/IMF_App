import { getCurrentPartner } from "@/lib/current";
import { connectDB } from "@/lib/db";
import { CoinTransaction } from "@/models/CoinTransaction";
import { publicUrlForKey } from "@/lib/r2";
import { Avatar } from "@/components/Avatar";
import { StatusBadge } from "@/components/Logo";
import { LogoutButton } from "@/components/LogoutButton";
import { statusLabel, formatDateTime } from "@/lib/format";

export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  const partner = (await getCurrentPartner())!;
  await connectDB();
  const txns = await CoinTransaction.find({ partner: partner._id })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  const avatarUrl = publicUrlForKey(partner.selfieKey);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">My profile</h1>

      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        {/* Left: identity + coins */}
        <div className="space-y-6">
          <div className="card p-6 text-center">
            <div className="flex justify-center">
              <Avatar name={partner.name} src={avatarUrl} size={88} />
            </div>
            <h2 className="mt-3 text-lg font-bold text-slate-900">{partner.name}</h2>
            <p className="text-sm text-slate-500">{partner.email}</p>
            <div className="mt-2">
              <StatusBadge
                status={partner.status}
                label={statusLabel(partner.status)}
              />
            </div>
            <div className="mt-4">
              <LogoutButton className="btn-secondary w-full" />
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-6 text-white">
              <p className="text-sm text-amber-100">Reward coin balance</p>
              <p className="mt-1 text-4xl font-extrabold">
                {(partner.coins ?? 0).toLocaleString("en-IN")} 🪙
              </p>
              <p className="mt-1 text-xs text-amber-100">
                Reward points — not currency.
              </p>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
              Contact & bank
            </h3>
            <Row label="Mobile" value={partner.mobile} />
            <Row label="PAN" value={partner.panNumber} />
            <Row label="Bank" value={partner.bank?.bankName} />
            <Row label="Account" value={maskAccount(partner.bank?.accountNumber)} />
            <Row label="IFSC" value={partner.bank?.ifsc} />
          </div>
        </div>

        {/* Right: earnings ledger */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-slate-900">
            Earnings & coin history
          </h3>
          <p className="text-sm text-slate-500">
            Every coin credit or adjustment is recorded here so you always know
            where it came from.
          </p>

          {txns.length === 0 ? (
            <div className="mt-6 rounded-xl bg-slate-50 py-10 text-center text-sm text-slate-500">
              No coin activity yet. Submit policies and earn rewards when they
              get created.
            </div>
          ) : (
            <div className="mt-4 divide-y divide-slate-100">
              {txns.map((t) => (
                <div
                  key={String(t._id)}
                  className="flex items-center justify-between gap-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`grid h-9 w-9 place-items-center rounded-full text-lg ${
                        t.amount >= 0 ? "bg-emerald-100" : "bg-red-100"
                      }`}
                    >
                      {t.type === "reward" ? "🎁" : t.amount >= 0 ? "➕" : "➖"}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {t.reason}
                      </p>
                      <p className="text-xs text-slate-400">
                        {formatDateTime(t.createdAt)}
                        {t.byAdminName ? ` · by ${t.byAdminName}` : ""}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold ${
                        t.amount >= 0 ? "text-emerald-600" : "text-red-600"
                      }`}
                    >
                      {t.amount >= 0 ? "+" : ""}
                      {t.amount} 🪙
                    </p>
                    <p className="text-xs text-slate-400">
                      bal {t.balanceAfter} 🪙
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-slate-100 py-2 text-sm last:border-0">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-800">{value || "—"}</span>
    </div>
  );
}

function maskAccount(acc?: string): string {
  if (!acc) return "—";
  if (acc.length <= 4) return acc;
  return `••••${acc.slice(-4)}`;
}
