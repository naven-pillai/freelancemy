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

type PostCardData = Awaited<ReturnType<typeof getAllPostCards>>[number];

function PostCard({ post, featured }: { post: PostCardData; featured: boolean }) {
  return (
    <Link
      href={`/${post.slug}`}
      className={`group relative block rounded-2xl overflow-hidden transition bg-white ${
        featured
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
            sizes={
              featured
                ? "(max-width: 768px) 100vw, 50vw"
                : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            }
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-6 space-y-3">
        {post.frontmatter?.categories?.[0] && (
          <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-md">
            {post.frontmatter.categories[0]}
          </span>
        )}
        <h2
          className={`${
            featured ? "text-xl! md:text-2xl!" : "text-lg!"
          } font-bold! text-gray-900 leading-snug! m-0! group-hover:text-blue-600 transition-colors`}
        >
          {post.frontmatter?.title}
        </h2>
      </div>
    </Link>
  );
}

export default async function HomePage() {
  const posts = await getAllPostCards();
  const featured = posts.filter((p) => p.frontmatter?.is_featured);
  const latest = posts.filter((p) => !p.frontmatter?.is_featured);

  return (
    <div className="font-sans">
      <h1 className="sr-only">Freelancing Insights &amp; Guides for Malaysia</h1>

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

      {/* Editor's Pick */}
      {featured.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <Star className="h-6 w-6 text-amber-400 fill-amber-400" />
            <h2 className="text-2xl! md:text-3xl! font-extrabold! text-gray-900 tracking-tight! m-0!">
              Editor&apos;s Pick
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featured.map((post) => (
              <PostCard key={post.slug} post={post} featured />
            ))}
          </div>
        </section>
      )}

      {/* Latest Posts */}
      {latest.length > 0 && (
        <section>
          <h2 className="text-2xl! md:text-3xl! font-extrabold! text-gray-900 tracking-tight! m-0! mb-6!">
            Latest Posts
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {latest.map((post) => (
              <PostCard key={post.slug} post={post} featured={false} />
            ))}
          </div>
        </section>
      )}

      {posts.length === 0 && (
        <div className="text-center py-24 text-gray-600">No posts yet.</div>
      )}
    </div>
  );
}
