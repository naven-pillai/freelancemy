// app/sitemap.ts
import { listSlugs, getPost } from "@/lib/mdx";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = listSlugs();
  const posts = await Promise.all(slugs.map((slug) => getPost(slug)));

  const blogUrls = posts.map(({ slug, frontmatter }) => ({
    url: `https://freelancemy.com/${slug}`,
    lastModified: new Date(
      frontmatter.last_updated || frontmatter.date || new Date()
    ).toISOString(),
  }));

  return [
    {
      url: "https://freelancemy.com",
      lastModified: "2026-03-15",
    },
    {
      url: "https://freelancemy.com/about",
      lastModified: "2026-03-15",
    },
    {
      url: "https://freelancemy.com/contact",
      lastModified: "2026-03-15",
    },
    ...blogUrls,
  ];
}
