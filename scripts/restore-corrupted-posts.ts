/**
 * Restore the 2 posts corrupted by the TinyMCE autosave, from the
 * hand-reconstructed Markdown in scripts/backups/. Backs up the current
 * (corrupted) content first, then writes the recovered Markdown.
 *
 *   npx tsx scripts/restore-corrupted-posts.ts            # dry run
 *   npx tsx scripts/restore-corrupted-posts.ts --apply    # write
 */
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import { createClient } from "@supabase/supabase-js";

const APPLY = process.argv.includes("--apply");
const SLUGS = [
  "ai-replace-freelancers-malaysia",
  "zoho-solo-for-malaysian-freelancers",
];

async function main() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );

  const dir = path.resolve(process.cwd(), "scripts/backups");
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const corruptedBackup: Record<string, unknown>[] = [];

  for (const slug of SLUGS) {
    const mdPath = path.join(dir, `${slug}.md`);
    if (!fs.existsSync(mdPath)) {
      console.error(`✗ ${slug}: no recovered file at ${mdPath}`);
      continue;
    }
    const recovered = fs.readFileSync(mdPath, "utf8").trim();

    const { data: current, error } = await supabase
      .from("blogs")
      .select("id, slug, content")
      .eq("slug", slug)
      .single();
    if (error || !current) {
      console.error(`✗ ${slug}: fetch failed — ${error?.message}`);
      continue;
    }

    corruptedBackup.push(current);
    console.log(
      `• ${slug}: current ${(current.content || "").length} chars (corrupted) → recovered ${recovered.length} chars (markdown)`
    );

    if (APPLY) {
      const { error: upErr } = await supabase
        .from("blogs")
        .update({ content: recovered })
        .eq("id", current.id);
      if (upErr) console.error(`  ✗ update failed: ${upErr.message}`);
      else console.log(`  ✓ restored`);
    }
  }

  if (APPLY && corruptedBackup.length) {
    const backupPath = path.join(dir, `corrupted-before-restore-${stamp}.json`);
    fs.writeFileSync(backupPath, JSON.stringify(corruptedBackup, null, 2));
    console.log(`\nCorrupted originals backed up: ${backupPath}`);
  }
  console.log(APPLY ? "\nDone (applied)." : "\nDRY RUN — pass --apply to write.");
}

main().catch((e) => {
  console.error("threw:", e);
  process.exit(1);
});
