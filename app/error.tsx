"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";

/**
 * Route-level error boundary. The root layout is still intact here, so we can
 * use Tailwind and shared components.
 */
export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
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
          <div className="text-6xl">⚠️</div>
          <p className="mt-2 text-6xl font-extrabold text-brand-600">500</p>
          <h1 className="mt-3 text-2xl font-bold text-slate-900">
            Something went wrong
          </h1>
          <p className="mt-2 text-slate-500">
            An unexpected error occurred. You can try again or head back home.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button onClick={() => reset()} className="btn-primary">
              Try again
            </button>
            <Link href="/" className="btn-secondary">
              Go to home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
