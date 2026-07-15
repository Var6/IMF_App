import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/current";
import { AdminNav } from "@/components/AdminNav";

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
