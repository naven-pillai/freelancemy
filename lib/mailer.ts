import "server-only";
import { Resend } from "resend";
import { CONTACT_EMAIL } from "@/lib/constants";

/**
 * Sends the contact-form notification to CONTACT_EMAIL via Resend.
 *
 * Setup:
 *   - RESEND_API_KEY: your Resend API key (required to actually send)
 *   - RESEND_FROM_EMAIL: verified sender, e.g. "FreelanceMY <contact@freelancemy.com>"
 *     (must be a domain you've verified in Resend). Falls back to onboarding@resend.dev
 *     which only delivers to your own Resend account email — fine for a first test.
 *
 * Returns { ok: true } on success or when email is not configured (so the
 * contact form still succeeds — the message is already stored in Supabase).
 */
export async function sendContactEmail(input: {
  name: string;
  email: string;
  message: string;
}): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;

  // Email is optional: if it isn't configured, don't block the submission.
  if (!apiKey) return { ok: true };

  const from = process.env.RESEND_FROM_EMAIL ?? "FreelanceMY <onboarding@resend.dev>";
  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from,
      to: CONTACT_EMAIL,
      replyTo: input.email,
      subject: `New contact message from ${input.name}`,
      text: `Name: ${input.name}\nEmail: ${input.email}\n\n${input.message}`,
    });

    if (error) {
      console.error("Resend contact email failed:", error);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (err) {
    console.error("Resend contact email threw:", err);
    return { ok: false, error: err instanceof Error ? err.message : "unknown" };
  }
}
