import { createHash } from "crypto";

/**
 * Build a Gravatar avatar URL for an email. Uses the "identicon" default so
 * every commenter gets a unique, deterministic avatar even without a Gravatar
 * account. Only the hashed email is ever sent to the client (standard Gravatar
 * behaviour) — never the raw address.
 */
export function gravatarUrl(email: string | null | undefined, size = 80): string {
  const normalized = (email ?? "").trim().toLowerCase();
  const hash = normalized
    ? createHash("md5").update(normalized).digest("hex")
    : "";
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;
}
