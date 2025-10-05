import { listSlugs, getPost } from "@/lib/mdx";

export async function getAllPostsMeta() {
  const slugs = await listSlugs();
  const posts = await Promise.all(slugs.map((slug) => getPost(slug)));
  return posts.map(({ slug, frontmatter }) => ({
    slug,
    title: frontmatter.title,
  }));
}
