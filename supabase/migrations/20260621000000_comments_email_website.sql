-- Add email and website fields to comments.
-- Both are nullable so existing rows remain valid; the app enforces email as
-- required at submission time. website is optional and rendered as a
-- rel="nofollow" anchor on the commenter's name.
ALTER TABLE public.comments
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS website text;
