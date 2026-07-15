import Link from "next/link";

export function Logo({
  href = "/",
  light = false,
}: {
  href?: string;
  light?: boolean;
}) {
  return (
    <Link href={href} className="inline-flex items-center gap-2.5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.png"
        alt="Citizen IMF"
        className="h-10 w-10 shrink-0 rounded-full object-contain"
      />
      <span className="flex flex-col leading-tight">
        <span
          className={`text-base font-extrabold tracking-tight ${
            light ? "text-white" : "text-slate-900"
          }`}
        >
          Citizen IMF
        </span>
        <span
          className={`text-[11px] font-medium ${
            light ? "text-white/70" : "text-slate-500"
          }`}
        >
          Partner Portal
        </span>
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
