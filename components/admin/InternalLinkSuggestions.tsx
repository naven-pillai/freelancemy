"use client";

import { useState, useEffect } from "react";
import { Link2, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";

type Post = {
  slug: string;
  title: string;
  categories: string[] | null;
};

type Props = {
  currentSlug?: string;
};

export default function InternalLinkSuggestions({ currentSlug }: Props) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/blogs")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: Post[]) => {
        const published = data
          .filter(
            (p: Post & { status?: string }) =>
              p.status === "published" && p.slug !== currentSlug
          )
          .map(({ slug, title, categories }: Post) => ({
            slug,
            title,
            categories,
          }));
        setPosts(published);
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [currentSlug]);

  const filtered = query
    ? posts.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.slug.toLowerCase().includes(query.toLowerCase()) ||
          p.categories?.some((c) =>
            c.toLowerCase().includes(query.toLowerCase())
          )
      )
    : posts;

  function handleCopy(post: Post) {
    navigator.clipboard.writeText(`/${post.slug}`);
    toast.success("Link copied");
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Link2 className="h-4 w-4 text-gray-400" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Internal Links
        </h3>
      </div>
      <hr className="border-gray-100" />

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search posts..."
          className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-200 bg-gray-50/80 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-2">
          {query ? "No matching posts" : "No published posts"}
        </p>
      ) : (
        <ul className="space-y-1 max-h-64 overflow-y-auto">
          {filtered.map((post) => (
            <li
              key={post.slug}
              className="group flex items-start gap-2 rounded-lg px-2.5 py-2 hover:bg-gray-50 transition-colors"
            >
              <button
                type="button"
                onClick={() => handleCopy(post)}
                className="flex-1 min-w-0 text-left"
              >
                <p className="text-sm font-medium text-gray-800 truncate group-hover:text-emerald-700 transition-colors">
                  {post.title}
                </p>
                <p className="text-[11px] text-gray-400 truncate">
                  /{post.slug}
                </p>
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="text-[10px] text-gray-400">
        Click to copy markdown link
      </p>
    </div>
  );
}
