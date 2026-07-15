import Link from "next/link";
import { AuthShell } from "@/components/AuthShell";

export const metadata = { title: "Registration submitted" };

export default function PendingPage() {
  return (
    <AuthShell>
      <div className="card p-8 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-amber-100 text-3xl">
          ⏳
        </div>
        <h1 className="mt-5 text-2xl font-bold text-slate-900">
          Your account is under verification
        </h1>
        <p className="mt-3 text-slate-600">
          Thank you for registering as a partner. Our admin team will review
          your details and KYC documents. Once your account is{" "}
          <span className="font-semibold text-emerald-600">verified</span>, you
          can log in with the email and password you just set.
        </p>

        <div className="mt-6 rounded-xl bg-slate-50 p-4 text-left text-sm text-slate-600">
          <p className="font-semibold text-slate-800">What happens next?</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>Admin reviews your registration and documents.</li>
            <li>Your account is approved (or you&apos;re contacted for more info).</li>
            <li>You log in and start submitting policies to earn reward coins.</li>
          </ol>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <Link href="/login" className="btn-primary">
            Go to login
          </Link>
          <Link href="/" className="text-sm text-slate-500 hover:text-brand-600">
            Back to home
          </Link>
        </div>
      </div>
    </AuthShell>
  );
}
