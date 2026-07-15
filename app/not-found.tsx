import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Logo />
          <Link href="/" className="text-sm text-slate-500 hover:text-brand-600">
            ← Home
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-md text-center">
          <p className="text-7xl font-extrabold text-brand-600">404</p>
          <h1 className="mt-3 text-2xl font-bold text-slate-900">
            Page not found
          </h1>
          <p className="mt-2 text-slate-500">
            The page you&apos;re looking for doesn&apos;t exist or may have moved.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/" className="btn-primary">
              Go to home
            </Link>
            <Link href="/login" className="btn-secondary">
              Partner login
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
