"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { formatDateAdmin } from "@/lib/utils";

type Blog = {
  id: string;
  title: string;
  slug: string;
  status: string;
  date: string | null;
  categories: string[] | null;
  author: string | null;
  created_at: string;
};

type StatusFilter = "all" | "published" | "draft";

export default function BlogListClient({ blogs }: { blogs: Blog[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  // Rows removed optimistically while the server list refreshes.
  const [removed, setRemoved] = useState<Set<string>>(() => new Set());

  const posts = blogs.filter((b) => !removed.has(b.id));

  const filtered = posts.filter((p) => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    return true;
  });

  // Counts come from all rows, not the search filter, so each tab shows its
  // real total.
  const publishedCount = posts.filter((p) => p.status === "published").length;
  const draftCount = posts.filter((p) => p.status !== "published").length;

  const confirmDelete = async (id: string) => {
    setBusyId(id);
    try {
      const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        toast.error(data.error || "Failed to delete post");
      } else {
        toast.success("Post deleted");
        setRemoved((prev) => new Set(prev).add(id));
        router.refresh();
      }
    } catch {
      toast.error("Network error — please try again");
    } finally {
      setBusyId(null);
      setDeletingId(null);
    }
  };

  const tabs: { key: StatusFilter; label: string; count: number }[] = [
    { key: "all", label: "All", count: posts.length },
    { key: "published", label: "Published", count: publishedCount },
    { key: "draft", label: "Drafts", count: draftCount },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">Blog Posts</h1>
        <div className="flex gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by title…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 bg-white px-4 py-2 rounded-md w-full sm:w-64 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded-md text-sm whitespace-nowrap transition-colors"
          >
            + New Post
          </Link>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setStatusFilter(tab.key)}
            className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              statusFilter === tab.key
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            {tab.label}{" "}
            <span className="text-xs text-gray-400">({tab.count})</span>
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-md border border-gray-200 bg-white">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-gray-50 text-left text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 font-semibold">Title</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Author</th>
              <th className="px-4 py-3 font-semibold">Published</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-800 divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                  {search ? `No posts matching "${search}"` : "Nothing here yet."}
                </td>
              </tr>
            ) : (
              filtered.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium max-w-xs">
                    <Link
                      href={`/${post.slug}`}
                      target="_blank"
                      className="text-blue-600 hover:text-emerald-600 hover:underline truncate block"
                    >
                      {post.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {post.categories?.[0] ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{post.author ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                    {post.date ? formatDateAdmin(post.date) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        post.status === "published"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {deletingId === post.id ? (
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-gray-600">Delete?</span>
                        <button
                          type="button"
                          onClick={() => confirmDelete(post.id)}
                          disabled={busyId === post.id}
                          className="text-red-600 font-semibold hover:underline disabled:opacity-50"
                        >
                          {busyId === post.id ? "Deleting…" : "Yes"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingId(null)}
                          disabled={busyId === post.id}
                          className="text-gray-500 hover:underline"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-3">
                        <Link
                          href={`/admin/blog/${post.id}/edit`}
                          className="text-emerald-600 hover:underline text-xs font-medium"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeletingId(post.id)}
                          className="text-gray-500 hover:text-red-600 hover:underline text-xs font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
