import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllPostCards } from "@/lib/posts";
import { formatDate } from "@/lib/utils";
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

const DATE_FMT: Intl.DateTimeFormatOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

export default async function HomePage() {
  const sorted = await getAllPostCards();
  const hero = sorted[0];
  const grid = sorted.slice(1);

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

      {!hero && <p className="text-black">No posts yet.</p>}

      {/* Featured hero */}
      {hero && (
        <Link href={`/${hero.slug}`} className="group block">
          {hero.frontmatter?.featured_image && (
            <div className="relative w-full aspect-16/7 overflow-hidden bg-[#f4f4f4]">
              <Image
                src={hero.frontmatter.featured_image}
                alt={hero.frontmatter.title ?? "Post image"}
                fill
                priority
                fetchPriority="high"
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="object-cover"
              />
            </div>
          )}
          <p className="text-[14px]! font-normal! leading-[1.38]! text-black mt-12! mb-0!">
            {formatDate(hero.frontmatter?.date || hero.frontmatter?.last_updated, DATE_FMT)}
          </p>
          <h1 className="text-[28px]! sm:text-[40px]! font-semibold! leading-[1.15]! text-black mt-5! mb-0! max-w-225 group-hover:underline decoration-glitch decoration-2 underline-offset-4">
            {hero.frontmatter?.title}
          </h1>
        </Link>
      )}

      {/* Grid of remaining posts */}
      {grid.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
          {grid.map((post) => (
            <Link key={post.slug} href={`/${post.slug}`} className="group block">
              {post.frontmatter?.featured_image && (
                <div className="relative w-full aspect-4/3 overflow-hidden bg-[#f4f4f4]">
                  <Image
                    src={post.frontmatter.featured_image}
                    alt={post.frontmatter.title ?? "Post image"}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
              )}
              <p className="text-[14px]! font-normal! leading-[1.38]! text-black mt-5! mb-0!">
                {formatDate(post.frontmatter?.date || post.frontmatter?.last_updated, DATE_FMT)}
              </p>
              <h2 className="text-[18px]! font-semibold! leading-[1.38]! text-black mt-5! mb-0! group-hover:underline decoration-glitch decoration-2 underline-offset-4">
                {post.frontmatter?.title}
              </h2>
            </Link>
          ))}
        </div>
      )}

      {/* Hairline + All Stories */}
      {hero && (
        <div className="mt-12">
          <div className="border-t border-hairline" />
          <div className="mt-5 flex justify-end">
            <Link
              href="/contact"
              className="inline-flex items-center gap-1 text-[16px] font-semibold text-glitch"
            >
              Get in Touch <span aria-hidden="true">›</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
