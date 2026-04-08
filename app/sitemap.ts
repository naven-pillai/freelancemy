import { getSupabaseAdmin } from "@/lib/supabase/service";
import { SITE_URL } from "@/lib/constants";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: posts } = await getSupabaseAdmin()
    .from("blogs")
    .select("slug, date, last_updated")
    .eq("status", "published")
    .order("date", { ascending: false });

  const now = new Date();

  const blogUrls = (posts ?? []).map((p) => {
    const modified = new Date(p.last_updated || p.date || now);
    const daysSinceUpdate = Math.floor(
      (now.getTime() - modified.getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      url: `${SITE_URL}/${p.slug}`,
      lastModified: modified.toISOString(),
      priority: daysSinceUpdate < 30 ? 0.8 : 0.6,
      changeFrequency: (daysSinceUpdate < 14 ? "weekly" : "monthly") as "weekly" | "monthly",
    };
  });

  const latestPostDate = posts?.[0]
    ? new Date(posts[0].last_updated || posts[0].date).toISOString()
    : now.toISOString();

  return [
    {
      url: SITE_URL,
      lastModified: latestPostDate,
      priority: 1.0,
      changeFrequency: "daily" as const,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: "2026-02-01T00:00:00.000Z",
      priority: 0.6,
      changeFrequency: "monthly" as const,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: "2026-02-01T00:00:00.000Z",
      priority: 0.5,
      changeFrequency: "monthly" as const,
    },
    {
      url: `${SITE_URL}/privacy-policy`,
      lastModified: "2026-03-01T00:00:00.000Z",
      priority: 0.2,
      changeFrequency: "yearly" as const,
    },
    {
      url: `${SITE_URL}/terms-conditions`,
      lastModified: "2026-03-01T00:00:00.000Z",
      priority: 0.2,
      changeFrequency: "yearly" as const,
    },
    ...blogUrls,
  ];
}
