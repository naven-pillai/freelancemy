"use client";

import { useMemo, useState } from "react";
import { PostCard, type PostCardData } from "./PostCard";

export default function LatestPosts({ posts }: { posts: PostCardData[] }) {
  const categories = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => p.frontmatter.categories?.forEach((c) => c && set.add(c)));
    return ["All", ...Array.from(set).sort()];
  }, [posts]);

  const [active, setActive] = useState("All");

  const filtered = useMemo(
    () =>
      active === "All"
        ? posts
        : posts.filter((p) => p.frontmatter.categories?.includes(active)),
    [posts, active]
  );

  return (
    <section>
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl! md:text-3xl! font-extrabold! text-gray-900 tracking-tight! m-0!">
          Latest Posts
        </h2>
        {categories.length > 2 && (
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter posts by category">
            {categories.map((cat) => {
              const isActive = cat === active;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActive(cat)}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {filtered.map((post) => (
            <PostCard key={post.slug} post={post} featured={false} showCategory={false} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-500">
          No posts in this category yet.
        </div>
      )}
    </section>
  );
}
