"use client";

import { useEffect } from "react";
import { reportError } from "@/lib/report-error";

/**
 * Catches errors thrown in the root layout itself (which the normal error.tsx
 * boundaries can't reach). Must render its own <html>/<body>.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    reportError(error, { where: "global", digest: error.digest });
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          fontFamily:
            "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          margin: 0,
          background: "#f9fafb",
          color: "#111827",
        }}
      >
        <div style={{ textAlign: "center", padding: "1rem", maxWidth: 420 }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: 12 }}>
            Something went wrong
          </h1>
          <p style={{ color: "#6b7280", marginBottom: 24 }}>
            We ran into an unexpected error. Please try again.
          </p>
          <button
            onClick={reset}
            style={{
              padding: "10px 20px",
              background: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
