-- Create blogs table for admin-managed blog posts
CREATE TABLE IF NOT EXISTS blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  featured_image TEXT,
  author TEXT DEFAULT 'Naven Pillai',
  categories TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  date TIMESTAMPTZ,
  last_updated TIMESTAMPTZ,
  canonical_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast slug lookups (used by public pages)
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs (slug);

-- Index for listing published posts sorted by date
CREATE INDEX IF NOT EXISTS idx_blogs_status_date ON blogs (status, date DESC);

-- RLS policies
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- Public can read published posts
CREATE POLICY "Public can read published blogs"
  ON blogs FOR SELECT
  USING (status = 'published');

-- Service role (admin) can do everything (bypasses RLS)
