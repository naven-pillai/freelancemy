import Link from "next/link";
import Image from "next/image";
import { listSlugs, getPost } from "@/lib/mdx";
import { formatDate } from "@/lib/utils";

type Props = {
  /** Current article slug to exclude from the list */
  currentSlug: string;
};

export default async function LatestArticlesSidebar({ currentSlug }: Props) {
  // Get all posts
  const slugs = listSlugs();
  const posts = await Promise.all(slugs.map((slug) => getPost(slug)));

  // Sort by date desc & exclude current post
  const latest = posts
    .filter((p) => p.slug !== currentSlug && p.frontmatter?.date)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    )
    .slice(0, 5);

  return (
    <aside className="not-prose w-full flex flex-col gap-6 sticky top-24 self-start">
      {/* Heading */}
      <div>
        <h4 className="text-xl font-bold mb-2">Latest Articles</h4>
        <div className="w-12 h-0.5 bg-red-600" />
      </div>

      {/* Articles list */}
      <div className="space-y-4">
        {latest.map(({ slug, frontmatter }) => (
          <Link
            key={slug}
            href={`/${slug}`}
            className="sidebar-card flex flex-row items-center gap-3 rounded-xl bg-white p-3 hover:bg-gray-100 transition"
          >
            {/* Thumbnail */}
            {frontmatter.featured_image && (
              <div className="relative w-18 h-18 flex-shrink-0 rounded-md overflow-hidden">
                <Image
                  src={frontmatter.featured_image}
                  alt={frontmatter.title ?? "Post image"}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
            )}

            {/* Title + Date */}
            <div className="flex-1 basis-0 min-w-0">
              <span className="block text-sm font-semibold text-gray-900 leading-snug line-clamp-">
                {frontmatter.title}
              </span>
              {frontmatter.date && (
                <span className="block text-xs text-gray-500 mt-1">
                  {formatDate(frontmatter.date)}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
}
