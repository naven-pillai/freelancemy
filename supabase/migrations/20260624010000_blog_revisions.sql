-- Version history for blog posts. On each content/summary change the previous
-- version is snapshotted here, so an accidental overwrite (e.g. the TinyMCE
-- autosave incident) can be restored instead of lost.
CREATE TABLE IF NOT EXISTS public.blog_revisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id uuid NOT NULL REFERENCES public.blogs(id) ON DELETE CASCADE,
  content text,
  summary text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS blog_revisions_blog_id_created_idx
  ON public.blog_revisions (blog_id, created_at DESC);
