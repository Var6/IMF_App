"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileUpload } from "@/components/FileUpload";

const initial = {
  planName: "",
  planType: "term",
  proposerName: "",
  proposerDob: "",
  proposerGender: "male",
  proposerMobile: "",
  proposerEmail: "",
  proposerPan: "",
  proposerAadhaar: "",
  proposerAddress: "",
  occupation: "",
  annualIncome: "",
  tobaccoUser: "no",
  medicalHistory: "",
  nomineeName: "",
  nomineeRelation: "",
  nomineeDob: "",
  nomineeSharePercent: "100",
  appointeeName: "",
  sumAssured: "",
  premiumAmount: "",
  premiumFrequency: "yearly",
  policyTermYears: "",
  premiumPayingTermYears: "",
  proposedStartDate: "",
  partnerNotes: "",
};

export function PolicyForm({
  category,
  insurerSlug,
  insurerName,
}: {
  category: string;
  insurerSlug: string;
  insurerName: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [docs, setDocs] = useState<{ label: string; key: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  function addDoc(label: string) {
    return (key: string | null) => {
      setDocs((d) => {
        const rest = d.filter((x) => x.label !== label);
        return key ? [...rest, { label, key }] : rest;
      });
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setSubmitting(true);

    const payload = {
      category,
      insurerSlug,
      planName: form.planName,
      planType: form.planType,
      proposerName: form.proposerName,
      proposerDob: form.proposerDob,
      proposerGender: form.proposerGender,
      proposerMobile: form.proposerMobile,
      proposerEmail: form.proposerEmail,
      proposerPan: form.proposerPan,
      proposerAadhaar: form.proposerAadhaar,
      proposerAddress: form.proposerAddress,
      occupation: form.occupation,
      annualIncome: form.annualIncome || undefined,
      tobaccoUser: form.tobaccoUser === "yes",
      medicalHistory: form.medicalHistory,
      nomineeName: form.nomineeName,
      nomineeRelation: form.nomineeRelation,
      nomineeDob: form.nomineeDob,
      nomineeSharePercent: form.nomineeSharePercent || 100,
      appointeeName: form.appointeeName,
      sumAssured: form.sumAssured,
      premiumAmount: form.premiumAmount,
      premiumFrequency: form.premiumFrequency,
      policyTermYears: form.policyTermYears,
      premiumPayingTermYears: form.premiumPayingTermYears,
      proposedStartDate: form.proposedStartDate,
      documents: docs,
      partnerNotes: form.partnerNotes,
    };

    try {
      const res = await fetch("/api/policies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.issues?.fieldErrors) setFieldErrors(data.issues.fieldErrors);
        setError(data.error || "Could not submit the policy.");
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      router.push(`/dashboard/requests/${data.id}`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <Section title="Plan details" icon="📋">
        <Grid>
          <Field label="Plan / product name" required error={fieldErrors.planName}>
            <input className="input" value={form.planName} onChange={set("planName")} placeholder={`${insurerName} plan`} required />
          </Field>
          <Field label="Plan type" required>
            <select className="input" value={form.planType} onChange={set("planType")}>
              <option value="term">Term</option>
              <option value="endowment">Endowment</option>
              <option value="ulip">ULIP</option>
              <option value="whole-life">Whole life</option>
              <option value="money-back">Money back</option>
              <option value="other">Other</option>
            </select>
          </Field>
        </Grid>
      </Section>

      <Section title="Proposer / insured details" icon="🧑">
        <Grid>
          <Field label="Full name" required error={fieldErrors.proposerName}>
            <input className="input" value={form.proposerName} onChange={set("proposerName")} required />
          </Field>
          <Field label="Date of birth" required error={fieldErrors.proposerDob}>
            <input className="input" type="date" value={form.proposerDob} onChange={set("proposerDob")} required />
          </Field>
          <Field label="Gender" required>
            <select className="input" value={form.proposerGender} onChange={set("proposerGender")}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </Field>
          <Field label="Mobile number" required error={fieldErrors.proposerMobile}>
            <input className="input" value={form.proposerMobile} onChange={set("proposerMobile")} required />
          </Field>
          <Field label="Email">
            <input className="input" type="email" value={form.proposerEmail} onChange={set("proposerEmail")} />
          </Field>
          <Field label="PAN">
            <input className="input uppercase" value={form.proposerPan} onChange={set("proposerPan")} placeholder="ABCDE1234F" />
          </Field>
          <Field label="Aadhaar">
            <input className="input" value={form.proposerAadhaar} onChange={set("proposerAadhaar")} />
          </Field>
          <Field label="Occupation">
            <input className="input" value={form.occupation} onChange={set("occupation")} />
          </Field>
          <Field label="Annual income (₹)">
            <input className="input" type="number" value={form.annualIncome} onChange={set("annualIncome")} />
          </Field>
          <Field label="Tobacco / smoker?">
            <select className="input" value={form.tobaccoUser} onChange={set("tobaccoUser")}>
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </Field>
          <Field label="Address" full>
            <input className="input" value={form.proposerAddress} onChange={set("proposerAddress")} />
          </Field>
          <Field label="Medical history (if any)" full>
            <textarea className="input" rows={2} value={form.medicalHistory} onChange={set("medicalHistory")} />
          </Field>
        </Grid>
      </Section>

      <Section title="Nominee details" icon="👨‍👩‍👧">
        <Grid>
          <Field label="Nominee name" required error={fieldErrors.nomineeName}>
            <input className="input" value={form.nomineeName} onChange={set("nomineeName")} required />
          </Field>
          <Field label="Relationship" required error={fieldErrors.nomineeRelation}>
            <input className="input" value={form.nomineeRelation} onChange={set("nomineeRelation")} placeholder="Spouse / Son / Mother…" required />
          </Field>
          <Field label="Nominee date of birth">
            <input className="input" type="date" value={form.nomineeDob} onChange={set("nomineeDob")} />
          </Field>
          <Field label="Share (%)">
            <input className="input" type="number" min={1} max={100} value={form.nomineeSharePercent} onChange={set("nomineeSharePercent")} />
          </Field>
          <Field label="Appointee (if nominee is a minor)" full>
            <input className="input" value={form.appointeeName} onChange={set("appointeeName")} placeholder="Required if nominee is under 18" />
          </Field>
        </Grid>
      </Section>

      <Section title="Premium & sum assured" icon="💰">
        <Grid>
          <Field label="Sum assured (₹)" required error={fieldErrors.sumAssured}>
            <input className="input" type="number" value={form.sumAssured} onChange={set("sumAssured")} required />
          </Field>
          <Field label="Premium amount (₹)" required error={fieldErrors.premiumAmount}>
            <input className="input" type="number" value={form.premiumAmount} onChange={set("premiumAmount")} required />
          </Field>
          <Field label="Premium frequency" required>
            <select className="input" value={form.premiumFrequency} onChange={set("premiumFrequency")}>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="half-yearly">Half-yearly</option>
              <option value="yearly">Yearly</option>
              <option value="single">Single premium</option>
            </select>
          </Field>
          <Field label="Policy term (years)" required error={fieldErrors.policyTermYears}>
            <input className="input" type="number" value={form.policyTermYears} onChange={set("policyTermYears")} required />
          </Field>
          <Field label="Premium paying term (years)" required error={fieldErrors.premiumPayingTermYears}>
            <input className="input" type="number" value={form.premiumPayingTermYears} onChange={set("premiumPayingTermYears")} required />
          </Field>
          <Field label="Proposed start date">
            <input className="input" type="date" value={form.proposedStartDate} onChange={set("proposedStartDate")} />
          </Field>
        </Grid>
      </Section>

      <Section title="Supporting documents (optional)" icon="📎">
        <div className="grid gap-4 md:grid-cols-3">
          <FileUpload label="Proposer ID proof" folder="policies/docs" accept="image/*,application/pdf" onUploaded={addDoc("ID proof")} />
          <FileUpload label="Income proof" folder="policies/docs" accept="image/*,application/pdf" onUploaded={addDoc("Income proof")} />
          <FileUpload label="Other document" folder="policies/docs" accept="image/*,application/pdf" onUploaded={addDoc("Other")} />
        </div>
      </Section>

      <Section title="Notes for admin (optional)" icon="📝">
        <textarea className="input" rows={3} value={form.partnerNotes} onChange={set("partnerNotes")} placeholder="Anything the admin should know about this submission…" />
      </Section>

      <div className="flex justify-end gap-3">
        <button type="submit" disabled={submitting} className="btn-primary px-8">
          {submitting ? "Submitting…" : "Submit policy request"}
        </button>
      </div>
    </form>
  );
}

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="card p-5">
      <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-slate-900">
        <span>{icon}</span>
        {title}
      </h2>
      {children}
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 md:grid-cols-2">{children}</div>;
}

function Field({
  label,
  required,
  error,
  full,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string[];
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="label">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      {children}
      {error && error.length > 0 && <p className="field-error">{error[0]}</p>}
    </div>
  );
}
