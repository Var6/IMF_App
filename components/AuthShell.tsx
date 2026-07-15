import Link from "next/link";
import { Logo } from "@/components/Logo";

export function AuthShell({
  children,
  wide = false,
}: {
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Logo />
          <Link href="/" className="text-sm text-slate-500 hover:text-brand-600">
            ← Back to home
          </Link>
        </div>
      </header>
      <main className="flex flex-1 items-start justify-center px-4 py-10">
        <div className={wide ? "w-full max-w-3xl" : "w-full max-w-md"}>
          {children}
        </div>
      </main>
    </div>
  );
}
