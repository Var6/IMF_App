import Link from "next/link";
import { Logo } from "@/components/Logo";

export function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <Logo />
          <Link href="/" className="text-sm text-slate-500 hover:text-brand-600">
            ← Home
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
        <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
        <p className="mt-1 text-sm text-slate-500">Last updated: {updated}</p>
        <div className="legal mt-8 space-y-6 text-sm leading-relaxed text-slate-700">
          {children}
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-6 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} Citizen Savings &amp; Credit IMF Pvt. Ltd.
          ·{" "}
          <Link href="/terms" className="hover:text-brand-600">
            Terms
          </Link>{" "}
          ·{" "}
          <Link href="/privacy" className="hover:text-brand-600">
            Privacy
          </Link>
        </div>
      </footer>
    </div>
  );
}

export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-2 text-lg font-semibold text-slate-900">{heading}</h2>
      <div className="space-y-2">{children}</div>
    </section>
  );
}
