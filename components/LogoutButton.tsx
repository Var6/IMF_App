"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton({
  className = "btn-secondary",
  label = "Log out",
}: {
  className?: string;
  label?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <button onClick={logout} disabled={loading} className={className}>
      {loading ? "…" : label}
    </button>
  );
}
