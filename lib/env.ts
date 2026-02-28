// Next.js can only inline NEXT_PUBLIC_* vars when the key is a static string
// literal — dynamic bracket access (process.env[name]) returns undefined in
// the browser bundle. Each value must be read with a literal property name.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error(
    "Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL. " +
      "Check your .env.local file or deployment environment settings."
  );
}
if (!supabaseAnonKey) {
  throw new Error(
    "Missing required environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
      "Check your .env.local file or deployment environment settings."
  );
}

export const env = {
  supabaseUrl,
  supabaseAnonKey,
} as const;
