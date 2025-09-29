import Link from "next/link";
import Image from "next/image";
import { listSlugs, getPost } from "@/lib/mdx";

export default async function HomePage() {
  const slugs = listSlugs();
  const posts = await Promise.all(slugs.map((slug) => getPost(slug)));

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 font-sans">
      <h1 className="text-2xl font-bold mb-10">Latest Articles</h1>
      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {posts.map(({ slug, frontmatter }) => (
          <Link
            key={slug}
            href={`/${slug}`}
            className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-lg transition"
          >
            {/* ✅ Image with no overlap */}
            {frontmatter.featured_image && (
              <div className="relative w-full overflow-hidden">
                <Image
                  src={frontmatter.featured_image}
                  alt={frontmatter.title}
                  width={800}       // 👈 fixed width
                  height={450}      // 👈 fixed height (16:9)
                  className="object-cover w-full h-auto rounded-t-xl group-hover:scale-105 transition-transform"
                  priority={false}
                />
              </div>
            )}

            {/* Content */}
            <div className="flex flex-col flex-1 p-5">
              <div className="flex items-center gap-3 text-xs mb-3">
                {frontmatter.categories?.[0] && (
                  <span className="px-2 py-1 rounded-full bg-blue-600 text-white font-medium text-xs">
                    {frontmatter.categories[0]}
                  </span>
                )}
                {frontmatter.date && (
                  <span className="text-gray-500">
                    {new Date(frontmatter.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                )}
              </div>

              <h3 className="text-base lg:text-lg font-semibold text-gray-900 group-hover:text-orange-600 leading-snug">
                {frontmatter.title}
              </h3>

              {frontmatter.author && (
                <div className="mt-4 text-sm text-gray-700">{frontmatter.author}</div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
