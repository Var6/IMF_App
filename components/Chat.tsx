"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface Message {
  id: string;
  senderRole: "partner" | "admin";
  senderName: string;
  text: string;
  createdAt: string;
}

/**
 * Per-policy request chat. Both partner and admin use this component; messages
 * from the current viewer's role are right-aligned. Polls every 5s.
 */
export function Chat({
  policyId,
  currentRole,
}: {
  policyId: string;
  currentRole: "partner" | "admin";
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/policies/${policyId}/chat`, {
        cache: "no-store",
      });
      if (!res.ok) return;
      const data = await res.json();
      setMessages(data.messages ?? []);
      setLoaded(true);
    } catch {
      /* ignore transient errors */
    }
  }, [policyId]);

  useEffect(() => {
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, [load]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    setSending(true);
    try {
      const res = await fetch(`/api/policies/${policyId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: value }),
      });
      const data = await res.json();
      if (res.ok && data.message) {
        setMessages((m) => [...m, data.message]);
        setText("");
      }
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="card flex h-[520px] flex-col">
      <div className="border-b border-slate-100 px-4 py-3">
        <h3 className="font-semibold text-slate-900">💬 Request conversation</h3>
        <p className="text-xs text-slate-500">
          Ask questions about this submission. The {currentRole === "partner" ? "admin" : "partner"} will reply here.
        </p>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {!loaded && <p className="text-sm text-slate-400">Loading…</p>}
        {loaded && messages.length === 0 && (
          <p className="py-8 text-center text-sm text-slate-400">
            No messages yet. Start the conversation below.
          </p>
        )}
        {messages.map((m) => {
          const mine = m.senderRole === currentRole;
          return (
            <div
              key={m.id}
              className={`flex flex-col ${mine ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                  mine
                    ? "rounded-br-sm bg-brand-600 text-white"
                    : "rounded-bl-sm bg-slate-100 text-slate-800"
                }`}
              >
                {m.text}
              </div>
              <span className="mt-1 text-[11px] text-slate-400">
                {m.senderRole === "admin" ? "🛡️ " : ""}
                {m.senderName} ·{" "}
                {new Date(m.createdAt).toLocaleString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      <form onSubmit={send} className="flex gap-2 border-t border-slate-100 p-3">
        <input
          className="input flex-1"
          placeholder="Type a message…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" disabled={sending} className="btn-primary">
          Send
        </button>
      </form>
    </div>
  );
}
