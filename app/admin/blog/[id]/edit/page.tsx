import { protectRoute } from "@/lib/protectRoute";
import { getSupabaseAdmin } from "@/lib/supabase/service";
import { notFound } from "next/navigation";
import BlogPostForm from "@/components/admin/BlogPostForm";

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await protectRoute();
  const { id } = await params;

  const { data: blog } = await getSupabaseAdmin()
    .from("blogs")
    .select("*")
    .eq("id", id)
    .single();

  if (!blog) return notFound();

  return <BlogPostForm initialData={blog} isEdit />;
}
