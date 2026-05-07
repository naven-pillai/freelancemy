import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { getAllPostCards } from "@/lib/posts";
import { formatDate } from "@/lib/utils";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Freelance Malaysia | Guides & Resources for Freelancers in Malaysia",
  description:
    "#1 resource hub for freelancers in Malaysia. Explore expert guides, tips, and tools to elevate your freelance career.",
  alternates: {
    canonical: SITE_URL,
  },
};

export const revalidate = 3600;

export default async function HomePage() {
  const sorted = await getAllPostCards();
  const featured = sorted.filter((p) => p.frontmatter?.is_featured);
  const regular = sorted.filter((p) => !p.frontmatter?.is_featured);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 font-sans">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
        Latest Freelancing Guides
      </h1>
      <p className="text-gray-600 mb-10">
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

      {sorted.length === 0 && (
        <div className="text-center text-gray-600">No posts yet.</div>
      )}

      {/* Featured section */}
      {featured.length > 0 && (
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-linear-to-r from-amber-100 to-orange-100 border border-amber-200">
              <Star className="h-3.5 w-3.5 text-amber-600 fill-amber-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                Featured
              </span>
            </div>
            <div className="flex-1 h-px bg-linear-to-r from-amber-200 via-orange-100 to-transparent" />
          </div>

          {featured.length === 1 ? (
            // Single featured: full-width hero
            (() => {
              const { slug, frontmatter } = featured[0];
              return (
                <Link
                  href={`/${slug}`}
                  className="group block rounded-2xl bg-linear-to-br from-white via-amber-50/40 to-orange-50/30 ring-2 ring-amber-300/60 shadow-lg hover:shadow-2xl hover:ring-amber-400 transition-all duration-300 overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row">
                    {!!frontmatter?.featured_image && (
                      <div className="md:w-3/5 overflow-hidden relative">
                        <Image
                          src={frontmatter.featured_image}
                          alt={frontmatter.title ?? "Post image"}
                          width={1200}
                          height={675}
                          priority
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 60vw"
                        />
                      </div>
                    )}
                    <div
                      className={`flex flex-col justify-center p-6 md:p-10 ${
                        frontmatter?.featured_image ? "md:w-2/5" : "w-full"
                      }`}
                    >
                      <div className="flex items-center flex-wrap gap-2 text-xs mb-4">
                        {!!frontmatter?.categories?.[0] && (
                          <span className="px-2.5 py-1 rounded-md bg-blue-700 text-white font-medium">
                            {frontmatter.categories[0]}
                          </span>
                        )}
                        {(frontmatter?.date || frontmatter?.last_updated) && (
                          <span className="text-gray-600">
                            {formatDate(
                              frontmatter.date || frontmatter.last_updated
                            )}
                          </span>
                        )}
                      </div>
                      <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors leading-snug mb-3">
                        {frontmatter?.title}
                      </h2>
                      {!!frontmatter?.description && (
                        <p className="text-gray-600 text-sm md:text-base leading-relaxed line-clamp-3">
                          {frontmatter.description}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })()
          ) : (
            // Multiple featured: 2-column grid
            <div className="grid gap-6 md:grid-cols-2">
              {featured.map(({ slug, frontmatter }, index) => (
                <Link
                  key={slug}
                  href={`/${slug}`}
                  className="group flex flex-col rounded-2xl bg-linear-to-br from-white via-amber-50/40 to-orange-50/30 ring-2 ring-amber-300/60 shadow-lg hover:shadow-2xl hover:ring-amber-400 transition-all duration-300 overflow-hidden"
                >
                  {!!frontmatter?.featured_image && (
                    <div className="overflow-hidden relative aspect-video">
                      <Image
                        src={frontmatter.featured_image}
                        alt={frontmatter.title ?? "Post image"}
                        width={800}
                        height={450}
                        priority={index < 2}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  )}
                  <div className="flex flex-col flex-1 p-6">
                    <div className="flex items-center flex-wrap gap-2 text-xs mb-3">
                      {!!frontmatter?.categories?.[0] && (
                        <span className="px-2.5 py-1 rounded-md bg-blue-700 text-white font-medium">
                          {frontmatter.categories[0]}
                        </span>
                      )}
                      {(frontmatter?.date || frontmatter?.last_updated) && (
                        <span className="text-gray-600">
                          {formatDate(
                            frontmatter.date || frontmatter.last_updated
                          )}
                        </span>
                      )}
                    </div>
                    <h2 className="text-lg md:text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors leading-snug mb-2">
                      {frontmatter?.title}
                    </h2>
                    {!!frontmatter?.description && (
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                        {frontmatter.description}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Latest section */}
      {regular.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">
              Latest Articles
            </h2>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {regular.map(({ slug, frontmatter }) => (
              <Link
                key={slug}
                href={`/${slug}`}
                className="group block rounded-xl border border-gray-200 bg-white shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {!!frontmatter?.featured_image && (
                  <div className="overflow-hidden relative">
                    <Image
                      src={frontmatter.featured_image}
                      alt={frontmatter.title ?? "Post image"}
                      width={800}
                      height={450}
                      className="w-full h-auto group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <span className="text-white font-semibold text-sm leading-snug line-clamp-2">
                        {frontmatter.title}
                      </span>
                    </div>
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs mb-3">
                    {!!frontmatter?.categories?.[0] && (
                      <span className="px-2 py-0.5 rounded-md bg-blue-700 text-white font-medium">
                        {frontmatter.categories[0]}
                      </span>
                    )}
                    {(frontmatter?.date || frontmatter?.last_updated) && (
                      <span className="text-gray-600">
                        {formatDate(
                          frontmatter.date || frontmatter.last_updated
                        )}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm md:text-base font-semibold text-gray-900 group-hover:text-orange-600 transition-colors leading-snug line-clamp-3">
                    {frontmatter?.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
