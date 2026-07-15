import Link from "next/link";

export function Logo({
  href = "/",
  light = false,
}: {
  href?: string;
  light?: boolean;
}) {
  return (
    <Link href={href} className="inline-flex items-center gap-2">
      <span
        className={`grid h-9 w-9 place-items-center rounded-xl font-bold ${
          light ? "bg-white text-brand-700" : "bg-brand-600 text-white"
        }`}
      >
        IMF
      </span>
      <span
        className={`text-lg font-bold tracking-tight ${
          light ? "text-white" : "text-slate-900"
        }`}
      >
        Partner Portal
      </span>
    </Link>
  );
}

export function StatusBadge({ status, label }: { status: string; label: string }) {
  return <span className={`badge ${badgeClass(status)}`}>{label}</span>;
}

function badgeClass(status: string): string {
  switch (status) {
    case "verified":
    case "created":
      return "bg-emerald-100 text-emerald-700";
    case "pending":
    case "submitted":
      return "bg-amber-100 text-amber-700";
    case "under_review":
      return "bg-blue-100 text-blue-700";
    case "rejected":
      return "bg-red-100 text-red-700";
    default:
      return "bg-slate-100 text-slate-600";
  }
}
