/**
 * One-time migration: convert existing blog posts from Markdown to HTML so the
 * whole blog runs on the TinyMCE/HTML pipeline.
 *
 * Safe by default: runs a DRY RUN and writes nothing unless you pass --apply.
 * Before any write it saves every original post to scripts/backups/, and it
 * only touches posts whose content is still Markdown (idempotent).
 *
 *   npx tsx scripts/migrate-blog-md-to-html.ts            # dry run
 *   npx tsx scripts/migrate-blog-md-to-html.ts --apply    # convert + write
 */
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import { createClient } from "@supabase/supabase-js";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeExternalLinks from "rehype-external-links";
import rehypeStringify from "rehype-stringify";
import { sanitize, looksLikeHtml } from "../lib/sanitize";

const APPLY = process.argv.includes("--apply");

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeSlug)
  .use(rehypeExternalLinks, {
    target: "_blank",
    rel: ["nofollow", "noopener", "noreferrer"],
  })
  .use(rehypeStringify);

async function mdToHtml(md: string): Promise<string> {
  const file = await processor.process(md);
  return sanitize(String(file));
}

async function main() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );

  const { data: posts, error } = await supabase
    .from("blogs")
    .select("id, slug, content");
  if (error) {
    console.error("Failed to fetch blogs:", error.message);
    process.exit(1);
  }

  const all = posts ?? [];
  const toConvert = all.filter(
    (p) => typeof p.content === "string" && p.content.trim() && !looksLikeHtml(p.content)
  );

  console.log(`Total posts: ${all.length}`);
  console.log(`Already HTML (skipped): ${all.length - toConvert.length}`);
  console.log(`Markdown to convert: ${toConvert.length}`);
  console.log(APPLY ? "\nMODE: APPLY (will write)\n" : "\nMODE: DRY RUN (no writes) — pass --apply to write\n");

  if (APPLY && toConvert.length > 0) {
    const dir = path.resolve(process.cwd(), "scripts/backups");
    fs.mkdirSync(dir, { recursive: true });
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupPath = path.join(dir, `blogs-md-backup-${stamp}.json`);
    fs.writeFileSync(backupPath, JSON.stringify(toConvert, null, 2));
    console.log(`Backup written: ${backupPath}\n`);
  }

  let converted = 0;
  let failed = 0;
  for (const post of toConvert) {
    try {
      const html = await mdToHtml(post.content as string);
      console.log(
        `• ${post.slug}: ${(post.content as string).length} md → ${html.length} html`
      );
      if (APPLY) {
        const { error: upErr } = await supabase
          .from("blogs")
          .update({ content: html })
          .eq("id", post.id);
        if (upErr) throw upErr;
      }
      converted++;
    } catch (err) {
      failed++;
      console.error(
        `✗ ${post.slug}: conversion failed — left as Markdown (${
          err instanceof Error ? err.message : "unknown"
        })`
      );
    }
  }

  console.log(
    `\nDone. ${APPLY ? "Converted" : "Would convert"}: ${converted}, failed: ${failed}.`
  );
}

main().catch((e) => {
  console.error("threw:", e);
  process.exit(1);
});
