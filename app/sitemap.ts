import { getAllPosts } from "@/lib/posts";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();

  const blogUrls = posts.map(({ slug, frontmatter }) => ({
    url: `https://freelancemy.com/${slug}`,
    lastModified: new Date(
      frontmatter.last_updated || frontmatter.date || new Date()
    ).toISOString(),
    priority: 0.7 as const,
    changeFrequency: "monthly" as const,
  }));

  return [
    {
      url: "https://freelancemy.com",
      lastModified: new Date().toISOString(),
      priority: 1.0,
      changeFrequency: "weekly",
    },
    {
      url: "https://freelancemy.com/about",
      lastModified: "2026-03-15",
      priority: 0.8,
      changeFrequency: "monthly",
    },
    {
      url: "https://freelancemy.com/contact",
      lastModified: "2026-03-15",
      priority: 0.8,
      changeFrequency: "monthly",
    },
    {
      url: "https://freelancemy.com/privacy-policy",
      lastModified: "2026-03-15",
      priority: 0.3,
      changeFrequency: "yearly",
    },
    {
      url: "https://freelancemy.com/terms-conditions",
      lastModified: "2026-03-15",
      priority: 0.3,
      changeFrequency: "yearly",
    },
    ...blogUrls,
  ];
}
