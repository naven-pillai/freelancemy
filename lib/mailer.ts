import "server-only";
import nodemailer from "nodemailer";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/constants";

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

/** Escape user input before interpolating into HTML. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Build the branded HTML body for a contact submission. */
function renderHtml(input: {
  name: string;
  email: string;
  message: string;
  sentAt: string;
}): string {
  const name = escapeHtml(input.name);
  const email = escapeHtml(input.email);
  const message = escapeHtml(input.message).replace(/\r?\n/g, "<br>");

  return `<!-- ${SITE_NAME} contact form -->
<div style="background:#f4f4f7;padding:24px 12px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
    <tr>
      <td style="background:#2563eb;padding:20px 28px;">
        <span style="color:#ffffff;font-size:18px;font-weight:700;letter-spacing:-0.01em;">${SITE_NAME}</span>
        <span style="color:#bfdbfe;font-size:13px;"> &middot; Contact form</span>
      </td>
    </tr>
    <tr>
      <td style="padding:26px 28px 4px;">
        <h1 style="margin:0;font-size:20px;color:#111827;">New contact message</h1>
        <p style="margin:6px 0 0;font-size:13px;color:#6b7280;">Received ${escapeHtml(input.sentAt)}</p>
      </td>
    </tr>
    <tr>
      <td style="padding:14px 28px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:6px 0;font-size:13px;color:#6b7280;width:70px;vertical-align:top;">Name</td>
            <td style="padding:6px 0;font-size:14px;color:#111827;font-weight:600;">${name}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;font-size:13px;color:#6b7280;vertical-align:top;">Email</td>
            <td style="padding:6px 0;font-size:14px;"><a href="mailto:${email}" style="color:#2563eb;text-decoration:none;">${email}</a></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:16px 28px 4px;">
        <div style="font-size:13px;color:#6b7280;margin-bottom:8px;">Message</div>
        <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px;font-size:14px;line-height:1.6;color:#374151;">${message}</div>
      </td>
    </tr>
    <tr>
      <td style="padding:16px 28px 26px;">
        <p style="margin:0;font-size:13px;color:#6b7280;">Just reply to this email to respond to ${name} directly.</p>
      </td>
    </tr>
    <tr>
      <td style="background:#f9fafb;padding:14px 28px;border-top:1px solid #e5e7eb;">
        <p style="margin:0;font-size:12px;color:#9ca3af;">Sent from the freelancemy.com contact form.</p>
      </td>
    </tr>
  </table>
</div>`;
}

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

  const sentAt = new Date().toLocaleString("en-MY", {
    timeZone: "Asia/Kuala_Lumpur",
    dateStyle: "medium",
    timeStyle: "short",
  });

  // Strip newlines from the name so it can't inject email headers.
  const safeName = input.name.replace(/[\r\n]+/g, " ").trim();

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // SSL on 465, STARTTLS on 587
    auth: { user, pass },
  });

  try {
    await transporter.sendMail({
      // Zoho requires the From to be the authenticated mailbox (no spoofing).
      from: `${SITE_NAME} Contact <${user}>`,
      to: CONTACT_EMAIL,
      replyTo: `${safeName} <${input.email}>`,
      subject: `New contact message from ${safeName}`,
      // Plain-text fallback for clients that don't render HTML.
      text: `New contact message (${sentAt})\n\nName: ${input.name}\nEmail: ${input.email}\n\n${input.message}\n\n— Sent from the freelancemy.com contact form`,
      html: renderHtml({ ...input, name: safeName, sentAt }),
    });
    console.log(`[contact-email] sent to ${CONTACT_EMAIL} via ${host}`);
    return { ok: true };
  } catch (err) {
    console.error("[contact-email] Zoho SMTP send failed:", err);
    return { ok: false, error: err instanceof Error ? err.message : "unknown" };
  }
}
