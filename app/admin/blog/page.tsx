import { protectRoute } from "@/lib/protectRoute";
import { getSupabaseAdmin } from "@/lib/supabase/service";
import BlogListClient from "./BlogListClient";

export default async function BlogListPage() {
  await protectRoute();

  const { data: blogs } = await getSupabaseAdmin()
    .from("blogs")
    .select("id, title, slug, status, date, categories, author, created_at")
    .order("created_at", { ascending: false });

  return <BlogListClient blogs={blogs ?? []} />;
}
