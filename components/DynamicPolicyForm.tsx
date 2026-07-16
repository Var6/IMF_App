"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileUpload } from "@/components/FileUpload";
import { getServiceForm, type FormField } from "@/lib/forms";

export function DynamicPolicyForm({
  category,
  insurerSlug,
  insurerName,
}: {
  category: string;
  insurerSlug: string;
  insurerName: string;
}) {
  const router = useRouter();
  const form = getServiceForm(category);

  const [details, setDetails] = useState<Record<string, string>>({});
  const [planName, setPlanName] = useState("");
  const [notes, setNotes] = useState("");
  const [docs, setDocs] = useState<{ label: string; key: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  if (!form) {
    return (
      <div className="card p-6 text-sm text-slate-600">
        No form is configured for this service yet.
      </div>
    );
  }

  const set = (name: string) => (value: string) =>
    setDetails((d) => ({ ...d, [name]: value }));

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
    try {
      const res = await fetch("/api/policies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          insurerSlug,
          planName,
          details,
          documents: docs,
          partnerNotes: notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.fieldErrors) setFieldErrors(data.fieldErrors);
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

      {/* Plan / product name */}
      <div className="card p-5">
        <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-slate-900">
          <span>📋</span> Plan
        </h2>
        <label className="label">Plan / product name (optional)</label>
        <input
          className="input"
          value={planName}
          onChange={(e) => setPlanName(e.target.value)}
          placeholder={`${insurerName} plan name, if known`}
        />
      </div>

      {form.sections.map((section) => (
        <div key={section.title} className="card p-5">
          <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-slate-900">
            {section.icon && <span>{section.icon}</span>}
            {section.title}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {section.fields.map((field) => (
              <Field
                key={field.name}
                field={field}
                value={details[field.name] ?? ""}
                onChange={set(field.name)}
                error={fieldErrors[field.name]}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Documents */}
      <div className="card p-5">
        <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-slate-900">
          <span>📎</span> Supporting documents (optional)
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <FileUpload label="Document 1" folder="policies/docs" accept="image/*,application/pdf" onUploaded={addDoc("Document 1")} />
          <FileUpload label="Document 2" folder="policies/docs" accept="image/*,application/pdf" onUploaded={addDoc("Document 2")} />
          <FileUpload label="Document 3" folder="policies/docs" accept="image/*,application/pdf" onUploaded={addDoc("Document 3")} />
        </div>
      </div>

      {/* Notes */}
      <div className="card p-5">
        <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-slate-900">
          <span>📝</span> Notes for admin (optional)
        </h2>
        <textarea
          className="input"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Anything the admin should know about this submission…"
        />
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={submitting} className="btn-primary px-8">
          {submitting ? "Submitting…" : "Submit policy request"}
        </button>
      </div>
    </form>
  );
}

function Field({
  field,
  value,
  onChange,
  error,
}: {
  field: FormField;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <div className={field.full ? "md:col-span-2" : ""}>
      <label className="label">
        {field.label}
        {field.required && <span className="text-red-500"> *</span>}
      </label>
      {field.type === "select" ? (
        <select className="input" value={value} onChange={(e) => onChange(e.target.value)}>
          <option value="">Select…</option>
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : field.type === "textarea" ? (
        <textarea
          className="input"
          rows={3}
          value={value}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className="input"
          type={field.type}
          value={value}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}
