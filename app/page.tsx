import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { getAllPostCards } from "@/lib/posts";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  // `absolute` prevents the layout's "%s | FreelanceMY" template from appending
  // the brand again (the title already includes it), keeping it under ~60 chars.
  title: { absolute: "Freelancing in Malaysia — Guides & Tools | FreelanceMY" },
  description:
    "#1 resource hub for freelancers in Malaysia. Explore expert guides, tips, and tools to elevate your freelance career.",
  alternates: {
    canonical: SITE_URL,
  },
};

export const revalidate = 3600;

export default async function HomePage() {
  const posts = await getAllPostCards();

  return (
    <div className="font-sans">
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
            publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
          }),
        }}
      />

      {/* Header */}
      <div className="text-center mb-12 sm:mb-16">
        <h1 className="text-4xl! md:text-5xl! font-extrabold! text-gray-900 tracking-tight! leading-[1.1]! m-0!">
          Freelancing Insights &amp; Guides
        </h1>
        <div className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto mt-4">
          Expert guides, tips, and tools for freelancers in Malaysia — from
          rates and platforms to taxes and finding your next client.
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-24 text-gray-600">No posts yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {posts.map((post) => {
            const isFeatured = !!post.frontmatter?.is_featured;
            return (
              <Link
                key={post.slug}
                href={`/${post.slug}`}
                className={`group relative block rounded-2xl overflow-hidden transition bg-white ${
                  isFeatured
                    ? "ring-2 ring-amber-400 ring-offset-2 shadow-[0_8px_30px_rgba(217,119,6,0.18)] hover:shadow-[0_12px_40px_rgba(217,119,6,0.28)] bg-linear-to-b from-amber-50 to-white"
                    : "border border-gray-200 hover:shadow-lg"
                }`}
              >
                {post.frontmatter?.featured_image && (
                  <div className="relative w-full aspect-video overflow-hidden">
                    <Image
                      src={post.frontmatter.featured_image}
                      alt={post.frontmatter.title ?? "Post image"}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {isFeatured && (
                      <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-1 bg-amber-400 text-amber-950 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-md">
                        <Star className="h-3 w-3 fill-current" />
                        Featured
                      </span>
                    )}
                  </div>
                )}
                <div className="p-6 space-y-3">
                  {post.frontmatter?.categories?.[0] && (
                    <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-md">
                      {post.frontmatter.categories[0]}
                    </span>
                  )}
                  <h2 className="text-lg! font-bold! text-gray-900 leading-snug! m-0! group-hover:text-blue-600 transition-colors">
                    {post.frontmatter?.title}
                  </h2>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
