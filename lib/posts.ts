import { cache } from "react";
import { supabaseAdmin } from "@/lib/supabase/service";
import type { BlogFrontmatter } from "@/types/blog";

export const getPost = cache(async function getPost(slug: string): Promise<{
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
});

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

/** Single batch query for homepage cards — no content fetched */
export async function getAllPostCards() {
  const { data, error } = await supabaseAdmin
    .from("blogs")
    .select("slug, title, description, featured_image, date, last_updated, categories")
    .eq("status", "published")
    .order("date", { ascending: false });

  if (error || !data) return [];

  return data.map((p) => ({
    slug: p.slug,
    frontmatter: {
      title: p.title,
      description: p.description ?? "",
      featured_image: p.featured_image ?? undefined,
      date: p.date,
      last_updated: p.last_updated ?? undefined,
      categories: p.categories ?? undefined,
    },
  }));
}

/** Lightweight query for sidebar — single query, no content */
export async function getLatestPostsMeta(excludeSlug?: string, limit = 5) {
  const { data, error } = await supabaseAdmin
    .from("blogs")
    .select("slug, title, featured_image, date")
    .eq("status", "published")
    .order("date", { ascending: false })
    .limit(limit + 1); // fetch one extra in case we need to exclude current

  if (error || !data) return [];

  return data
    .filter((p) => p.slug !== excludeSlug)
    .slice(0, limit)
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      featured_image: p.featured_image,
      date: p.date,
    }));
}
