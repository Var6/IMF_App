"use client";

import { useEffect, useState } from "react";

/**
 * Loading indicator shown by route-segment loading.tsx files while a page's
 * server data is being fetched. Animates a progress bar with a percentage so
 * navigation always feels responsive even when Atlas/cold starts are slow.
 *
 * The percentage is an eased fake-progress counter (climbs toward ~95% and
 * stops) — the component simply unmounts when the real page is ready.
 */
export function LoadingScreen({
  label = "Loading…",
  fullScreen = false,
}: {
  label?: string;
  fullScreen?: boolean;
}) {
  const [pct, setPct] = useState(8);

  useEffect(() => {
    const id = setInterval(() => {
      setPct((p) => {
        if (p >= 95) return p;
        const step = p < 55 ? 8 : p < 80 ? 3 : 1;
        return Math.min(95, p + step);
      });
    }, 180);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className={`flex ${
        fullScreen ? "min-h-screen" : "min-h-[60vh]"
      } items-center justify-center px-4`}
    >
      <div className="w-full max-w-xs text-center">
        <div className="relative mx-auto h-16 w-16">
          <span className="absolute inset-0 animate-spin rounded-full border-4 border-brand-100 border-t-brand-600" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Citizen IMF"
            className="absolute inset-2 h-12 w-12 rounded-full object-contain"
          />
        </div>

        <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-brand-600 transition-[width] duration-200 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-2 text-sm font-bold text-brand-700">{pct}%</p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </div>
  );
}
