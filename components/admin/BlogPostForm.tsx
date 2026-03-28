"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Save, Eye, ArrowLeft, FileText, ImageOff } from "lucide-react";
import Link from "next/link";

type BlogData = {
  id?: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  featured_image: string;
  author: string;
  categories: string[];
  tags: string[];
  status: string;
  date: string;
  canonical_url: string;
};

const DEFAULT_BLOG: BlogData = {
  title: "",
  slug: "",
  description: "",
  content: "",
  featured_image: "",
  author: "Naven Pillai",
  categories: [],
  tags: [],
  status: "draft",
  date: new Date().toISOString().split("T")[0],
  canonical_url: "",
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export default function BlogPostForm({
  initialData,
  isEdit = false,
}: {
  initialData?: Partial<BlogData> & { id?: string };
  isEdit?: boolean;
}) {
  const router = useRouter();
  const [form, setForm] = useState<BlogData>({
    ...DEFAULT_BLOG,
    ...initialData,
    categories: initialData?.categories ?? [],
    tags: initialData?.tags ?? [],
    date: initialData?.date
      ? new Date(initialData.date).toISOString().split("T")[0]
      : DEFAULT_BLOG.date,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [imgError, setImgError] = useState(false);
  const isDirty = useRef(false);

  // Track dirty state for unsaved changes warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty.current) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const updateField = useCallback(
    <K extends keyof BlogData>(key: K, value: BlogData[K]) => {
      isDirty.current = true;
      if (key === "featured_image") setImgError(false);
      setForm((prev) => {
        const next = { ...prev, [key]: value };
        if (key === "title" && !isEdit) {
          next.slug = slugify(value as string);
        }
        return next;
      });
    },
    [isEdit]
  );

  async function handleSave() {
    setError("");
    setSaving(true);

    try {
      const payload = {
        ...form,
        date: form.date ? new Date(form.date).toISOString() : null,
      };

      const url = isEdit ? `/api/blogs/${initialData?.id}` : "/api/blogs";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save");
        setSaving(false);
        return;
      }

      isDirty.current = false;
      router.push("/admin/blog");
      router.refresh();
    } catch {
      setError("Network error — please try again");
      setSaving(false);
    }
  }

  const wordCount = form.content.split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.round(wordCount / 200));

  const inputClass =
    "w-full h-10 px-3.5 rounded-lg border border-gray-200 bg-gray-50/80 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all";
  const labelClass = "text-xs font-medium text-gray-500 uppercase tracking-wider";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/blog">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4 text-gray-500" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {isEdit ? "Edit Post" : "New Post"}
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-gray-400">
                {wordCount.toLocaleString()} words
              </span>
              <span className="text-gray-300">&middot;</span>
              <span className="text-xs text-gray-400">
                {readingTime} min read
              </span>
              <span className="text-gray-300">&middot;</span>
              <span
                className={`text-xs font-medium ${
                  form.status === "published"
                    ? "text-emerald-600"
                    : "text-amber-600"
                }`}
              >
                {form.status === "published" ? "Published" : "Draft"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {form.slug && (
            <a
              href={`/${form.slug}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm">
                <Eye className="h-3.5 w-3.5 mr-1.5" />
                Preview
              </Button>
            </a>
          )}
          <Button
            onClick={handleSave}
            disabled={saving}
            size="sm"
          >
            <Save className="h-3.5 w-3.5 mr-1.5" />
            {saving ? "Saving..." : isEdit ? "Update" : "Create"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main editor */}
        <div className="lg:col-span-2 space-y-5">
          {/* Title & slug & description */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="title" className={labelClass}>
                Title
              </label>
              <input
                id="title"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="Your post title"
                className={`${inputClass} h-11 text-base font-medium`}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="slug" className={labelClass}>
                Slug
              </label>
              <div className="flex items-center">
                <span className="h-10 px-3 flex items-center rounded-l-lg border border-r-0 border-gray-200 bg-gray-100 text-xs text-gray-400">
                  freelancemy.com/
                </span>
                <input
                  id="slug"
                  value={form.slug}
                  onChange={(e) => updateField("slug", e.target.value)}
                  placeholder="post-slug"
                  className="flex-1 h-10 px-3.5 rounded-r-lg border border-gray-200 bg-gray-50/80 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="description" className={labelClass}>
                Description
              </label>
              <textarea
                id="description"
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Brief description for SEO and social sharing..."
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 bg-gray-50/80 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
              />
              <p className="text-[11px] text-gray-400">
                {form.description.length}/500 characters
              </p>
            </div>
          </div>

          {/* Content editor */}
          <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
            <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-2">
                <FileText className="h-3.5 w-3.5 text-gray-400" />
                <span className="text-xs font-medium text-gray-500">
                  Markdown Editor
                </span>
              </div>
              <span className="text-[11px] text-gray-400">
                {wordCount.toLocaleString()} words
              </span>
            </div>
            <textarea
              id="content"
              value={form.content}
              onChange={(e) => updateField("content", e.target.value)}
              placeholder="Write your post in Markdown..."
              rows={25}
              className="w-full px-6 py-4 text-sm placeholder:text-gray-400 focus:outline-none font-mono leading-relaxed resize-y min-h-64"
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Publish settings */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Publish
            </h3>
            <hr className="border-gray-100" />

            <div className="flex items-center justify-between">
              <label htmlFor="status" className="text-sm text-gray-600">
                Status
              </label>
              <select
                id="status"
                value={form.status}
                onChange={(e) => updateField("status", e.target.value)}
                className="h-9 pl-3 pr-8 rounded-lg border border-gray-200 bg-gray-50/80 text-sm font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="date" className="text-sm text-gray-600">
                Publish Date
              </label>
              <input
                id="date"
                type="date"
                value={form.date}
                onChange={(e) => updateField("date", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Featured image */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Featured Image
            </h3>
            <hr className="border-gray-100" />
            <div className="space-y-1.5">
              <label htmlFor="featured_image" className="text-sm text-gray-600">
                Image URL
              </label>
              <input
                id="featured_image"
                value={form.featured_image}
                onChange={(e) => updateField("featured_image", e.target.value)}
                placeholder="https://..."
                className={inputClass}
              />
              {form.featured_image && (
                imgError ? (
                  <div className="w-full h-36 rounded-xl mt-3 border border-red-100 bg-red-50 flex flex-col items-center justify-center gap-1">
                    <ImageOff className="h-5 w-5 text-red-400" />
                    <p className="text-xs text-red-500">Failed to load image</p>
                  </div>
                ) : (
                  <img
                    src={form.featured_image}
                    alt="Preview"
                    className="w-full h-36 object-cover rounded-xl mt-3 border border-gray-100"
                    onError={() => setImgError(true)}
                  />
                )
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Metadata
            </h3>
            <hr className="border-gray-100" />

            <div className="space-y-1.5">
              <label htmlFor="author" className="text-sm text-gray-600">
                Author
              </label>
              <input
                id="author"
                value={form.author}
                onChange={(e) => updateField("author", e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="categories" className="text-sm text-gray-600">
                Categories
              </label>
              <input
                id="categories"
                value={form.categories.join(", ")}
                onChange={(e) =>
                  updateField(
                    "categories",
                    e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean)
                  )
                }
                placeholder="Freelancing, Writing"
                className={inputClass}
              />
              <p className="text-[11px] text-gray-400">Comma-separated</p>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="tags" className="text-sm text-gray-600">
                Tags
              </label>
              <input
                id="tags"
                value={form.tags.join(", ")}
                onChange={(e) =>
                  updateField(
                    "tags",
                    e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean)
                  )
                }
                placeholder="freelance, malaysia"
                className={inputClass}
              />
              <p className="text-[11px] text-gray-400">Comma-separated</p>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="canonical_url" className="text-sm text-gray-600">
                Canonical URL
              </label>
              <input
                id="canonical_url"
                value={form.canonical_url}
                onChange={(e) => updateField("canonical_url", e.target.value)}
                placeholder="https://..."
                className={inputClass}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
