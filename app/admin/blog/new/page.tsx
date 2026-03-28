import { protectRoute } from "@/lib/protectRoute";
import BlogPostForm from "@/components/admin/BlogPostForm";

export default async function NewBlogPage() {
  await protectRoute();

  return <BlogPostForm />;
}
