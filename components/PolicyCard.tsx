import Link from "next/link";
import { StatusBadge } from "@/components/Logo";
import { statusLabel, formatDate } from "@/lib/format";
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
          <h3 className="font-semibold text-slate-900">
            {policy.planName || policy.categoryName}
          </h3>
          <p className="text-sm text-slate-500">
            {policy.insurerName} · for {policy.applicantName}
          </p>
        </div>
        <StatusBadge status={policy.status} label={statusLabel(policy.status)} />
      </div>

      {policy.keyFacts.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
          {policy.keyFacts.map((f, i) => (
            <div key={i}>
              <p className="truncate text-xs text-slate-400">{f.label}</p>
              <p className="truncate font-semibold text-slate-800">{f.value}</p>
            </div>
          ))}
        </div>
      )}

      <p className="mt-3 text-xs text-slate-400">
        Submitted {formatDate(policy.createdAt)}
      </p>

      {showReward && policy.status === "created" && (
        <div className="mt-3 flex items-center justify-between rounded-lg bg-amber-50 px-3 py-2 text-sm">
          <span className="text-amber-700">
            Policy #{policy.policyNumber} · Reward earned
          </span>
          <span className="font-bold text-amber-700">+{policy.rewardCoins} 🪙</span>
        </div>
      )}
    </Link>
  );
}
