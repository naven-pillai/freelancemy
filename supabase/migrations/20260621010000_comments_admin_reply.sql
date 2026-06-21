-- Allow a single admin/author reply per comment, shown nested beneath it on
-- the public post. Both nullable; set together when the admin replies.
ALTER TABLE public.comments
  ADD COLUMN IF NOT EXISTS admin_reply text,
  ADD COLUMN IF NOT EXISTS admin_reply_at timestamptz;
