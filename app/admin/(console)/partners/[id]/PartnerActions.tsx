"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function PartnerActions({
  partnerId,
  status,
}: {
  partnerId: string;
  status: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState("");
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [coinAmount, setCoinAmount] = useState("");
  const [coinReason, setCoinReason] = useState("");

  async function call(
    action: string,
    body: Record<string, unknown>,
    endpoint = `/api/admin/partners/${partnerId}`,
    method = "PATCH"
  ) {
    setBusy(action);
    setMsg(null);
    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg({ type: "err", text: data.error || "Action failed." });
        return false;
      }
      router.refresh();
      return true;
    } catch {
      setMsg({ type: "err", text: "Something went wrong." });
      return false;
    } finally {
      setBusy("");
    }
  }

  return (
    <div className="space-y-4">
      {msg && (
        <div
          className={`rounded-lg px-3 py-2 text-sm ${
            msg.type === "ok"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {msg.text}
        </div>
      )}

      {/* Verification */}
      <div className="card p-4">
        <h3 className="mb-1 font-semibold text-slate-900">Verification</h3>
        <p className="mb-3 text-xs text-slate-500">
          Current status: <span className="font-semibold">{status}</span>
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            disabled={busy !== "" || status === "verified"}
            onClick={() => call("verify", { action: "verify" })}
            className="btn-success"
          >
            {busy === "verify" ? "…" : "✓ Verify account"}
          </button>
        </div>
        <div className="mt-3">
          <input
            className="input"
            placeholder="Reason for rejection (optional)"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
          <button
            disabled={busy !== ""}
            onClick={() =>
              call("reject", { action: "reject", reason: rejectReason })
            }
            className="btn-danger mt-2"
          >
            {busy === "reject" ? "…" : "✕ Reject"}
          </button>
        </div>
      </div>

      {/* Reset password */}
      <div className="card p-4">
        <h3 className="mb-1 font-semibold text-slate-900">Reset password</h3>
        <p className="mb-3 text-xs text-slate-500">
          Set a new login password for this partner.
        </p>
        <input
          className="input"
          type="text"
          placeholder="New password (min 8 chars)"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button
          disabled={busy !== "" || newPassword.length < 8}
          onClick={async () => {
            const ok = await call("reset", {
              action: "reset-password",
              newPassword,
            });
            if (ok) {
              setNewPassword("");
              setMsg({ type: "ok", text: "Password updated." });
            }
          }}
          className="btn-secondary mt-2"
        >
          {busy === "reset" ? "…" : "Update password"}
        </button>
      </div>

      {/* Adjust coins */}
      <div className="card p-4">
        <h3 className="mb-1 font-semibold text-slate-900">Adjust coins 🪙</h3>
        <p className="mb-3 text-xs text-slate-500">
          Credit (positive) or debit (negative) reward coins. Every change is
          logged in the partner&apos;s history.
        </p>
        <div className="flex gap-2">
          <input
            className="input w-32"
            type="number"
            placeholder="+/- coins"
            value={coinAmount}
            onChange={(e) => setCoinAmount(e.target.value)}
          />
          <input
            className="input flex-1"
            placeholder="Reason"
            value={coinReason}
            onChange={(e) => setCoinReason(e.target.value)}
          />
        </div>
        <button
          disabled={busy !== "" || !coinAmount || !coinReason}
          onClick={async () => {
            const ok = await call(
              "coins",
              { amount: Number(coinAmount), reason: coinReason },
              `/api/admin/partners/${partnerId}/coins`,
              "POST"
            );
            if (ok) {
              setCoinAmount("");
              setCoinReason("");
              setMsg({ type: "ok", text: "Coin balance updated." });
            }
          }}
          className="btn-primary mt-2"
        >
          {busy === "coins" ? "…" : "Apply adjustment"}
        </button>
      </div>
    </div>
  );
}
