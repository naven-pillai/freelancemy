import { getPost, listSlugs } from "@/lib/mdx";
import { MDXRemote } from "next-mdx-remote/rsc";
import StructuredBlogSEO from "@/components/StructuredBlogSEO";
import AuthorBio from "@/components/AuthorBio";
import LatestArticlesSidebar from "@/components/LatestArticlesSidebar";
import { mdxComponents } from "@/components/MDXComponents";
import ShareBar from "@/components/ShareBar";
import CommentForm from "@/components/CommentForm";
import CommentList from "@/components/CommentList";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeExternalLinks from "rehype-external-links";
import Image from "next/image";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";

export const revalidate = 3600; // Regenerate at most every hour (keeps comments fresh)

// Pre-render slugs for SSG
export async function generateStaticParams() {
  const slugs = listSlugs();
  return slugs.map((slug: string) => ({ slug }));
}

// ✅ SEO Metadata Generator
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
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
  } catch {
    return {
      title: "Post not found",
      description: "This blog post could not be found.",
    };
  }
}

// ✅ Blog Post Page
export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let post;
  try {
    post = await getPost(slug);
  } catch {
    return notFound(); // Show 404 if not found
  }

  const { frontmatter, content } = post;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
      {/* ✅ Blog Content */}
      <article className="lg:col-span-2 prose prose-base sm:prose-lg max-w-none">
        <StructuredBlogSEO
          title={frontmatter.title}
          description={frontmatter.description}
          url={`https://freelancemy.com/${slug}`}
          canonicalUrl={frontmatter.canonical_url || `https://freelancemy.com/${slug}`}
          datePublished={frontmatter.date}
          dateModified={frontmatter.last_updated}
          image={frontmatter.featured_image}
          author={frontmatter.author}
          categories={frontmatter.categories}
          tags={frontmatter.tags}
        />

        {/* ✅ Title */}
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-4 leading-snug">
          {frontmatter.title}
        </h1>

        {/* ✅ Featured Image */}
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

        {/* ✅ Meta Info */}
        <div className="not-prose mb-4 sm:mb-6 text-xs sm:text-sm md:text-base text-gray-600 space-y-2">
          {frontmatter.author && (
            <div>
              <strong>Written & Reviewed by:</strong> {frontmatter.author}
            </div>
          )}
          {Array.isArray(frontmatter.categories) && frontmatter.categories.length > 0 && (
  <div className="flex items-center gap-2">
    <strong>Category:</strong>
    <span className="inline-block px-2 py-0.5 rounded-full bg-blue-600 text-white font-medium text-[11px] sm:text-xs">
      {frontmatter.categories[0]}
    </span>
  </div>
)}

          {frontmatter.date && (
            <div>
              <strong>Published date:</strong>{" "}
              {formatDate(frontmatter.date, { year: "numeric", month: "long", day: "numeric" })}
            </div>
          )}
          {frontmatter.last_updated && (
            <div>
              <strong>Last update date:</strong>{" "}
              {formatDate(frontmatter.last_updated, { year: "numeric", month: "long", day: "numeric" })}
            </div>
          )}
        </div>

        {/* ✅ Share Bar */}
        <ShareBar
          title={frontmatter.title}
          url={`https://freelancemy.com/${slug}`}
          className="not-prose mb-8"
        />

        {/* ✅ Render Markdown Content */}
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

        {/* ✅ Author Bio */}
        <div className="mt-8 sm:mt-10 not-prose">
          <AuthorBio />
        </div>

        {/* ✅ Comments Section */}
        <section id="comments" className="mt-12 border-t pt-10">
          <h3 className="text-xl">Comments</h3>
          <CommentForm postSlug={slug} />
          <div className="mt-8">
            <CommentList postSlug={slug} />
          </div>
        </section>
      </article>

      {/* ✅ Sidebar */}
      <aside className="lg:col-span-1">
        <LatestArticlesSidebar currentSlug={slug} />
      </aside>
    </div>
  );
}
