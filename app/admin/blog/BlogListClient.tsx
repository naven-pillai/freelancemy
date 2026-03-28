"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Plus,
  Pencil,
  ExternalLink,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Search,
  FileText,
  ListFilter,
} from "lucide-react";
import { relativeTime } from "@/lib/utils";

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

const ACCENT_BORDER: Record<string, string> = {
  published: "border-l-emerald-400",
  draft: "border-l-blue-400",
};

const ITEMS_PER_PAGE = 10;

export default function BlogListClient({ blogs }: { blogs: Blog[] }) {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const [search, setSearch] = useState(initialQuery);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const router = useRouter();

  const filtered = useMemo(
    () =>
      blogs.filter((b) => {
        const matchSearch = b.title
          .toLowerCase()
          .includes(search.toLowerCase());
        const matchStatus =
          statusFilter === "all" || b.status === statusFilter;
        return matchSearch && matchStatus;
      }),
    [blogs, search, statusFilter]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    setError("");

    try {
      const res = await fetch(`/api/blogs/${deleteId}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to delete post");
        setDeleting(false);
        return;
      }
      setDeleteId(null);
      router.refresh();
    } catch {
      setError("Network error — please try again");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Manage all blog content on the platform.
          </p>
        </div>
        <Link href="/admin/blog/new">
          <Button>
            <Plus className="h-4 w-4 mr-1.5" />
            New Post
          </Button>
        </Link>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Status tabs */}
        <div className="flex items-center gap-0.5 bg-gray-100 rounded-xl p-1 shrink-0">
          {[
            { value: "all", label: "All", dot: "" },
            { value: "published", label: "Published", dot: "bg-emerald-400" },
            { value: "draft", label: "Draft", dot: "bg-blue-400" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => {
                setStatusFilter(tab.value);
                setPage(1);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                statusFilter === tab.value
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.dot && (
                <span
                  className={`w-1.5 h-1.5 rounded-full ${tab.dot} ${
                    statusFilter === tab.value ? "opacity-100" : "opacity-60"
                  }`}
                />
              )}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
          />
        </div>

        {/* Count */}
        <p className="text-sm text-gray-400 sm:ml-auto shrink-0">
          <span className="font-semibold text-gray-700">{filtered.length}</span>{" "}
          post{filtered.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto border border-gray-200 rounded-2xl bg-white shadow-sm">
        <table
          className="w-full text-sm text-left"
          style={{ tableLayout: "fixed" }}
        >
          <colgroup>
            <col style={{ width: "38%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "13%" }} />
            <col style={{ width: "11%" }} />
            <col style={{ width: "9%" }} />
          </colgroup>
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="pl-5 pr-3 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Post
              </th>
              <th className="px-3 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Category
              </th>
              <th className="px-3 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Author
              </th>
              <th className="px-3 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-3 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Posted
              </th>
              <th className="px-3 py-3 pr-5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-gray-300" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        {search || statusFilter !== "all"
                          ? "No posts found"
                          : "No posts yet"}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {search || statusFilter !== "all"
                          ? "Try adjusting your filters or search term."
                          : "Create your first blog post to get started."}
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              paginated.map((blog) => {
                const accent =
                  ACCENT_BORDER[blog.status] || ACCENT_BORDER.draft;
                return (
                  <tr
                    key={blog.id}
                    className="group border-t border-gray-100 hover:bg-gray-50/60 transition-colors"
                  >
                    {/* Post: title + slug */}
                    <td
                      className={`pl-5 pr-3 py-3.5 border-l-[3px] ${accent}`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1 min-w-0">
                          <Link
                            href={`/admin/blog/${blog.id}/edit`}
                            className="font-semibold text-gray-900 hover:text-emerald-600 transition truncate text-sm leading-snug"
                          >
                            {blog.title}
                          </Link>
                          <a
                            href={`/${blog.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 text-gray-400 hover:text-emerald-500 transition"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5 truncate">
                          {blog.slug}
                        </p>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-3 py-3.5 align-top pt-4">
                      {blog.categories?.[0] ? (
                        <span className="inline-flex items-center text-[11px] font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full truncate max-w-full">
                          {blog.categories[0]}
                        </span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>

                    {/* Author */}
                    <td className="px-3 py-3.5 text-sm text-gray-600 align-top pt-4 truncate">
                      {blog.author || "—"}
                    </td>

                    {/* Status */}
                    <td className="px-3 py-3.5 align-top pt-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                          blog.status === "published"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-blue-50 text-blue-600"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            blog.status === "published"
                              ? "bg-emerald-500"
                              : "bg-blue-400"
                          }`}
                        />
                        {blog.status === "published" ? "Published" : "Draft"}
                      </span>
                    </td>

                    {/* Posted */}
                    <td className="px-3 py-3.5 text-xs text-gray-500 whitespace-nowrap align-top pt-4">
                      {relativeTime(blog.date ?? blog.created_at)}
                    </td>

                    {/* Actions */}
                    <td className="px-3 py-3.5 pr-5 text-right align-top pt-3">
                      <div className="inline-flex items-center gap-0.5">
                        <Link
                          href={`/admin/blog/${blog.id}/edit`}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition"
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => setDeleteId(blog.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <span className="text-xs text-gray-400">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </div>

      {/* Delete confirmation */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent onClose={() => setDeleteId(null)}>
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
            <DialogDescription>
              Are you sure? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
