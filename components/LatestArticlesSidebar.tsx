import Link from "next/link";
import Image from "next/image";
import { getLatestPostsMeta } from "@/lib/posts";
import { formatDate } from "@/lib/utils";

type Props = {
  /** Current article slug to exclude from the list */
  currentSlug: string;
};

export default async function LatestArticlesSidebar({ currentSlug }: Props) {
  const latest = await getLatestPostsMeta(currentSlug, 5);

  return (
    <aside className="not-prose w-full flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
      {/* Heading */}
      <div>
        <h4 className="text-xl font-bold mb-2">Latest Articles</h4>
        <div className="w-12 h-0.5 bg-red-600" />
      </div>

      {/* Articles list */}
      <div className="space-y-4">
        {latest.map(({ slug, title, featured_image, date }) => (
          <Link
            key={slug}
            href={`/${slug}`}
            className="sidebar-card flex flex-row items-center gap-3 rounded-xl bg-white p-3 hover:bg-gray-100 transition"
          >
            {/* Thumbnail */}
            {featured_image && (
              <div className="relative w-18 h-18 shrink-0 rounded-md overflow-hidden">
                <Image
                  src={featured_image}
                  alt={title ?? "Post image"}
                  fill
                  loading="lazy"
                  className="object-cover"
                  sizes="64px"
                />
              </div>
            )}

            {/* Title + Date */}
            <div className="flex-1 basis-0 min-w-0">
              <span className="block text-sm font-semibold text-gray-900 leading-snug line-clamp-2">
                {title}
              </span>
              {date && (
                <span className="block text-xs text-gray-500 mt-1">
                  {formatDate(date)}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
}
