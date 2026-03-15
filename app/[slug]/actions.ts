"use server";

import { createClient } from "@/lib/supabase/server";

export type CommentFormState = {
  success: boolean;
  message: string;
} | null;

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

  return { success: true, message: "Comment submitted! It will appear after review." };
}
