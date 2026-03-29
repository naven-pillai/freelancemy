import { getAllPosts } from "@/lib/posts";
import { SITE_URL } from "@/lib/constants";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();

  // Use the most recent post date as a proxy for when the homepage last changed
  const latestPostDate = posts.reduce((latest, { frontmatter }) => {
    const d = new Date(frontmatter.last_updated || frontmatter.date || 0);
    return d > latest ? d : latest;
  }, new Date(0));

  const blogUrls = posts.map(({ slug, frontmatter }) => ({
    url: `${SITE_URL}/${slug}`,
    lastModified: new Date(
      frontmatter.last_updated || frontmatter.date || new Date()
    ).toISOString(),
    priority: 0.7 as const,
    changeFrequency: "monthly" as const,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: latestPostDate.toISOString(),
      priority: 1.0,
      changeFrequency: "weekly",
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: latestPostDate.toISOString(),
      priority: 0.8,
      changeFrequency: "monthly",
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: latestPostDate.toISOString(),
      priority: 0.8,
      changeFrequency: "monthly",
    },
    {
      url: `${SITE_URL}/privacy-policy`,
      lastModified: latestPostDate.toISOString(),
      priority: 0.3,
      changeFrequency: "yearly",
    },
    {
      url: `${SITE_URL}/terms-conditions`,
      lastModified: latestPostDate.toISOString(),
      priority: 0.3,
      changeFrequency: "yearly",
    },
    ...blogUrls,
  ];
}
