import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { execSync } from "child_process";
import { BlogFrontmatter } from "@/types/blog";

const CONTENT_PATH = path.join(process.cwd(), "content");

export async function getPost(slug: string): Promise<{
  slug: string;
  frontmatter: BlogFrontmatter;
  content: string;
}> {
  const filePath = path.join(CONTENT_PATH, `${slug}.md`);
  const raw = fs.readFileSync(filePath, "utf8");
  const { content, data } = matter(raw);

  // ✅ Determine last updated
  let lastUpdated: string | undefined = data.last_updated;

  if (!lastUpdated) {
    try {
      // Try to get last git commit date
      const gitDate = execSync(`git log -1 --format=%cI -- "${filePath}"`)
        .toString()
        .trim();
      if (gitDate) {
        lastUpdated = gitDate;
      }
    } catch {
      // Fallback to file modified time
      const stats = fs.statSync(filePath);
      lastUpdated = stats.mtime.toISOString();
    }
  }

  return {
    slug,
    frontmatter: {
      ...data,
      last_updated: lastUpdated,
    } as BlogFrontmatter,
    content,
  };
}

export function listSlugs(): string[] {
  return fs
    .readdirSync(CONTENT_PATH)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}
