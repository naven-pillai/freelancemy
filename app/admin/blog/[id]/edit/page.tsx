import { protectRoute } from "@/lib/protectRoute";
import { getSupabaseAdmin } from "@/lib/supabase/service";
import { listCategoryNames } from "@/lib/posts";
import { notFound } from "next/navigation";
import PostEditor from "@/components/admin/editor/PostEditor";
import type { BlogRow } from "@/types/blog";

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await protectRoute();
  const { id } = await params;

  const [{ data: blog }, categoryOptions] = await Promise.all([
    getSupabaseAdmin().from("blogs").select("*").eq("id", id).single(),
    listCategoryNames(),
  ]);

  if (!blog) return notFound();

  return (
    <PostEditor
      mode="edit"
      initialPost={blog as BlogRow}
      categoryOptions={categoryOptions}
    />
  );
}
