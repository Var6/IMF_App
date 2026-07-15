import { AuthShell } from "@/components/AuthShell";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Partner Login" };

export default function LoginPage() {
  return (
    <AuthShell>
      <div className="card p-8">
        <h1 className="text-2xl font-bold text-slate-900">Partner login</h1>
        <p className="mt-1 text-sm text-slate-500">
          Welcome back. Log in to submit policies and track your rewards.
        </p>
        <LoginForm />
      </div>
    </AuthShell>
  );
}
