// scripts/find-bad-frontmatter.ts
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "content"); // <-- change if your posts live elsewhere

function walk(dir: string, acc: string[] = []) {
  for (const entry of fs.readdirSync(dir)) {
    const p = path.join(dir, entry);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) walk(p, acc);
    else if (p.endsWith(".md") || p.endsWith(".mdx")) acc.push(p);
  }
  return acc;
}

const files = walk(POSTS_DIR);
let bad = 0;

for (const file of files) {
  try {
    const raw = fs.readFileSync(file, "utf8");
    matter(raw); // will throw on malformed YAML
  } catch (e: any) {
    bad++;
    console.error(`❌ Bad front-matter in: ${file}\n   ${e.message || e}`);
  }
}

if (bad === 0) {
  console.log("✅ All front-matter parsed OK.");
  process.exit(0);
} else {
  console.error(`❌ Found ${bad} file(s) with invalid front-matter.`);
  process.exit(1);
}
