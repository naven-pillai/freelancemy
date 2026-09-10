import type { Metadata } from "next";
import { getAllPostCards } from "@/lib/posts";
import { SITE_URL, SITE_NAME } from "@/lib/constants";
import { PostCard } from "@/components/PostCard";

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
  // Show every post in one normal blog grid, newest first. (Featured/Editor's
  // Pick is retired for now — the is_featured flag stays in the DB for later.)
  const posts = (await getAllPostCards()).sort(
    (a, b) =>
      new Date(b.frontmatter.date ?? 0).getTime() -
      new Date(a.frontmatter.date ?? 0).getTime()
  );

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

      {/* Latest Posts — all posts in one grid */}
      {posts.length > 0 ? (
        <section>
          <h2 className="text-2xl! md:text-3xl! font-extrabold! text-gray-900 tracking-tight! m-0! mb-6!">
            Latest Posts
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {posts.map((post, index) => (
              // The first cards are the LCP candidates — prioritize them so
              // Lighthouse doesn't flag a lazy-loaded LCP image.
              <PostCard
                key={post.slug}
                post={post}
                featured={false}
                priority={index < 2}
                showCategory={false}
              />
            ))}
          </div>
        </section>
      ) : (
        <div className="text-center py-24 text-gray-600">No posts yet.</div>
      )}
    </div>
  );
}
