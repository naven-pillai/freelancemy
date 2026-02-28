-- Create contact_messages table for storing contact form submissions
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT        NOT NULL CHECK (char_length(name) <= 100),
  email       TEXT        NOT NULL CHECK (char_length(email) <= 254),
  message     TEXT        NOT NULL CHECK (char_length(message) <= 5000),
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit (public contact form)
CREATE POLICY "Allow public inserts" ON public.contact_messages
  FOR INSERT
  WITH CHECK (true);

-- Only the service role (admin) can read submissions — anon users cannot
-- To read submissions, use the Supabase dashboard or a service-role key
