import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/current";
import { AdminNav } from "@/components/AdminNav";

/**
 * Every console page reads live per-request data behind an admin session,
 * so nothing under here may be prerendered or cached.
 */
export const dynamic = "force-dynamic";

export default async function AdminConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-slate-100 md:flex">
      <AdminNav adminName={admin.name} />
      <main className="flex-1 md:h-screen md:overflow-y-auto">
        <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
      </main>
    </div>
  );
}
