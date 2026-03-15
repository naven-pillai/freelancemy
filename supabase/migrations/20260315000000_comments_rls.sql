-- Ensure RLS is enabled on the comments table.
-- Run this migration if the comments table already exists without RLS,
-- or adapt to CREATE TABLE IF NOT EXISTS if you need to create it fresh.

-- Enable Row Level Security
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Anonymous users can INSERT new comments (pending approval)
CREATE POLICY "Allow public inserts" ON public.comments
  FOR INSERT
  WITH CHECK (true);

-- Anonymous users can only SELECT approved comments
CREATE POLICY "Allow reading approved comments" ON public.comments
  FOR SELECT
  USING (is_approved = true);

-- No UPDATE or DELETE for anonymous users.
-- Only the service role (Supabase dashboard or admin backend) can
-- approve, edit, or delete comments.
