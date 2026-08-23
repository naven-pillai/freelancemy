"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { sendContactEmail } from "@/lib/mailer";
import { checkRateLimit, rateLimitKey } from "@/lib/rate-limit";

export type ContactFormState = {
  success: boolean;
  message: string;
} | null;

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  // Honeypot: a hidden field real users never fill. If it's set, it's a bot —
  // pretend success so we don't tip it off, but store nothing.
  if (((formData.get("company") as string) ?? "").trim() !== "") {
    return { success: true, message: "Message sent! We'll get back to you soon." };
  }

  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const message = (formData.get("message") as string)?.trim();

  if (!name || !email || !message) {
    return { success: false, message: "All fields are required." };
  }

  // RFC 5321 practical email validation: local@domain.tld
  // Requires a proper TLD (2+ chars), rejects leading/trailing dots and double dots
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return { success: false, message: "Please enter a valid email address." };
  }

  if (name.length > 100) {
    return { success: false, message: "Name must be 100 characters or fewer." };
  }
  if (email.length > 254) {
    return { success: false, message: "Email address is too long." };
  }
  if (message.length > 5000) {
    return { success: false, message: "Message must be 5000 characters or fewer." };
  }

  // Persistent rate limit: 3 messages per 10 minutes per IP.
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { allowed } = await checkRateLimit(rateLimitKey("contact", ip), 3, 10 * 60 * 1000);
  if (!allowed) {
    return { success: false, message: "Too many messages. Please try again later." };
  }

  const supabase = await createClient();

  // contact_messages table exists in DB but not in auto-generated types
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("contact_messages")
    .insert({ name, email, message });

  if (error) {
    return { success: false, message: "Failed to send message. Please try again." };
  }

  // Notify info@freelancemy.com. The message is already stored in Supabase, so
  // an email failure must not fail the submission — sendContactEmail logs and
  // swallows its own errors.
  await sendContactEmail({ name, email, message });

  return { success: true, message: "Message sent! We'll get back to you soon." };
}
