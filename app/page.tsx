import Link from "next/link";
import Image from "next/image";
import { listSlugs, getPost } from "@/lib/mdx";

export default async function HomePage() {
  const slugs = await listSlugs();
  const posts = await Promise.all(slugs.map((slug) => getPost(slug)));

  // ✅ Sort by published date (desc). Fallback to last_updated if date is missing.
  const parseMs = (d?: string) => (d ? new Date(d).getTime() : 0);
  const sorted = posts.sort((a, b) => {
    const aMs = parseMs(a.frontmatter.date) || parseMs(a.frontmatter.last_updated);
    const bMs = parseMs(b.frontmatter.date) || parseMs(b.frontmatter.last_updated);
    return bMs - aMs; // newest first
  });

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 font-sans">
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {sorted.length === 0 && (
          <div className="col-span-full text-center text-gray-500">
            No posts yet.
          </div>
        )}

        {sorted.map(({ slug, frontmatter }) => (
          <Link key={slug} href={`/${slug}`} className="group block">
            {/* Featured Image (flush, no border/rounding) */}
            {!!frontmatter?.featured_image && (
              <div className="relative w-full h-48 md:h-52 lg:h-56 overflow-hidden rounded-t-xl">
                <Image
                  src={frontmatter.featured_image}
                  alt={frontmatter.title ?? "Post image"}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
            )}

            {/* Content box (overlaps image with -mt-4) */}
            <div className="-mt-4 border border-gray-200 rounded-xl bg-white shadow-md hover:shadow-lg transition p-5 relative z-10">
              <div className="flex items-center gap-2 text-xs mb-3">
                {!!frontmatter?.categories?.[0] && (
                  <span className="px-2 py-0.5 rounded-md bg-blue-600/90 text-white font-medium text-xs">
                    {frontmatter.categories[0]}
                  </span>
                )}
                {(frontmatter?.date || frontmatter?.last_updated) && (
                  <span className="text-gray-500">
                    {new Date(
                      frontmatter.date || frontmatter.last_updated!
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                )}
              </div>

              <h5 className="w-full text-sm md:text-base font-semibold text-gray-900 group-hover:text-orange-600 leading-snug line-clamp-3">
                {frontmatter?.title}
              </h5>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
