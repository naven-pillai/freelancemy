-- Add is_featured flag to blogs for highlighting posts on the homepage
ALTER TABLE blogs
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_blogs_featured_date
  ON blogs (is_featured, date DESC)
  WHERE status = 'published';
