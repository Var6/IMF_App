import { StatusBadge } from "@/components/Logo";
import { statusLabel } from "@/lib/format";
import type { PolicyFull } from "@/lib/serialize";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 border-b border-slate-100 py-2 text-sm last:border-0">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-medium text-slate-800">{value || "—"}</span>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card p-5">
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </h3>
      <div>{children}</div>
    </div>
  );
}

export function PolicyDetails({ policy }: { policy: PolicyFull }) {
  return (
    <div className="space-y-4">
      <div className="card p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">
                {policy.planName || policy.categoryName}
              </h2>
              <StatusBadge status={policy.status} label={statusLabel(policy.status)} />
            </div>
            <p className="text-sm text-slate-500">
              {policy.categoryName} · {policy.insurerName}
            </p>
          </div>
          {policy.status === "created" && (
            <div className="rounded-xl bg-emerald-50 px-4 py-2 text-right">
              <p className="text-xs text-emerald-600">Policy number</p>
              <p className="font-bold text-emerald-700">{policy.policyNumber}</p>
            </div>
          )}
        </div>

        {policy.status === "rejected" && policy.rejectionReason && (
          <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            <strong>Rejected:</strong> {policy.rejectionReason}
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Block title="Customer">
          <Row label="Name" value={policy.applicantName} />
          <Row label="Mobile" value={policy.applicantMobile} />
          <Row label="Email" value={policy.applicantEmail} />
        </Block>

        <Block title="Policy details">
          {policy.detailRows.length === 0 ? (
            <p className="text-sm text-slate-400">No additional details.</p>
          ) : (
            policy.detailRows.map((r, i) => (
              <Row key={i} label={r.label} value={r.value} />
            ))
          )}
        </Block>
      </div>

      {(policy.documents.length > 0 || policy.partnerNotes || policy.adminNotes) && (
        <div className="grid gap-4 md:grid-cols-2">
          {policy.documents.length > 0 && (
            <Block title="Documents">
              <ul className="space-y-2">
                {policy.documents.map((d, i) => (
                  <li key={i}>
                    {d.url ? (
                      <a
                        href={d.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-brand-600 hover:bg-slate-100"
                      >
                        📎 {d.label} <span className="text-slate-400">↗</span>
                      </a>
                    ) : (
                      <span className="text-sm text-slate-400">
                        📎 {d.label} (unavailable)
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </Block>
          )}
          {(policy.partnerNotes || policy.adminNotes) && (
            <Block title="Notes">
              {policy.partnerNotes && (
                <p className="mb-2 text-sm">
                  <span className="font-semibold text-slate-700">Partner:</span>{" "}
                  {policy.partnerNotes}
                </p>
              )}
              {policy.adminNotes && (
                <p className="text-sm">
                  <span className="font-semibold text-slate-700">Admin:</span>{" "}
                  {policy.adminNotes}
                </p>
              )}
            </Block>
          )}
        </div>
      )}
    </div>
  );
}
