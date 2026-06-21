import { protectRoute } from "@/lib/protectRoute";
import { getSupabaseAdmin } from "@/lib/supabase/service";
import CommentsClient from "./CommentsClient";

export default async function CommentsPage() {
  await protectRoute();

  const supabase = getSupabaseAdmin();
  const [{ data: comments }, { data: blogs }] = await Promise.all([
    supabase.from("comments").select("*").order("created_at", { ascending: false }),
    supabase.from("blogs").select("slug, title"),
  ]);

  const titleBySlug: Record<string, string> = {};
  for (const blog of blogs ?? []) {
    if (blog.slug) titleBySlug[blog.slug] = blog.title;
  }

  return <CommentsClient comments={comments ?? []} titleBySlug={titleBySlug} />;
}
