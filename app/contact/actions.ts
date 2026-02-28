"use server";

import { createClient } from "@/lib/supabase/server";

export type ContactFormState = {
  success: boolean;
  message: string;
} | null;

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const message = (formData.get("message") as string)?.trim();

  if (!name || !email || !message) {
    return { success: false, message: "All fields are required." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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

  const supabase = await createClient();

  // contact_messages table — run supabase/migrations/20260228000000_contact_messages.sql first
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("contact_messages")
    .insert({ name, email, message });

  if (error) {
    return { success: false, message: "Failed to send message. Please try again." };
  }

  return { success: true, message: "Message sent! We'll get back to you soon." };
}
