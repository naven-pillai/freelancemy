export type BlogFrontmatter = {
    title: string;
    description: string;
    date: string;
    last_updated?: string;
    featured_image?: string;
    author?: string;
    categories?: string[];
    tags?: string[];
    status?: "draft" | "published";
    canonical_url?: string;
    seo_title?: string;
  };

export type BlogStatus = "draft" | "published";

/** A row of the Supabase `blogs` table as the admin reads it. */
export type BlogRow = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  summary: string | null;
  content: string;
  featured_image: string | null;
  author: string | null;
  categories: string[] | null;
  tags: string[] | null;
  status: BlogStatus;
  date: string | null;
  last_updated: string | null;
  canonical_url: string | null;
  seo_title: string | null;
  is_featured: boolean | null;
  created_at: string;
};
