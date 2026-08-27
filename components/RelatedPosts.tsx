import { getAllPostCards } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";

/**
 * Related posts ranked by number of shared categories, tie-broken by the
 * source order (is_featured desc, date desc). Falls back to recent posts so
 * the section always fills, and renders nothing if this is the only post.
 */
export default async function RelatedPosts({
  currentSlug,
  categories,
}: {
  currentSlug: string;
  categories?: string[];
}) {
  const all = await getAllPostCards();
  const others = all.filter((p) => p.slug !== currentSlug);
  if (others.length === 0) return null;

  const cats = new Set(categories ?? []);
  const related = others
    .map((p) => ({
      p,
      score: (p.frontmatter.categories ?? []).filter((c: string) => cats.has(c)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((s) => s.p);

  return (
    <section className="mt-16 border-t border-gray-200 pt-12">
      <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-6">
        Related Posts
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {related.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
