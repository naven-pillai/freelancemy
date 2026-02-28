'use client';

import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/types/supabase";
import { env } from "@/lib/env";

export const createClient = () =>
  createBrowserClient<Database>(
    env.supabaseUrl,
    env.supabaseAnonKey
  );

// If you want a singleton/exported instance (optional but common):
// export const supabase = createClient();