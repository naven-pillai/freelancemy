import { supabaseAdmin } from "@/lib/supabase/service";
import type { BlogFrontmatter } from "@/types/blog";

export async function getPost(slug: string): Promise<{
  slug: string;
  frontmatter: BlogFrontmatter;
  content: string;
}> {
  const { data, error } = await supabaseAdmin
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !data) {
    throw new Error(`Post not found for slug: ${slug}`);
  }

  const frontmatter: BlogFrontmatter = {
    title: data.title,
    description: data.description ?? "",
    date: data.date ?? data.created_at,
    last_updated: data.last_updated ?? undefined,
    featured_image: data.featured_image ?? undefined,
    author: data.author ?? undefined,
    categories: data.categories ?? undefined,
    tags: data.tags ?? undefined,
    status: data.status as "draft" | "published",
    canonical_url: data.canonical_url ?? undefined,
    seo_title: data.seo_title ?? undefined,
  };

  return { slug: data.slug, frontmatter, content: data.content };
}

export async function listSlugs(): Promise<string[]> {
  const { data, error } = await supabaseAdmin
    .from("blogs")
    .select("slug")
    .eq("status", "published")
    .order("date", { ascending: false });

  if (error || !data) return [];

  return data.map((row) => row.slug);
}

export async function getAllPosts() {
  const slugs = await listSlugs();
  const posts = await Promise.all(slugs.map((slug) => getPost(slug)));
  return posts;
}

export async function getAllPostsMeta() {
  const posts = await getAllPosts();
  return posts.map(({ slug, frontmatter }) => ({
    slug,
    title: frontmatter.title,
  }));
}
