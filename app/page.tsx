import Link from "next/link";
import Image from "next/image";
import { getAllPostCards } from "@/lib/posts";
import { formatDate } from "@/lib/utils";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

export const revalidate = 3600; // Regenerate at most every hour

export default async function HomePage() {
  const sorted = await getAllPostCards();

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 font-sans">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
        Latest Freelancing Guides
      </h1>
      <p className="text-gray-500 mb-8">
        Expert guides, tips, and resources for freelancers in Malaysia.
      </p>

      {/* WebSite JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: SITE_NAME,
            url: SITE_URL,
            description:
              "#1 resource hub for freelancers in Malaysia. Explore expert guides, tips, and tools to elevate your freelance career.",
            publisher: {
              "@type": "Organization",
              name: SITE_NAME,
              url: SITE_URL,
            },
          }),
        }}
      />

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {sorted.length === 0 && (
          <div className="col-span-full text-center text-gray-500">
            No posts yet.
          </div>
        )}

        {sorted.map(({ slug, frontmatter }, index) => (
          <Link key={slug} href={`/${slug}`} className="group block">
            {/* Featured Image (flush, no border/rounding) */}
            {!!frontmatter?.featured_image && (
              <div className="relative w-full h-48 md:h-52 lg:h-56 overflow-hidden rounded-t-xl">
                <Image
                  src={frontmatter.featured_image}
                  alt={frontmatter.title ?? "Post image"}
                  fill
                  priority={index === 0}
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
                    {formatDate(frontmatter.date || frontmatter.last_updated)}
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
    </div>
  );
}
