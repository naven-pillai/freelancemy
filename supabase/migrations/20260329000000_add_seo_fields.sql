-- Add SEO title field to blogs table
-- seo_title: overrides title in <title> tag and search results (max 60 chars)
-- The existing description column serves as the meta description (max 160 chars)
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS seo_title TEXT;
