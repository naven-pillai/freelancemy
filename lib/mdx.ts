import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { execSync } from "child_process";
import type { BlogFrontmatter } from "@/types/blog";

const CONTENT_DIR = path.join(process.cwd(), "content"); // adjust if you keep posts under content/blog

function isValidISODate(d?: unknown): d is string {
  return typeof d === "string" && !Number.isNaN(Date.parse(d));
}

function getGitLastUpdated(filePath: string): string | undefined {
  try {
    const out = execSync(`git log -1 --format=%cI -- "${filePath}"`, {
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
    return out || undefined;
  } catch {
    return undefined;
  }
}

function resolvePostPath(slug: string): string {
  // Support .md and .mdx
  const md = path.join(CONTENT_DIR, `${slug}.md`);
  const mdx = path.join(CONTENT_DIR, `${slug}.mdx`);
  if (fs.existsSync(md)) return md;
  if (fs.existsSync(mdx)) return mdx;
  throw new Error(`Post not found for slug: ${slug}`);
}

export async function getPost(slug: string): Promise<{
  slug: string;
  frontmatter: BlogFrontmatter;
  content: string;
}> {
  const filePath = resolvePostPath(slug);
  const raw = fs.readFileSync(filePath, "utf8");
  const { content, data } = matter(raw);

  // 1) explicit FM
  let lastUpdated: string | undefined = isValidISODate(data.last_updated)
    ? data.last_updated
    : undefined;

  // 2) git (only if not set by FM)
  if (!lastUpdated) {
    const gitDate = getGitLastUpdated(filePath);
    if (isValidISODate(gitDate)) lastUpdated = gitDate;
  }

  // 3) fallback to published date (but never fs.stat in CI)
  if (!lastUpdated && isValidISODate(data.date)) {
    lastUpdated = data.date;
  }

  // Normalize published date too
  const publishedDate = isValidISODate(data.date) ? data.date : undefined;

  const normalized: BlogFrontmatter = {
    ...data,
    date: publishedDate,
    last_updated: lastUpdated,
  } as BlogFrontmatter;

  return { slug, frontmatter: normalized, content };
}

export function listSlugs(): string[] {
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    .map((f) => f.replace(/\.(md|mdx)$/, ""));
}
