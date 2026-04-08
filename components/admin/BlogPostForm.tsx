"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import {
  Save,
  Eye,
  ArrowLeft,
  FileText,
  ImageOff,
  Upload,
  CheckCircle,
  Loader2,
  ImagePlus,
  Monitor,
  Smartphone,
  Search,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { SITE_URL } from "@/lib/constants";
import InternalLinkSuggestions from "@/components/admin/InternalLinkSuggestions";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-gray-50 animate-pulse rounded-lg" />
  ),
});

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
  seo_title: string;
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
  seo_title: "",
};

const AUTOSAVE_DELAY = 3000;
const SEO_TITLE_MAX = 60;
const META_DESC_MAX = 160;
const SEO_TITLE_MOBILE_MAX = 55;
const META_DESC_MOBILE_MAX = 120;

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Upload failed");
  }

  const { url } = await res.json();
  return url;
}

/** Parse a raw comma-separated string into trimmed array (only on blur/save) */
function parseCommaSeparated(raw: string): string[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

// --- SERP Preview Component ---
function SerpPreview({
  seoTitle,
  metaDescription,
  slug,
  device,
}: {
  seoTitle: string;
  metaDescription: string;
  slug: string;
  device: "desktop" | "mobile";
}) {
  const titleMax = device === "desktop" ? SEO_TITLE_MAX : SEO_TITLE_MOBILE_MAX;
  const descMax =
    device === "desktop" ? META_DESC_MAX : META_DESC_MOBILE_MAX;

  const displayTitle = seoTitle || "Page title will appear here";
  const displayDesc = metaDescription || "Meta description will appear here...";
  const truncatedTitle =
    displayTitle.length > titleMax
      ? displayTitle.slice(0, titleMax) + "..."
      : displayTitle;
  const truncatedDesc =
    displayDesc.length > descMax
      ? displayDesc.slice(0, descMax) + "..."
      : displayDesc;
  const displayUrl = slug
    ? `${SITE_URL}/${slug}`
    : `${SITE_URL}/your-post-slug`;

  return (
    <div className="space-y-1">
      <p
        className="text-[13px] text-green-800 truncate"
        style={{ fontFamily: "Arial, sans-serif" }}
      >
        {displayUrl}
      </p>
      <p
        className="text-lg text-blue-800 leading-snug"
        style={{ fontFamily: "Arial, sans-serif" }}
      >
        {truncatedTitle}
      </p>
      <p
        className="text-[13px] text-gray-600 leading-relaxed"
        style={{ fontFamily: "Arial, sans-serif" }}
      >
        {truncatedDesc}
      </p>
    </div>
  );
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
    seo_title: initialData?.seo_title ?? "",
  });

  // Raw strings for categories/tags input to allow spaces while typing
  const [rawCategories, setRawCategories] = useState(
    (initialData?.categories ?? []).join(", ")
  );
  const [rawTags, setRawTags] = useState(
    (initialData?.tags ?? []).join(", ")
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [imgError, setImgError] = useState(false);
  const [uploadingFeatured, setUploadingFeatured] = useState(false);
  const [uploadingInline, setUploadingInline] = useState(false);
  const [autosaveStatus, setAutosaveStatus] = useState<
    "idle" | "saving" | "saved"
  >("idle");
  const [serpDevice, setSerpDevice] = useState<"desktop" | "mobile">("desktop");

  const isDirty = useRef(false);
  const postIdRef = useRef(initialData?.id);
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const featuredInputRef = useRef<HTMLInputElement>(null);
  const inlineInputRef = useRef<HTMLInputElement>(null);
  const cursorPosRef = useRef<number>(0);
  const formRef = useRef(form);
  formRef.current = form;

  // Track dirty state for unsaved changes warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty.current) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    };
  }, []);

  // --- Autosave logic ---
  const autosave = useCallback(async () => {
    if (!isDirty.current) return;

    const currentForm = formRef.current;
    if (!currentForm.title.trim()) return;

    setAutosaveStatus("saving");

    try {
      const payload = {
        ...currentForm,
        // Parse raw strings into arrays for save
        categories: parseCommaSeparated(rawCategories),
        tags: parseCommaSeparated(rawTags),
        date: currentForm.date
          ? new Date(currentForm.date).toISOString()
          : null,
      };

      if (postIdRef.current) {
        const res = await fetch(`/api/blogs/${postIdRef.current}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Autosave failed");
      } else {
        const res = await fetch("/api/blogs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Autosave failed");
        const data = await res.json();
        postIdRef.current = data.id;
        window.history.replaceState(null, "", `/admin/blog/${data.id}/edit`);
      }

      isDirty.current = false;
      setAutosaveStatus("saved");
      setTimeout(() => setAutosaveStatus("idle"), 2000);
    } catch {
      setAutosaveStatus("idle");
    }
  }, [rawCategories, rawTags]);

  const scheduleAutosave = useCallback(() => {
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(autosave, AUTOSAVE_DELAY);
  }, [autosave]);

  const updateField = useCallback(
    <K extends keyof BlogData>(key: K, value: BlogData[K]) => {
      isDirty.current = true;
      if (key === "featured_image") setImgError(false);
      setForm((prev) => {
        const next = { ...prev, [key]: value };
        if (key === "title" && !isEdit && !postIdRef.current) {
          next.slug = slugify(value as string);
        }
        return next;
      });
      scheduleAutosave();
    },
    [isEdit, scheduleAutosave]
  );

  // --- Manual save ---
  async function handleSave() {
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    setError("");
    setSaving(true);

    try {
      const payload = {
        ...form,
        categories: parseCommaSeparated(rawCategories),
        tags: parseCommaSeparated(rawTags),
        date: form.date ? new Date(form.date).toISOString() : null,
      };

      const id = postIdRef.current;
      const url = id ? `/api/blogs/${id}` : "/api/blogs";
      const method = id ? "PUT" : "POST";

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

  // --- Featured image upload ---
  async function handleFeaturedUpload(file: File) {
    setUploadingFeatured(true);
    try {
      const url = await uploadImage(file);
      updateField("featured_image", url);
      toast.success("Featured image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingFeatured(false);
    }
  }

  function onFeaturedFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFeaturedUpload(file);
    e.target.value = "";
  }

  function onFeaturedDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) handleFeaturedUpload(file);
  }

  // --- Inline MDX image upload ---
  function onEditorCursorChange(e: React.SyntheticEvent<HTMLTextAreaElement>) {
    cursorPosRef.current = e.currentTarget.selectionStart;
  }

  async function handleInlineUpload(file: File) {
    setUploadingInline(true);
    try {
      const url = await uploadImage(file);
      const markdown = `\n![${file.name}](${url})\n`;
      const pos = cursorPosRef.current;
      const before = form.content.slice(0, pos);
      const after = form.content.slice(pos);
      updateField("content", before + markdown + after);
      toast.success("Image inserted at cursor position");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingInline(false);
    }
  }

  function onInlineFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleInlineUpload(file);
    e.target.value = "";
  }

  function handleEditorPaste(e: React.ClipboardEvent) {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) handleInlineUpload(file);
        return;
      }
    }
  }

  const wordCount = form.content.split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.round(wordCount / 200));

  // SEO display values (fallback to title/description)
  const seoTitleDisplay = form.seo_title || form.title;
  const metaDescDisplay = form.description;

  const inputClass =
    "w-full h-10 px-3.5 rounded-lg border border-gray-200 bg-gray-50/80 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all";
  const labelClass =
    "text-xs font-medium text-gray-500 uppercase tracking-wider";

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
              {isEdit || postIdRef.current ? "Edit Post" : "New Post"}
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
              {autosaveStatus === "saving" && (
                <>
                  <span className="text-gray-300">&middot;</span>
                  <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Saving...
                  </span>
                </>
              )}
              {autosaveStatus === "saved" && (
                <>
                  <span className="text-gray-300">&middot;</span>
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-500">
                    <CheckCircle className="h-3 w-3" />
                    Autosaved
                  </span>
                </>
              )}
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
          <Button onClick={handleSave} disabled={saving} size="sm">
            <Save className="h-3.5 w-3.5 mr-1.5" />
            {saving
              ? "Saving..."
              : isEdit || postIdRef.current
                ? "Update"
                : "Create"}
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
          {/* Title & slug */}
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
          </div>

          {/* SEO Section */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-400" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                SEO
              </h3>
            </div>
            <hr className="border-gray-100" />

            <div className="space-y-1.5">
              <label htmlFor="seo_title" className={labelClass}>
                SEO Title
              </label>
              <input
                id="seo_title"
                value={form.seo_title}
                onChange={(e) => updateField("seo_title", e.target.value)}
                placeholder={form.title || "Keyword-optimized title for search results"}
                maxLength={SEO_TITLE_MAX}
                className={inputClass}
              />
              <p
                className={`text-[11px] ${
                  seoTitleDisplay.length > SEO_TITLE_MAX
                    ? "text-red-500 font-medium"
                    : "text-gray-400"
                }`}
              >
                {seoTitleDisplay.length}/{SEO_TITLE_MAX} characters
                {!form.seo_title && (
                  <span className="text-gray-300"> — falls back to title</span>
                )}
              </p>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="description" className={labelClass}>
                Meta Description
              </label>
              <textarea
                id="description"
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Compelling description for search results (max 160 chars)..."
                rows={3}
                maxLength={META_DESC_MAX}
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 bg-gray-50/80 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
              />
              <p
                className={`text-[11px] ${
                  form.description.length > META_DESC_MAX
                    ? "text-red-500 font-medium"
                    : "text-gray-400"
                }`}
              >
                {form.description.length}/{META_DESC_MAX} characters
              </p>
            </div>

            {/* SERP Preview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Search Preview
                </span>
                <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setSerpDevice("desktop")}
                    className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium transition-colors ${
                      serpDevice === "desktop"
                        ? "bg-gray-900 text-white"
                        : "bg-white text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <Monitor className="h-3 w-3" />
                    Desktop
                  </button>
                  <button
                    type="button"
                    onClick={() => setSerpDevice("mobile")}
                    className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium transition-colors ${
                      serpDevice === "mobile"
                        ? "bg-gray-900 text-white"
                        : "bg-white text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <Smartphone className="h-3 w-3" />
                    Mobile
                  </button>
                </div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <SerpPreview
                  seoTitle={seoTitleDisplay}
                  metaDescription={metaDescDisplay}
                  slug={form.slug}
                  device={serpDevice}
                />
              </div>
            </div>
          </div>

          {/* Content editor */}
          <div
            className="rounded-2xl border border-gray-100 bg-white overflow-hidden"
            onPaste={handleEditorPaste}
          >
            <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-2">
                <FileText className="h-3.5 w-3.5 text-gray-400" />
                <span className="text-xs font-medium text-gray-500">
                  Markdown Editor
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => inlineInputRef.current?.click()}
                  disabled={uploadingInline}
                  className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-emerald-600 transition-colors disabled:opacity-50"
                >
                  {uploadingInline ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <ImagePlus className="h-3.5 w-3.5" />
                  )}
                  {uploadingInline ? "Uploading..." : "Insert Image"}
                </button>
                <input
                  ref={inlineInputRef}
                  type="file"
                  accept="image/*"
                  onChange={onInlineFileChange}
                  className="hidden"
                />
                <span className="text-[11px] text-gray-400">
                  {wordCount.toLocaleString()} words
                </span>
              </div>
            </div>
            <div data-color-mode="light">
              <MDEditor
                value={form.content}
                onChange={(val) => updateField("content", val ?? "")}
                height={600}
                preview="live"
                visibleDragbar={false}
                textareaProps={{
                  onSelect: onEditorCursorChange,
                  onKeyUp: onEditorCursorChange,
                  onClick: onEditorCursorChange,
                }}
              />
            </div>
            <p className="px-6 py-2 text-[11px] text-gray-400 border-t border-gray-100 bg-gray-50/30">
              Paste an image from clipboard to upload, or use the Insert Image
              button above
            </p>
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

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={onFeaturedDrop}
              className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-emerald-300 transition-colors cursor-pointer"
              onClick={() => featuredInputRef.current?.click()}
            >
              {uploadingFeatured ? (
                <div className="flex flex-col items-center gap-2 py-2">
                  <Loader2 className="h-6 w-6 text-emerald-500 animate-spin" />
                  <p className="text-xs text-gray-500">Uploading...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 py-2">
                  <Upload className="h-6 w-6 text-gray-400" />
                  <p className="text-xs text-gray-500">
                    Click or drag an image here
                  </p>
                  <p className="text-[10px] text-gray-400">
                    JPEG, PNG, WebP, AVIF, GIF, SVG (max 5 MB)
                  </p>
                </div>
              )}
              <input
                ref={featuredInputRef}
                type="file"
                accept="image/*"
                onChange={onFeaturedFileChange}
                className="hidden"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="featured_image" className="text-sm text-gray-600">
                Or paste URL
              </label>
              <input
                id="featured_image"
                value={form.featured_image}
                onChange={(e) => updateField("featured_image", e.target.value)}
                placeholder="https://..."
                className={inputClass}
              />
            </div>

            {form.featured_image &&
              (imgError ? (
                <div className="w-full h-36 rounded-xl border border-red-100 bg-red-50 flex flex-col items-center justify-center gap-1">
                  <ImageOff className="h-5 w-5 text-red-400" />
                  <p className="text-xs text-red-500">Failed to load image</p>
                </div>
              ) : (
                <img
                  src={form.featured_image}
                  alt="Preview"
                  className="w-full h-36 object-cover rounded-xl border border-gray-100"
                  onError={() => setImgError(true)}
                />
              ))}
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
                value={rawCategories}
                onChange={(e) => {
                  isDirty.current = true;
                  setRawCategories(e.target.value);
                  scheduleAutosave();
                }}
                onBlur={() => {
                  const parsed = parseCommaSeparated(rawCategories);
                  setForm((prev) => ({ ...prev, categories: parsed }));
                  setRawCategories(parsed.join(", "));
                }}
                placeholder="Digital Marketing, Content Writing"
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
                value={rawTags}
                onChange={(e) => {
                  isDirty.current = true;
                  setRawTags(e.target.value);
                  scheduleAutosave();
                }}
                onBlur={() => {
                  const parsed = parseCommaSeparated(rawTags);
                  setForm((prev) => ({ ...prev, tags: parsed }));
                  setRawTags(parsed.join(", "));
                }}
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

          {/* Internal link suggestions */}
          <InternalLinkSuggestions currentSlug={form.slug} />
        </div>
      </div>
    </div>
  );
}
