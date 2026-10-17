"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SITE_URL } from "@/lib/constants";
import { boxClass, fieldClass } from "./styles";

type PostLink = { id: string; title: string; slug: string };

type Props = {
  /** Slug of the post being edited — excluded from the list. */
  currentSlug?: string;
};

export default function InternalLinks({ currentSlug }: Props) {
  const [posts, setPosts] = useState<PostLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/blogs")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: Array<PostLink & { status?: string }>) => {
        if (cancelled) return;
        setPosts(
          data
            .filter((p) => p.status === "published")
            .map(({ id, title, slug }) => ({ id, title, slug }))
        );
      })
      .catch(() => {
        if (!cancelled) setPosts([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = posts.filter((p) => {
    if (p.slug === currentSlug) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q);
  });

  const handleCopy = (slug: string) => {
    navigator.clipboard.writeText(`${SITE_URL}/${slug}`);
    toast.success("URL copied to clipboard");
  };

  return (
    <div className={`${boxClass} space-y-2`}>
      <h3 className="text-lg font-semibold text-gray-900">Internal Links</h3>
      <Input
        placeholder="Search blog posts…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={fieldClass}
      />
      <ul className="max-h-48 overflow-y-auto text-sm divide-y divide-gray-100">
        {loading && <li className="py-2 text-gray-500 text-xs">Loading posts…</li>}
        {!loading && filtered.length === 0 && (
          <li className="py-2 text-gray-500 text-xs">No posts found.</li>
        )}
        {filtered.map((post) => (
          <li key={post.id} className="flex justify-between items-center gap-2 py-1.5">
            <span className="truncate text-xs text-gray-800" title={post.title}>
              {post.title}
            </span>
            <Button size="sm" variant="outline" onClick={() => handleCopy(post.slug)}>
              Copy
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
