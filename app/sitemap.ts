// app/sitemap.ts
import { listSlugs, getPost } from "@/lib/mdx";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await listSlugs();
  const posts = await Promise.all(slugs.map((slug) => getPost(slug)));

  const blogUrls = posts.map(({ slug, frontmatter }) => ({
    url: `https://freelancemy.com/${slug}`,
    lastModified: frontmatter.last_updated || frontmatter.date,
  }));

  return [
    {
      url: "https://freelancemy.com",
      lastModified: new Date().toISOString(),
    },
    {
      url: "https://freelancemy.com/about",
      lastModified: new Date().toISOString(),
    },
    {
      url: "https://freelancemy.com/contact",
      lastModified: new Date().toISOString(),
    },
    ...blogUrls,
  ];
}
