"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SubmissionActions({
  policyId,
  status,
  partnerName,
  suggestedReward,
  initialNotes,
}: {
  policyId: string;
  status: string;
  partnerName: string;
  suggestedReward: number;
  initialNotes: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState("");
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const [policyNumber, setPolicyNumber] = useState("");
  const [reward, setReward] = useState(String(suggestedReward));
  const [rejectReason, setRejectReason] = useState("");
  const [notes, setNotes] = useState(initialNotes);
  const [confirmCreate, setConfirmCreate] = useState(false);

  async function call(action: string, body: Record<string, unknown>) {
    setBusy(action);
    setMsg(null);
    try {
      const res = await fetch(`/api/admin/policies/${policyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg({ type: "err", text: data.error || "Action failed." });
        return null;
      }
      router.refresh();
      return data;
    } catch {
      setMsg({ type: "err", text: "Something went wrong." });
      return null;
    } finally {
      setBusy("");
    }
  }

  const isFinal = status === "created";

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

      {isFinal ? (
        <div className="card border-emerald-200 bg-emerald-50 p-4">
          <p className="font-semibold text-emerald-800">✅ Policy created</p>
          <p className="mt-1 text-sm text-emerald-700">
            The reward has been credited to {partnerName}. This request is
            complete.
          </p>
        </div>
      ) : (
        <>
          {/* Workflow status */}
          {status === "submitted" && (
            <div className="card p-4">
              <h3 className="mb-1 font-semibold text-slate-900">Start review</h3>
              <p className="mb-3 text-xs text-slate-500">
                Move this request into review while you process it.
              </p>
              <button
                disabled={busy !== ""}
                onClick={() => call("review", { action: "review" })}
                className="btn-secondary w-full"
              >
                {busy === "review" ? "…" : "🔍 Mark under review"}
              </button>
            </div>
          )}

          {/* Create + reward (the reward-before-creation flow) */}
          <div className="card border-brand-200 p-4">
            <h3 className="mb-1 font-semibold text-slate-900">
              Create policy &amp; credit reward
            </h3>
            <p className="mb-3 text-xs text-slate-500">
              Before this policy can be marked as created, you must assign a coin
              reward for {partnerName}. The reward is credited immediately.
            </p>

            <label className="label">Policy number</label>
            <input
              className="input"
              placeholder="e.g. LIC/2026/0012345"
              value={policyNumber}
              onChange={(e) => setPolicyNumber(e.target.value)}
            />

            <label className="label mt-3">
              Reward coins 🪙 <span className="text-red-500">*</span>
            </label>
            <input
              className="input"
              type="number"
              min={1}
              placeholder="Coins to credit"
              value={reward}
              onChange={(e) => setReward(e.target.value)}
            />
            <p className="hint">Reward points — not currency.</p>

            <label className="mt-3 flex items-start gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                className="mt-0.5"
                checked={confirmCreate}
                onChange={(e) => setConfirmCreate(e.target.checked)}
              />
              I confirm the policy number is correct and want to credit{" "}
              <strong>{reward || 0} 🪙</strong> to {partnerName}.
            </label>

            <button
              disabled={
                busy !== "" ||
                !policyNumber.trim() ||
                Number(reward) <= 0 ||
                !confirmCreate
              }
              onClick={async () => {
                const data = await call("create", {
                  action: "create",
                  policyNumber,
                  rewardCoins: Number(reward),
                  adminNotes: notes,
                });
                if (data) {
                  setMsg({
                    type: "ok",
                    text: `Policy created. ${data.rewardCoins} 🪙 credited (new balance ${data.partnerBalance} 🪙).`,
                  });
                }
              }}
              className="btn-success mt-3 w-full"
            >
              {busy === "create" ? "…" : "✓ Create policy & credit reward"}
            </button>
          </div>

          {/* Reject */}
          <div className="card p-4">
            <h3 className="mb-1 font-semibold text-slate-900">Reject</h3>
            <input
              className="input"
              placeholder="Reason for rejection"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <button
              disabled={busy !== ""}
              onClick={() => call("reject", { action: "reject", reason: rejectReason })}
              className="btn-danger mt-2 w-full"
            >
              {busy === "reject" ? "…" : "✕ Reject submission"}
            </button>
          </div>
        </>
      )}

      {/* Admin notes (always available) */}
      <div className="card p-4">
        <h3 className="mb-1 font-semibold text-slate-900">Internal notes</h3>
        <textarea
          className="input"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes visible to the partner on this request…"
        />
        <button
          disabled={busy !== ""}
          onClick={async () => {
            const ok = await call("note", { action: "note", adminNotes: notes });
            if (ok) setMsg({ type: "ok", text: "Notes saved." });
          }}
          className="btn-secondary mt-2 w-full"
        >
          {busy === "note" ? "…" : "Save notes"}
        </button>
      </div>
    </div>
  );
}
