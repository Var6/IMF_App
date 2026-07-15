import Link from "next/link";
import { AdminLoginForm } from "./AdminLoginForm";

export const metadata = { title: "Admin Login" };

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center text-white">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-brand-600 text-xl font-bold">
            🛡️
          </div>
          <h1 className="mt-4 text-2xl font-bold">Admin Console</h1>
          <p className="text-sm text-slate-400">
            Restricted access — administrators only.
          </p>
        </div>
        <div className="card p-8">
          <AdminLoginForm />
        </div>
        <p className="mt-6 text-center text-sm text-slate-400">
          <Link href="/" className="hover:text-white">
            ← Back to portal home
          </Link>
        </p>
      </div>
    </div>
  );
}
