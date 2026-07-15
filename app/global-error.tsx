"use client";

/**
 * Global error boundary — catches errors in the root layout itself, so it must
 * render its own <html>/<body> and cannot rely on globals.css being present.
 * Styles are inlined to guarantee it renders correctly.
 */
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f6f7fb",
          fontFamily:
            "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
          color: "#0f172a",
        }}
      >
        <div style={{ maxWidth: 440, textAlign: "center", padding: 24 }}>
          <div style={{ fontSize: 56 }}>⚠️</div>
          <p style={{ fontSize: 64, fontWeight: 800, color: "#4f46e5", margin: "8px 0" }}>
            500
          </p>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 8px" }}>
            Something went wrong
          </h1>
          <p style={{ color: "#64748b", margin: "0 0 24px" }}>
            An unexpected error occurred on our side. Please try again in a
            moment.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button
              onClick={() => reset()}
              style={{
                background: "#4f46e5",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "10px 20px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            <a
              href="/"
              style={{
                background: "#fff",
                color: "#334155",
                border: "1px solid #cbd5e1",
                borderRadius: 8,
                padding: "10px 20px",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Go to home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
