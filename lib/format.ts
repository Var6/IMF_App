/** Small formatting helpers used across the UI. */

export function formatCoins(n: number | undefined | null): string {
  const v = Number(n ?? 0);
  return `${v.toLocaleString("en-IN")} 🪙`;
}

export function formatNumber(n: number | undefined | null): string {
  return Number(n ?? 0).toLocaleString("en-IN");
}

export function formatDate(d: string | Date | undefined | null): string {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(d: string | Date | undefined | null): string {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  verified: "Verified",
  rejected: "Rejected",
  submitted: "Submitted",
  under_review: "Under review",
  created: "Created",
};

export function statusLabel(status: string): string {
  return STATUS_LABELS[status] ?? status;
}

export function statusClasses(status: string): string {
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
