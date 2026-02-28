"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

type SearchSuggestionsProps = {
  posts: { slug: string; title: string }[];
};

export default function SearchSuggestions({ posts }: SearchSuggestionsProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query) return [];
    return posts.filter((p) =>
      p.title.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, posts]);

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Search Input */}
      <label htmlFor="article-search" className="sr-only">Search articles</label>
      <input
        id="article-search"
        type="text"
        placeholder="Search articles..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none text-sm"
      />

      {/* Suggestions dropdown */}
      {filtered.length > 0 && (
        <ul className="mt-2 bg-white border border-gray-200 rounded-lg shadow-md max-h-60 overflow-y-auto text-left">
          {filtered.map((post) => (
            <li key={post.slug} className="border-b last:border-b-0">
              <Link
                href={`/${post.slug}`}
                className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
              >
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
