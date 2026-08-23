/**
 * Central error reporter. Logs structured errors so server-side failures show
 * up in the hosting platform's runtime logs (e.g. Vercel), and client-side
 * failures show up in the browser console.
 *
 * To wire a real error-monitoring service later (Sentry, etc.), install its SDK
 * and forward from the single marked spot below — every error boundary already
 * calls this, so nothing else has to change.
 */
type ErrorContext = {
  digest?: string;
  where?: string;
  [key: string]: unknown;
};

export function reportError(error: unknown, context: ErrorContext = {}): void {
  const payload = {
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    ...context,
    at: new Date().toISOString(),
    runtime: typeof window === "undefined" ? "server" : "client",
  };

  // Server logs are captured by the hosting platform; keep them one-line JSON.
  if (typeof window === "undefined") {
    console.error("[error]", JSON.stringify(payload));
  } else {
    console.error("[error]", payload);
  }

  // ── Plug in a monitoring service here, e.g.:
  //   import * as Sentry from "@sentry/nextjs";
  //   Sentry.captureException(error, { extra: context });
}
