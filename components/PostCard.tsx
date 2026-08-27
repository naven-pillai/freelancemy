import Link from "next/link";
import Image from "next/image";

export type PostCardData = {
  slug: string;
  frontmatter: {
    title: string;
    description?: string;
    featured_image?: string;
    date?: string | null;
    last_updated?: string;
    categories?: string[];
    is_featured?: boolean;
  };
};

export function PostCard({
  post,
  featured = false,
  priority = false,
  showCategory = true,
}: {
  post: PostCardData;
  featured?: boolean;
  priority?: boolean;
  showCategory?: boolean;
}) {
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
            priority={priority}
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
        {showCategory && post.frontmatter?.categories?.[0] && (
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
