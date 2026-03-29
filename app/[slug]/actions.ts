"use server";

import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";

export type CommentFormState = {
  success: boolean;
  message: string;
} | null;

// In-memory rate limiter (per IP, 1 comment per 60s).
// Note: resets on deployment. For high-traffic production use, consider a
// persistent store (Redis, Supabase RPC, etc.).
const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_MS = 60_000;

// Periodically clean expired entries to prevent unbounded memory growth
function pruneRateLimitMap() {
  const now = Date.now();
  for (const [ip, ts] of rateLimitMap) {
    if (now - ts > RATE_LIMIT_MS) rateLimitMap.delete(ip);
  }
}
setInterval(pruneRateLimitMap, 5 * 60_000).unref();

export async function submitComment(
  slug: string,
  _prevState: CommentFormState,
  formData: FormData
): Promise<CommentFormState> {
  const name = (formData.get("name") as string)?.trim();
  const comment = (formData.get("comment") as string)?.trim();

  if (!name || !comment) {
    return { success: false, message: "Name and comment are required." };
  }
  if (name.length > 100) {
    return { success: false, message: "Name must be 100 characters or fewer." };
  }
  if (comment.length > 2000) {
    return { success: false, message: "Comment must be 2000 characters or fewer." };
  }
  if (!slug || typeof slug !== "string") {
    return { success: false, message: "Invalid post." };
  }

  // Server-side rate limiting by IP
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const lastSubmit = rateLimitMap.get(ip);
  if (lastSubmit && Date.now() - lastSubmit < RATE_LIMIT_MS) {
    return { success: false, message: "Please wait a minute before submitting another comment." };
  }

  const supabase = await createClient();

  const { error } = await supabase.from("comments").insert({
    name,
    comment,
    slug,
    is_approved: false,
  });

  if (error) {
    return { success: false, message: "Failed to submit comment. Please try again." };
  }

  rateLimitMap.set(ip, Date.now());
  return { success: true, message: "Comment submitted! It will appear after review." };
}
