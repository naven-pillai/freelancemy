import { protectRoute } from "@/lib/protectRoute";
import { listCategoryNames } from "@/lib/posts";
import PostEditor from "@/components/admin/editor/PostEditor";

export default async function NewBlogPage() {
  await protectRoute();
  const categoryOptions = await listCategoryNames();

  return <PostEditor mode="new" categoryOptions={categoryOptions} />;
}
