import { redirect } from "next/navigation";
import { getCurrentPartner } from "@/lib/current";
import { publicUrlForKey } from "@/lib/r2";
import { PartnerNav } from "@/components/PartnerNav";

/**
 * Every dashboard page reads live per-request data behind a partner session,
 * so nothing under here may be prerendered or cached.
 */
export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const partner = await getCurrentPartner();
  if (!partner) redirect("/login");

  const avatarUrl = publicUrlForKey(partner.selfieKey);

  return (
    <div className="min-h-screen bg-slate-50">
      <PartnerNav
        name={partner.name}
        avatarUrl={avatarUrl}
        coins={partner.coins ?? 0}
      />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
