-- Persistent rate-limit store for the contact and comment forms. Each row is
-- one accepted submission for a (hashed IP + action) key; expired rows are
-- pruned on access, so the table stays small.
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS rate_limits_key_created_idx
  ON public.rate_limits (key, created_at);
