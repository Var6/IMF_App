"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "@/components/LogoutButton";

const links = [
  { href: "/admin", label: "Dashboard", icon: "📊", exact: true },
  { href: "/admin/partners", label: "Partners", icon: "👥" },
  { href: "/admin/submissions", label: "Submissions", icon: "📄" },
];

export function AdminNav({ adminName }: { adminName: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-slate-800 bg-slate-900 text-slate-200 md:h-screen md:w-64 md:border-b-0 md:border-r">
      <div className="flex items-center gap-2 px-5 py-4">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 font-bold text-white">
          🛡️
        </span>
        <div>
          <p className="text-sm font-bold text-white">Admin Console</p>
          <p className="text-xs text-slate-400">IMF Partner Portal</p>
        </div>
      </div>

      <nav className="flex gap-1 px-3 md:mt-4 md:flex-col">
        {links.map((l) => {
          const active = l.exact
            ? pathname === l.href
            : pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-brand-600 text-white"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              <span>{l.icon}</span>
              {l.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto hidden border-t border-slate-800 p-4 md:block">
        <p className="mb-2 text-xs text-slate-400">Signed in as</p>
        <p className="mb-3 text-sm font-semibold text-white">{adminName}</p>
        <LogoutButton className="btn-secondary w-full !bg-slate-800 !text-white !border-slate-700 hover:!bg-slate-700" />
      </div>
    </aside>
  );
}
