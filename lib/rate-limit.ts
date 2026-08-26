import "server-only";
import { createHash } from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase/service";

/**
 * Persistent, cross-instance rate limiter backed by a Supabase table (so it
 * survives deploys and works across serverless instances, unlike an in-memory
 * Map). Fails open if the store is unavailable — never blocks real users.
 */
export async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<{ allowed: boolean }> {
  try {
    const supabase = getSupabaseAdmin();
    const since = new Date(Date.now() - windowMs).toISOString();

    // Drop this key's expired entries so the table stays bounded.
    await supabase.from("rate_limits").delete().eq("key", key).lt("created_at", since);

    const { count } = await supabase
      .from("rate_limits")
      .select("id", { count: "exact", head: true })
      .eq("key", key)
      .gte("created_at", since);

    if ((count ?? 0) >= limit) return { allowed: false };

    await supabase.from("rate_limits").insert({ key });
    return { allowed: true };
  } catch {
    return { allowed: true };
  }
}

/** Build a rate-limit key from an action name + client IP (IP is hashed). */
export function rateLimitKey(action: string, ip: string): string {
  const hash = createHash("sha256").update(ip).digest("hex").slice(0, 32);
  return `${action}:${hash}`;
}
