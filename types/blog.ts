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
    canonical_url?: string; // ✅ added
  };
  