/**
 * Repair links inside stored posts (content + summary) with the same rules the
 * site applies at render time (lib/sanitize.ts → normalizeLinkAttribs):
 *
 *   - "ezbiz.ssm.gov.my" (no scheme) → "https://ezbiz.ssm.gov.my"
 *   - internal links lose rel="nofollow" and the trailing slash
 *
 * Backs up the original rows to scripts/backups/ (gitignored) before writing.
 *
 *   npx tsx scripts/fix-content-links.ts            # dry run, prints a diff
 *   npx tsx scripts/fix-content-links.ts --apply    # write
 */
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import { createClient } from "@supabase/supabase-js";
import { sanitize } from "../lib/sanitize";

const APPLY = process.argv.includes("--apply");
const ANCHOR_RE = /<a\b[^>]*>/gi;

type Row = {
  id: string;
  slug: string;
  status: string;
  content: string | null;
  summary: string | null;
};

function anchors(html: string): string[] {
  return html.match(ANCHOR_RE) ?? [];
}

/** Everything except the <a ...> opening tags, to detect non-link changes. */
function withoutAnchors(html: string): string {
  return html.replace(ANCHOR_RE, "<a>");
}

function report(field: string, before: string, after: string): boolean {
  if (before === after) return false;
  const a = anchors(before);
  const b = anchors(after);
  const changed = a
    .map((tag, i) => [tag, b[i]] as const)
    .filter(([x, y]) => x !== y);
  console.log(`  [${field}] ${changed.length} link(s) changed, ${before.length} → ${after.length} chars`);
  for (const [x, y] of changed) {
    console.log(`    - ${x}`);
    console.log(`    + ${y}`);
  }
  if (a.length !== b.length) {
    console.log(`    ! anchor count differs (${a.length} → ${b.length})`);
  }
  if (withoutAnchors(before) !== withoutAnchors(after)) {
    console.log("    ! non-link markup also changed (review before applying)");
  }
  return true;
}

async function main() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );

  const { data, error } = await supabase
    .from("blogs")
    .select("id, slug, status, content, summary")
    .order("slug");
  if (error) throw error;

  const rows = (data ?? []) as Row[];
  const updates: { id: string; slug: string; patch: Partial<Row> }[] = [];
  const originals: Row[] = [];

  for (const row of rows) {
    const patch: Partial<Row> = {};
    const nextContent = row.content ? sanitize(row.content) : row.content;
    const nextSummary = row.summary?.trim() ? sanitize(row.summary) : row.summary;
    let touched = false;

    const header = `\n## ${row.slug} (${row.status})`;
    if (row.content && nextContent !== row.content) {
      if (!touched) console.log(header);
      touched = report("content", row.content, nextContent!) || touched;
      patch.content = nextContent;
    }
    if (row.summary && nextSummary !== row.summary) {
      if (!touched) console.log(header);
      touched = report("summary", row.summary, nextSummary!) || touched;
      patch.summary = nextSummary;
    }
    if (touched) {
      updates.push({ id: row.id, slug: row.slug, patch });
      originals.push(row);
    }
  }

  console.log(`\nScanned ${rows.length} posts, ${updates.length} need changes.`);

  if (!APPLY) {
    console.log("DRY RUN — pass --apply to write.");
    return;
  }
  if (!updates.length) return;

  const dir = path.resolve(process.cwd(), "scripts/backups");
  fs.mkdirSync(dir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupPath = path.join(dir, `links-before-fix-${stamp}.json`);
  fs.writeFileSync(backupPath, JSON.stringify(originals, null, 2));
  console.log(`Originals backed up: ${backupPath}`);

  for (const { id, slug, patch } of updates) {
    const { error: upErr } = await supabase.from("blogs").update(patch).eq("id", id);
    if (upErr) console.error(`  ✗ ${slug}: ${upErr.message}`);
    else console.log(`  ✓ ${slug}`);
  }
  console.log("\nDone (applied). Published pages refresh on the next ISR revalidation (≤1h) or deploy.");
}

main().catch((e) => {
  console.error("threw:", e);
  process.exit(1);
});
