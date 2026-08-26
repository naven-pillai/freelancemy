import type { Metadata } from "next";
import { Star } from "lucide-react";
import { getAllPostCards } from "@/lib/posts";
import { SITE_URL, SITE_NAME } from "@/lib/constants";
import { PostCard } from "@/components/PostCard";
import LatestPosts from "@/components/LatestPosts";

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
  const featured = posts.filter((p) => p.frontmatter?.is_featured);
  const latest = posts.filter((p) => !p.frontmatter?.is_featured);

  return (
    <div className="font-sans">
      <h1 className="sr-only">Freelancing Insights &amp; Guides for Malaysia</h1>

      {/* WebSite + ItemList JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: SITE_NAME,
              url: SITE_URL,
              description:
                "#1 resource hub for freelancers in Malaysia. Explore expert guides, tips, and tools to elevate your freelance career.",
              publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
            },
            {
              "@context": "https://schema.org",
              "@type": "ItemList",
              itemListElement: posts.map((post, index) => ({
                "@type": "ListItem",
                position: index + 1,
                url: `${SITE_URL}/${post.slug}`,
                name: post.frontmatter?.title,
              })),
            },
          ]),
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
            {featured.map((post, index) => (
              <PostCard key={post.slug} post={post} featured priority={index === 0} />
            ))}
          </div>
        </section>
      )}

      {/* Latest Posts (with category filter) */}
      {latest.length > 0 && <LatestPosts posts={latest} />}

      {posts.length === 0 && (
        <div className="text-center py-24 text-gray-600">No posts yet.</div>
      )}
    </div>
  );
}
