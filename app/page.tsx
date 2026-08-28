import type { Metadata } from "next";
import { Star } from "lucide-react";
import { getAllPostCards } from "@/lib/posts";
import { SITE_URL, SITE_NAME } from "@/lib/constants";
import { PostCard } from "@/components/PostCard";
import { AuroraText } from "@/components/sera/aurora-text";
import GlowButton from "@/components/sera/glow-button";

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
      {/* Hero — Sera UI: aurora text + animated aurora-blob background + glow CTAs */}
      <section className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white mb-14 px-6 py-16 sm:px-10 sm:py-20 text-center">
        <div className="sera-hero-bg" aria-hidden="true" />
        <div className="absolute inset-0 sera-grid" aria-hidden="true" />
        <div className="relative z-10 mx-auto max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-sm font-semibold text-blue-700 mb-6">
            <span aria-hidden="true">🇲🇾</span> The #1 hub for Malaysian freelancers
          </span>
          <h1 className="mt-0! mb-6! text-4xl! sm:text-5xl! md:text-6xl! font-extrabold! leading-[1.1]! tracking-tight! text-gray-900">
            Freelance smarter in <AuroraText>Malaysia</AuroraText>
          </h1>
          <p className="mx-auto max-w-xl text-lg! text-gray-600! mb-8!">
            Expert guides, tools, and playbooks to help you win clients, get paid
            on time, and grow your independent career.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <GlowButton href="/about" variant="blue">
              Start here
            </GlowButton>
            <GlowButton href="/contact" variant="amber">
              Get in touch
            </GlowButton>
          </div>
        </div>
      </section>

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
              // Both Editor's Pick images sit at/above the fold and either can be
              // the LCP (side-by-side on desktop, stacked on mobile), so prioritize
              // both — otherwise Lighthouse flags the lazy one as a lazy-loaded LCP.
              <PostCard key={post.slug} post={post} featured priority={index < 2} showCategory={false} />
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
              <PostCard key={post.slug} post={post} featured={false} showCategory={false} />
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
