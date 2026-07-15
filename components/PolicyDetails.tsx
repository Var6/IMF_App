import { StatusBadge } from "@/components/Logo";
import { statusLabel, formatNumber, formatDate } from "@/lib/format";
import type { PolicyFull } from "@/lib/serialize";
import { categoryName } from "@/lib/catalog";

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
              <h2 className="text-xl font-bold text-slate-900">{policy.planName}</h2>
              <StatusBadge status={policy.status} label={statusLabel(policy.status)} />
            </div>
            <p className="text-sm text-slate-500">
              {categoryName(policy.category)} · {policy.insurerName} · {policy.planType}
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
        <Block title="Proposer / insured">
          <Row label="Name" value={policy.proposerName} />
          <Row label="Date of birth" value={policy.proposerDob} />
          <Row label="Gender" value={policy.proposerGender} />
          <Row label="Mobile" value={policy.proposerMobile} />
          <Row label="Email" value={policy.proposerEmail} />
          <Row label="PAN" value={policy.proposerPan} />
          <Row label="Aadhaar" value={policy.proposerAadhaar} />
          <Row label="Occupation" value={policy.occupation} />
          <Row
            label="Annual income"
            value={policy.annualIncome ? `₹${formatNumber(policy.annualIncome)}` : "—"}
          />
          <Row label="Tobacco / smoker" value={policy.tobaccoUser ? "Yes" : "No"} />
          <Row label="Address" value={policy.proposerAddress} />
          <Row label="Medical history" value={policy.medicalHistory} />
        </Block>

        <div className="space-y-4">
          <Block title="Nominee">
            <Row label="Name" value={policy.nominee.name} />
            <Row label="Relationship" value={policy.nominee.relation} />
            <Row label="Date of birth" value={policy.nominee.dob} />
            <Row label="Share" value={`${policy.nominee.sharePercent}%`} />
            <Row label="Appointee" value={policy.nominee.appointeeName} />
          </Block>

          <Block title="Premium & term">
            <Row label="Sum assured" value={`₹${formatNumber(policy.sumAssured)}`} />
            <Row label="Premium" value={`₹${formatNumber(policy.premiumAmount)}`} />
            <Row label="Frequency" value={policy.premiumFrequency} />
            <Row label="Policy term" value={`${policy.policyTermYears} yrs`} />
            <Row label="Premium paying term" value={`${policy.premiumPayingTermYears} yrs`} />
            <Row label="Proposed start" value={formatDate(policy.proposedStartDate)} />
          </Block>
        </div>
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
