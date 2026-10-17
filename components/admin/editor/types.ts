import type { BlogStatus } from "@/types/blog";

/** Everything the editor edits, flattened from a `blogs` row. */
export type PostFormState = {
  title: string;
  slug: string;
  summary: string;
  content: string;
  status: BlogStatus;
  /** ISO timestamp, or null to use "now" at publish time. */
  date: string | null;
  is_featured: boolean;
  /** Primary category (the site shows the first one). */
  category: string | null;
  tags: string[];
  author: string;
  seo_title: string;
  description: string;
  canonical_url: string;
  featured_image: string;
};

export type UpdateField = <K extends keyof PostFormState>(
  key: K,
  value: PostFormState[K]
) => void;
