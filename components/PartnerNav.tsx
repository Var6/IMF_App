"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { Avatar } from "@/components/Avatar";
import { LogoutButton } from "@/components/LogoutButton";

const links = [
  { href: "/dashboard", label: "Services", exact: true },
  { href: "/dashboard/requests", label: "My Requests" },
  { href: "/dashboard/profile", label: "Profile" },
];

export function PartnerNav({
  name,
  avatarUrl,
  coins,
}: {
  name: string;
  avatarUrl: string | null;
  coins: number;
}) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-8">
          <Logo href="/dashboard" />
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => {
              const active = l.exact
                ? pathname === l.href
                : pathname.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-brand-50 text-brand-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/profile"
            className="flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1.5 text-sm font-bold text-amber-700"
            title="Your reward coins"
          >
            {coins.toLocaleString("en-IN")} 🪙
          </Link>
          <Link href="/dashboard/profile" className="flex items-center gap-2">
            <Avatar name={name} src={avatarUrl} />
            <span className="hidden text-sm font-medium text-slate-700 sm:block">
              {name}
            </span>
          </Link>
          <LogoutButton className="btn-secondary hidden sm:inline-flex" />
        </div>
      </div>

      {/* Mobile nav */}
      <nav className="flex items-center gap-1 border-t border-slate-100 px-4 py-2 md:hidden">
        {links.map((l) => {
          const active = l.exact
            ? pathname === l.href
            : pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`flex-1 rounded-lg px-3 py-2 text-center text-sm font-medium ${
                active ? "bg-brand-50 text-brand-700" : "text-slate-600"
              }`}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
