"use client";

import { useRef, useState } from "react";

interface Props {
  label: string;
  folder: string;
  accept?: string;
  required?: boolean;
  hint?: string;
  onUploaded: (key: string | null) => void;
}

/**
 * Single-file uploader. Uploads immediately to /api/upload and reports the
 * stored R2 object key back to the parent via onUploaded.
 */
export function FileUpload({
  label,
  folder,
  accept = "image/*",
  required,
  hint,
  onUploaded,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">(
    "idle"
  );
  const [fileName, setFileName] = useState<string>("");
  const [error, setError] = useState<string>("");

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setStatus("uploading");
    setError("");
    onUploaded(null);

    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setStatus("done");
      onUploaded(data.key);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Upload failed");
      onUploaded(null);
    }
  }

  return (
    <div>
      <label className="label">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <div
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer items-center gap-3 rounded-lg border border-dashed px-4 py-3 text-sm transition-colors ${
          status === "error"
            ? "border-red-300 bg-red-50"
            : status === "done"
              ? "border-emerald-300 bg-emerald-50"
              : "border-slate-300 bg-slate-50 hover:border-brand-400"
        }`}
      >
        <span className="text-lg">
          {status === "uploading" ? "⏳" : status === "done" ? "✅" : "📎"}
        </span>
        <span className="flex-1 truncate text-slate-600">
          {status === "uploading"
            ? "Uploading…"
            : fileName || "Click to choose a file"}
        </span>
        <span className="rounded-md bg-white px-2 py-1 text-xs font-semibold text-brand-600 shadow-sm">
          Browse
        </span>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleChange}
      />
      {error && <p className="field-error">{error}</p>}
      {hint && !error && <p className="hint">{hint}</p>}
    </div>
  );
}
