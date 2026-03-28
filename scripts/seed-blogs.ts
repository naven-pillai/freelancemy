/**
 * Seed script: reads existing .md files from /content/ and inserts them
 * into the Supabase `blogs` table.
 *
 * Usage:
 *   npx tsx scripts/seed-blogs.ts
 *
 * Requires: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

const CONTENT_DIR = path.join(process.cwd(), "content");

async function seed() {
  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));

  console.log(`Found ${files.length} posts to seed.\n`);

  for (const file of files) {
    const slug = file.replace(/\.(md|mdx)$/, "");
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
    const { content, data } = matter(raw);

    const payload = {
      title: data.title || slug,
      slug,
      description: data.description || "",
      content,
      featured_image: data.featured_image || null,
      author: data.author || "Naven Pillai",
      categories: data.categories || [],
      tags: data.tags || [],
      status: data.status || "published",
      date: data.date ? new Date(data.date).toISOString() : null,
      last_updated: data.last_updated
        ? new Date(data.last_updated).toISOString()
        : null,
      canonical_url: data.canonical_url || null,
    };

    // Upsert by slug (in case we run this multiple times)
    const { error } = await supabase
      .from("blogs")
      .upsert(payload, { onConflict: "slug" });

    if (error) {
      console.error(`  ✗ ${slug}: ${error.message}`);
    } else {
      console.log(`  ✓ ${slug}`);
    }
  }

  console.log("\nDone!");
}

seed().catch(console.error);
