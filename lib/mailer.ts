import "server-only";
import nodemailer from "nodemailer";
import { CONTACT_EMAIL } from "@/lib/constants";

/**
 * Sends the contact-form notification to CONTACT_EMAIL via Zoho SMTP.
 *
 * Setup (Zoho Mail):
 *   - SMTP_USER: your Zoho mailbox, e.g. info@freelancemy.com
 *   - SMTP_PASS: a Zoho *app-specific password* (Zoho → Settings → Security →
 *     App Passwords). Don't use your main account password.
 *   - SMTP_HOST: defaults to smtp.zoho.com. Use your data-center host if
 *     different (smtp.zoho.eu / smtp.zoho.in / smtp.zoho.com.au / …).
 *   - SMTP_PORT: defaults to 465 (SSL). Use 587 for STARTTLS.
 *
 * Sending through Zoho means the mail originates from your own authorized
 * server (SPF/DKIM aligned), so it lands in the inbox reliably.
 *
 * Returns { ok: true } on success or when SMTP is not configured, so the
 * contact form still succeeds — the message is already stored in Supabase.
 */
export async function sendContactEmail(input: {
  name: string;
  email: string;
  message: string;
}): Promise<{ ok: boolean; error?: string }> {
  const host = process.env.SMTP_HOST ?? "smtp.zoho.com";
  const port = Number(process.env.SMTP_PORT ?? 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  // Email is optional: if it isn't configured, don't block the submission.
  if (!user || !pass) {
    console.warn(
      "[contact-email] skipped: SMTP not configured " +
        `(SMTP_USER=${user ? "set" : "missing"}, SMTP_PASS=${pass ? "set" : "missing"})`
    );
    return { ok: true };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // SSL on 465, STARTTLS on 587
    auth: { user, pass },
  });

  try {
    await transporter.sendMail({
      // Zoho requires the From to be the authenticated mailbox (no spoofing).
      from: `FreelanceMY Contact <${user}>`,
      to: CONTACT_EMAIL,
      replyTo: input.email,
      subject: `New contact message from ${input.name}`,
      text: `Name: ${input.name}\nEmail: ${input.email}\n\n${input.message}`,
    });
    console.log(`[contact-email] sent to ${CONTACT_EMAIL} via ${host}`);
    return { ok: true };
  } catch (err) {
    console.error("[contact-email] Zoho SMTP send failed:", err);
    return { ok: false, error: err instanceof Error ? err.message : "unknown" };
  }
}
