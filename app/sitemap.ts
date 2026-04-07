import { getSupabaseAdmin } from "@/lib/supabase/service";
import { SITE_URL } from "@/lib/constants";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: posts } = await getSupabaseAdmin()
    .from("blogs")
    .select("slug, date, last_updated")
    .eq("status", "published")
    .order("date", { ascending: false });

  const blogUrls = (posts ?? []).map((p) => ({
    url: `${SITE_URL}/${p.slug}`,
    lastModified: new Date(p.last_updated || p.date || new Date()).toISOString(),
    priority: 0.8 as const,
    changeFrequency: "daily" as const,
  }));

  const latestPostDate = posts?.[0]
    ? new Date(posts[0].last_updated || posts[0].date).toISOString()
    : new Date().toISOString();

  return [
    {
      url: SITE_URL,
      lastModified: latestPostDate,
      priority: 1.0,
      changeFrequency: "daily",
    },
    {
      url: `${SITE_URL}/about`,
      priority: 0.6,
      changeFrequency: "monthly",
    },
    {
      url: `${SITE_URL}/contact`,
      priority: 0.6,
      changeFrequency: "monthly",
    },
    {
      url: `${SITE_URL}/privacy-policy`,
      priority: 0.3,
      changeFrequency: "yearly",
    },
    {
      url: `${SITE_URL}/terms-conditions`,
      priority: 0.3,
      changeFrequency: "yearly",
    },
    ...blogUrls,
  ];
}
