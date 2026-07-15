import { AuthShell } from "@/components/AuthShell";
import { RegistrationForm } from "./RegistrationForm";

export const metadata = { title: "Partner Registration Portal" };

export default function RegisterPage() {
  return (
    <AuthShell wide>
      <div className="mb-6 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700">
          Partner Registration Portal
        </span>
        <h1 className="mt-3 text-2xl font-bold text-slate-900">
          Create your partner account
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Fill in your details below. Fields marked{" "}
          <span className="text-red-500">*</span> are mandatory. Your account
          will be reviewed by our team before it is activated.
        </p>
      </div>
      <RegistrationForm />
    </AuthShell>
  );
}
