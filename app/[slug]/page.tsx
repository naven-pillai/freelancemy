import { getPost, listSlugs } from "@/lib/mdx";
import { MDXRemote } from "next-mdx-remote/rsc";
import StructuredBlogSEO from "@/components/StructuredBlogSEO";
import AuthorBio from "@/components/AuthorBio";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import Image from "next/image";
import { BlogFrontmatter } from "@/types/blog";

// ✅ Pre-render slugs
export async function generateStaticParams() {
  const slugs = listSlugs();
  return slugs.map((slug: string) => ({ slug }));
}

// ✅ Metadata for SEO
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

// ✅ Blog Page
export default async function BlogPostPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { frontmatter, content } = await getPost(slug);

  return (
    <article className="max-w-3xl mx-auto p-6 prose prose-lg">
      <StructuredBlogSEO
        title={frontmatter.title}
        description={frontmatter.description}
        url={`https://freelancemy.com/${slug}`}
        canonicalUrl={frontmatter.canonical_url || `https://freelancemy.com/${slug}`} // ✅ canonical added
        datePublished={frontmatter.date}
        dateModified={frontmatter.last_updated}
        image={frontmatter.featured_image}
        author={frontmatter.author}
        categories={frontmatter.categories}
        tags={frontmatter.tags}
      />

      {/* ✅ Featured image */}
      {frontmatter.featured_image && (
        <div className="relative w-full h-64 md:h-96 mb-6">
          <Image
            src={frontmatter.featured_image}
            alt={frontmatter.title}
            fill
            priority
            className="object-cover rounded-lg"
          />
        </div>
      )}

      {/* ✅ Title */}
      <h1 className="text-3xl font-bold mb-4">{frontmatter.title}</h1>

      {/* ✅ Meta info */}
      <div className="not-prose mb-8 text-xs md:text-sm text-gray-600 space-y-2">
        <div>
          <strong>Written & Reviewed by:</strong> {frontmatter.author}
        </div>

        {frontmatter.categories && frontmatter.categories.length > 0 && (
          <div className="flex items-center gap-2">
            <strong>Category:</strong>
            <span className="inline-block px-2 py-0.5 rounded-full bg-blue-600 text-white font-medium text-[11px]">
              {frontmatter.categories[0]}
            </span>
          </div>
        )}

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

      {/* ✅ Content */}
      <MDXRemote
        source={content}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypeSlug],
          },
        }}
      />

      {/* ✅ Author bio */}
      <div className="mt-10 not-prose">
        <AuthorBio />
      </div>
    </article>
  );
}
