-- Rich-text summary shown in a highlighted box at the top of a post,
-- above the body. Nullable; posts without a summary simply omit the box.
ALTER TABLE public.blogs
  ADD COLUMN IF NOT EXISTS summary text;
