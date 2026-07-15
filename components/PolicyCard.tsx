import Link from "next/link";
import { StatusBadge } from "@/components/Logo";
import { statusLabel, formatNumber, formatDate } from "@/lib/format";
import type { PolicySummary } from "@/lib/serialize";

export function PolicyCard({
  policy,
  href,
  showReward = true,
}: {
  policy: PolicySummary;
  href: string;
  showReward?: boolean;
}) {
  return (
    <Link href={href} className="card block p-5 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-900">{policy.planName}</h3>
          <p className="text-sm text-slate-500">
            {policy.insurerName} · for {policy.proposerName}
          </p>
        </div>
        <StatusBadge status={policy.status} label={statusLabel(policy.status)} />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
        <div>
          <p className="text-xs text-slate-400">Sum assured</p>
          <p className="font-semibold text-slate-800">₹{formatNumber(policy.sumAssured)}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400">Premium</p>
          <p className="font-semibold text-slate-800">₹{formatNumber(policy.premiumAmount)}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400">Submitted</p>
          <p className="font-semibold text-slate-800">{formatDate(policy.createdAt)}</p>
        </div>
      </div>

      {showReward && policy.status === "created" && (
        <div className="mt-3 flex items-center justify-between rounded-lg bg-amber-50 px-3 py-2 text-sm">
          <span className="text-amber-700">
            Policy #{policy.policyNumber} · Reward earned
          </span>
          <span className="font-bold text-amber-700">
            +{policy.rewardCoins} 🪙
          </span>
        </div>
      )}
    </Link>
  );
}
