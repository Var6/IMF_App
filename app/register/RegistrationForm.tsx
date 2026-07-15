"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FileUpload } from "@/components/FileUpload";

type Keys = {
  selfieKey: string | null;
  aadhaarImageKey: string | null;
  panImageKey: string | null;
  marksheet10Key: string | null;
  marksheet12Key: string | null;
};

const initialForm = {
  name: "",
  email: "",
  mobile: "",
  password: "",
  aadhaarNumber: "",
  panNumber: "",
  dob: "",
  gender: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  accountHolderName: "",
  accountNumber: "",
  ifsc: "",
  bankName: "",
  branch: "",
};

export function RegistrationForm() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [keys, setKeys] = useState<Keys>({
    selfieKey: null,
    aadhaarImageKey: null,
    panImageKey: null,
    marksheet10Key: null,
    marksheet12Key: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    if (!keys.selfieKey) {
      setError("A selfie is required.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSubmitting(true);
    const payload = {
      name: form.name,
      email: form.email,
      mobile: form.mobile,
      password: form.password,
      aadhaarNumber: form.aadhaarNumber,
      panNumber: form.panNumber,
      selfieKey: keys.selfieKey,
      aadhaarImageKey: keys.aadhaarImageKey || "",
      panImageKey: keys.panImageKey || "",
      dob: form.dob,
      gender: form.gender,
      address: form.address,
      city: form.city,
      state: form.state,
      pincode: form.pincode,
      bank: {
        accountHolderName: form.accountHolderName,
        accountNumber: form.accountNumber,
        ifsc: form.ifsc,
        bankName: form.bankName,
        branch: form.branch,
      },
      marksheet10Key: keys.marksheet10Key || "",
      marksheet12Key: keys.marksheet12Key || "",
    };

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.issues?.fieldErrors) setFieldErrors(data.issues.fieldErrors);
        setError(data.error || "Registration failed. Please check your details.");
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      router.push("/pending");
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

      {/* Account & identity */}
      <Section title="Account & personal details" icon="👤">
        <Grid>
          <Field label="Full name" required error={fieldErrors.name}>
            <input className="input" value={form.name} onChange={set("name")} placeholder="Ramesh Kumar" required />
          </Field>
          <Field label="Email address" required error={fieldErrors.email}>
            <input className="input" type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" required />
          </Field>
          <Field label="Mobile number" required error={fieldErrors.mobile}>
            <input className="input" value={form.mobile} onChange={set("mobile")} placeholder="10-digit mobile" required />
          </Field>
          <Field label="Password" required error={fieldErrors.password}>
            <input className="input" type="password" value={form.password} onChange={set("password")} placeholder="Min 8 characters" required />
          </Field>
          <Field label="Date of birth">
            <input className="input" type="date" value={form.dob} onChange={set("dob")} />
          </Field>
          <Field label="Gender">
            <select className="input" value={form.gender} onChange={set("gender")}>
              <option value="">Select…</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </Field>
        </Grid>
      </Section>

      {/* KYC */}
      <Section title="KYC verification" icon="🪪">
        <Grid>
          <Field label="Aadhaar number" required error={fieldErrors.aadhaarNumber}>
            <input className="input" value={form.aadhaarNumber} onChange={set("aadhaarNumber")} placeholder="12-digit Aadhaar" required />
          </Field>
          <Field label="PAN number" required error={fieldErrors.panNumber}>
            <input className="input uppercase" value={form.panNumber} onChange={set("panNumber")} placeholder="ABCDE1234F" required />
          </Field>
        </Grid>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <FileUpload
            label="Selfie photo"
            required
            folder="registration/selfies"
            hint="A clear photo of your face. JPG/PNG, max 8MB."
            onUploaded={(k) => setKeys((s) => ({ ...s, selfieKey: k }))}
          />
          <FileUpload
            label="Aadhaar card image"
            folder="registration/aadhaar"
            accept="image/*,application/pdf"
            hint="Optional but recommended."
            onUploaded={(k) => setKeys((s) => ({ ...s, aadhaarImageKey: k }))}
          />
          <FileUpload
            label="PAN card image"
            folder="registration/pan"
            accept="image/*,application/pdf"
            hint="Optional but recommended."
            onUploaded={(k) => setKeys((s) => ({ ...s, panImageKey: k }))}
          />
        </div>
      </Section>

      {/* Bank details */}
      <Section title="Bank account details" icon="🏦">
        <Grid>
          <Field label="Account holder name" required error={fieldErrors["bank.accountHolderName"]}>
            <input className="input" value={form.accountHolderName} onChange={set("accountHolderName")} required />
          </Field>
          <Field label="Account number" required error={fieldErrors["bank.accountNumber"]}>
            <input className="input" value={form.accountNumber} onChange={set("accountNumber")} required />
          </Field>
          <Field label="IFSC code" required error={fieldErrors["bank.ifsc"]}>
            <input className="input uppercase" value={form.ifsc} onChange={set("ifsc")} placeholder="SBIN0001234" required />
          </Field>
          <Field label="Bank name" required error={fieldErrors["bank.bankName"]}>
            <input className="input" value={form.bankName} onChange={set("bankName")} required />
          </Field>
          <Field label="Branch">
            <input className="input" value={form.branch} onChange={set("branch")} />
          </Field>
        </Grid>
      </Section>

      {/* Address */}
      <Section title="Address" icon="📍">
        <Grid>
          <Field label="Address" full>
            <input className="input" value={form.address} onChange={set("address")} />
          </Field>
          <Field label="City">
            <input className="input" value={form.city} onChange={set("city")} />
          </Field>
          <Field label="State">
            <input className="input" value={form.state} onChange={set("state")} />
          </Field>
          <Field label="Pincode">
            <input className="input" value={form.pincode} onChange={set("pincode")} />
          </Field>
        </Grid>
      </Section>

      {/* Education (optional) */}
      <Section title="Education documents (optional)" icon="🎓">
        <div className="grid gap-4 md:grid-cols-2">
          <FileUpload
            label="10th marksheet"
            folder="registration/marksheets"
            accept="image/*,application/pdf"
            onUploaded={(k) => setKeys((s) => ({ ...s, marksheet10Key: k }))}
          />
          <FileUpload
            label="12th marksheet"
            folder="registration/marksheets"
            accept="image/*,application/pdf"
            onUploaded={(k) => setKeys((s) => ({ ...s, marksheet12Key: k }))}
          />
        </div>
      </Section>

      <div className="flex flex-col items-center gap-3">
        <p className="max-w-md text-center text-xs text-slate-500">
          By submitting, you confirm your details are accurate and you agree to
          our{" "}
          <Link href="/terms" className="font-medium text-brand-600 underline">
            Terms &amp; Conditions
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="font-medium text-brand-600 underline">
            Privacy Policy
          </Link>
          .
        </p>
        <button type="submit" disabled={submitting} className="btn-primary w-full md:w-auto md:px-10">
          {submitting ? "Submitting…" : "Submit registration"}
        </button>
        <p className="text-sm text-slate-500">
          Already registered?{" "}
          <Link href="/login" className="font-semibold text-brand-600">
            Log in
          </Link>
        </p>
      </div>
    </form>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
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
