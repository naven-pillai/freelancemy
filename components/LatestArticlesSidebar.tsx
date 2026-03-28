import Link from "next/link";
import Image from "next/image";
import { getAllPosts } from "@/lib/posts";
import { formatDate } from "@/lib/utils";

type Props = {
  /** Current article slug to exclude from the list */
  currentSlug: string;
};

export default async function LatestArticlesSidebar({ currentSlug }: Props) {
  // Get all posts
  const posts = await getAllPosts();

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
        {latest.map(({ slug, frontmatter }, index) => (
          <Link
            key={slug}
            href={`/${slug}`}
            className="sidebar-card flex flex-row items-center gap-3 rounded-xl bg-white p-3 hover:bg-gray-100 transition"
          >
            {/* Thumbnail */}
            {frontmatter.featured_image && (
              <div className="relative w-18 h-18 shrink-0 rounded-md overflow-hidden">
                <Image
                  src={frontmatter.featured_image}
                  alt={frontmatter.title ?? "Post image"}
                  fill
                  priority={index === 0}
                  className="object-cover"
                  sizes="64px"
                />
              </div>
            )}

            {/* Title + Date */}
            <div className="flex-1 basis-0 min-w-0">
              <span className="block text-sm font-semibold text-gray-900 leading-snug line-clamp-2">
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
