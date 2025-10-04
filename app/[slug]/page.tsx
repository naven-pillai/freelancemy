import { getPost, listSlugs } from "@/lib/mdx";
import { MDXRemote } from "next-mdx-remote/rsc";
import StructuredBlogSEO from "@/components/StructuredBlogSEO";
import AuthorBio from "@/components/AuthorBio";
import LatestArticlesSidebar from "@/components/LatestArticlesSidebar";
import { mdxComponents } from "@/components/MDXComponents";
import ShareBar from "@/components/ShareBar";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeExternalLinks from "rehype-external-links";
import Image from "next/image";

// ✅ Pre-render slugs for SSG
export async function generateStaticParams() {
  const slugs = listSlugs();
  return slugs.map((slug: string) => ({ slug }));
}

// ✅ SEO metadata
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { frontmatter } = await getPost(slug);

  return {
    title: frontmatter.title,
    description: frontmatter.description,
    openGraph: {
      images: frontmatter.featured_image ? [frontmatter.featured_image] : [],
    },
    twitter: {
      card: "summary_large_image",
      images: frontmatter.featured_image ? [frontmatter.featured_image] : [],
    },
    alternates: {
      canonical: frontmatter.canonical_url || `https://freelancemy.com/${slug}`,
    },
  };
}

// ✅ Blog Post Page
export default async function BlogPostPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { frontmatter, content } = await getPost(slug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
      {/* Article Content */}
      <article className="lg:col-span-2 prose prose-base sm:prose-lg max-w-none">
        <StructuredBlogSEO
          title={frontmatter.title}
          description={frontmatter.description}
          url={`https://freelancemy.com/${slug}`}
          canonicalUrl={
            frontmatter.canonical_url || `https://freelancemy.com/${slug}`
          }
          datePublished={frontmatter.date}
          dateModified={frontmatter.last_updated}
          image={frontmatter.featured_image}
          author={frontmatter.author}
          categories={frontmatter.categories}
          tags={frontmatter.tags}
        />

        {/* Title (responsive sizes) */}
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-4 leading-snug">
          {frontmatter.title}
        </h1>

        {/* Featured Image */}
        {frontmatter.featured_image && (
          <div className="relative w-full h-48 sm:h-64 md:h-96 mb-8">
            <Image
              src={frontmatter.featured_image}
              alt={frontmatter.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 70vw"
              className="object-cover rounded-lg"
            />
          </div>
        )}

        {/* Meta Info */}
        <div className="not-prose mb-4 sm:mb-6 text-xs sm:text-sm md:text-base text-gray-600 space-y-2">
          {frontmatter.author && (
            <div>
              <strong>Written & Reviewed by:</strong> {frontmatter.author}
            </div>
          )}

          {frontmatter.categories?.length ? (
            <div className="flex items-center gap-2">
              <strong>Category:</strong>
              <span className="inline-block px-2 py-0.5 rounded-full bg-blue-600 text-white font-medium text-[11px] sm:text-xs">
                {frontmatter.categories[0]}
              </span>
            </div>
          ) : null}

          {frontmatter.date && (
            <div>
              <strong>Published date:</strong>{" "}
              {new Date(frontmatter.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          )}

          {frontmatter.last_updated && (
            <div>
              <strong>Last update date:</strong>{" "}
              {new Date(frontmatter.last_updated).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          )}
        </div>

        {/* ✅ Share bar (light pill buttons) right after metadata */}
        <ShareBar
          title={frontmatter.title}
          url={`https://freelancemy.com/${slug}`}
          className="not-prose mb-8"
        />

        {/* Main Content */}
        <MDXRemote
          source={content}
          components={mdxComponents}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [
                rehypeSlug,
                [
                  rehypeExternalLinks,
                  {
                    target: "_blank",
                    rel: ["nofollow", "noopener", "noreferrer"],
                  },
                ],
              ],
            },
          }}
        />

        {/* Author Bio */}
        <div className="mt-8 sm:mt-10 not-prose">
          <AuthorBio />
        </div>
      </article>

      {/* Sidebar */}
      <aside className="lg:col-span-1">
        <LatestArticlesSidebar currentSlug={slug} />
      </aside>
    </div>
  );
}
