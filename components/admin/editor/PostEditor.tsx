"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import TinyMCEEditor from "@/components/admin/TinyMCEEditor";
import { AUTHOR_NAME } from "@/lib/constants";
import { slugify } from "@/lib/slugify";
import type { BlogRow, BlogStatus } from "@/types/blog";
import BlogEditorWrapper from "./BlogEditorWrapper";
import TitleInput from "./TitleInput";
import SlugInput from "./SlugInput";
import type { PostFormState, UpdateField } from "./types";

const AUTOSAVE_DEBOUNCE_MS = 15_000;

type Props = {
  mode: "new" | "edit";
  initialPost?: BlogRow;
  /** Category names already used across posts, for the dropdown. */
  categoryOptions: string[];
};

function toFormState(row?: BlogRow): PostFormState {
  return {
    title: row?.title ?? "",
    slug: row?.slug ?? "",
    summary: row?.summary ?? "",
    content: row?.content ?? "",
    status: row?.status ?? "draft",
    date: row?.date ?? null,
    is_featured: row?.is_featured ?? false,
    category: row?.categories?.[0] ?? null,
    tags: row?.tags ?? [],
    author: row?.author ?? AUTHOR_NAME,
    seo_title: row?.seo_title ?? "",
    description: row?.description ?? "",
    canonical_url: row?.canonical_url ?? "",
    featured_image: row?.featured_image ?? "",
  };
}

/** Shape the API routes (and validate-blog) expect. */
function toPayload(
  f: PostFormState,
  overrides: Partial<Pick<PostFormState, "title" | "slug" | "status" | "date">> = {}
) {
  const m = { ...f, ...overrides };
  return {
    title: m.title.trim(),
    slug: m.slug.trim(),
    summary: m.summary,
    content: m.content,
    status: m.status,
    date: m.date,
    is_featured: m.is_featured,
    categories: m.category ? [m.category] : [],
    tags: m.tags,
    author: m.author.trim(),
    seo_title: m.seo_title.trim(),
    description: m.description.trim(),
    canonical_url: m.canonical_url.trim(),
    featured_image: m.featured_image.trim(),
  };
}

type ApiResult =
  | { ok: true; data: Record<string, unknown> }
  | { ok: false; error: string };

async function callApi(url: string, method: "POST" | "PUT", body: unknown): Promise<ApiResult> {
  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    if (!res.ok) {
      return { ok: false, error: (data.error as string | undefined) || `Request failed (${res.status})` };
    }
    return { ok: true, data };
  } catch {
    return { ok: false, error: "Network error — please try again" };
  }
}

export default function PostEditor({ mode, initialPost, categoryOptions: initialOptions }: Props) {
  const router = useRouter();
  const isNew = mode === "new";

  const [form, setForm] = useState<PostFormState>(() => toFormState(initialPost));
  const [categoryOptions, setCategoryOptions] = useState<string[]>(initialOptions);
  const [postId, setPostId] = useState<string | null>(initialPost?.id ?? null);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Refs let the debounced autosave read fresh values without being a
  // dependency of the effect that schedules it.
  const formRef = useRef(form);
  const idRef = useRef(postId);
  const isDirtyRef = useRef(false);
  // On an existing post the slug never follows the title (it's a live URL).
  const slugEditedRef = useRef(!isNew);

  useEffect(() => {
    formRef.current = form;
  }, [form]);

  useEffect(() => {
    idRef.current = postId;
  }, [postId]);

  // Warn before navigating away with unsaved changes.
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirtyRef.current) e.preventDefault();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const update: UpdateField = useCallback((key, value) => {
    isDirtyRef.current = true;
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleTitleChange = (title: string) => {
    isDirtyRef.current = true;
    setForm((prev) => ({
      ...prev,
      title,
      slug: slugEditedRef.current ? prev.slug : slugify(title),
    }));
  };

  const handleSlugChange = (slug: string) => {
    slugEditedRef.current = true;
    update("slug", slug);
  };

  /**
   * Save the current form.
   *  - Inserts a new row if we don't have an id yet, then moves the URL to
   *    the edit route so a reload doesn't create a second draft.
   *  - Updates the existing row otherwise.
   * Returns the post id, or null on failure.
   */
  const saveDraft = useCallback(
    async (opts: { silent?: boolean } = {}): Promise<string | null> => {
      const silent = opts.silent ?? false;
      const f = formRef.current;
      const currentId = idRef.current;

      if (!currentId && !f.title.trim() && !f.content.trim()) {
        if (!silent) toast.error("Add a title or some content first.");
        return null;
      }

      setSaving(true);
      try {
        // "Save draft" on a new post always saves as a draft; on an existing
        // post the status select is respected.
        const status: BlogStatus = isNew ? "draft" : f.status;
        const title = f.title.trim() || "Untitled draft";
        const slug = f.slug.trim() || slugify(title) || `draft-${Date.now()}`;
        const payload = toPayload(f, { status, title, slug });

        const result = currentId
          ? await callApi(`/api/blogs/${currentId}`, "PUT", payload)
          : await callApi("/api/blogs", "POST", payload);

        if (!result.ok) {
          if (!silent) toast.error(result.error);
          return null;
        }

        const id = currentId ?? (result.data.id as string);
        if (!currentId) {
          setPostId(id);
          idRef.current = id;
          window.history.replaceState(null, "", `/admin/blog/${id}/edit`);
        }

        // Mirror the fallbacks the server now holds.
        setForm((prev) => ({ ...prev, title: prev.title.trim() ? prev.title : title, slug, status }));
        isDirtyRef.current = false;
        setLastSaved(new Date());
        if (!silent) toast.success(isNew ? "Draft saved" : "Changes saved");
        return id;
      } finally {
        setSaving(false);
      }
    },
    [isNew]
  );

  // Debounced autosave — fires after 15s of no changes. Only `form` is a dep;
  // saveDraft reads fresh state via refs, so unrelated re-renders don't reset
  // the timer.
  useEffect(() => {
    if (!isDirtyRef.current) return;
    if (!form.title.trim() && !form.content.trim()) return;

    const timer = setTimeout(() => {
      if (isDirtyRef.current) void saveDraft({ silent: true });
    }, AUTOSAVE_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [form, saveDraft]);

  const validate = (): boolean => {
    const f = formRef.current;
    if (!f.title.trim()) {
      toast.error("Title is required");
      return false;
    }
    if (!f.slug.trim()) {
      toast.error("Slug is required");
      return false;
    }
    return true;
  };

  const finish = (message: string) => {
    isDirtyRef.current = false;
    toast.success(message);
    router.push("/admin/blog");
    router.refresh();
  };

  const handlePublish = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      let id = idRef.current;
      if (!id) {
        id = await saveDraft({ silent: true });
        if (!id) {
          toast.error("Couldn't create the draft. Check the fields and try again.");
          return;
        }
      }
      const f = formRef.current;
      // The writer's chosen publish date wins; otherwise publish "now".
      const date = f.date ?? new Date().toISOString();
      const result = await callApi(`/api/blogs/${id}`, "PUT", toPayload(f, { status: "published", date }));
      if (!result.ok) {
        toast.error("Failed to publish: " + result.error);
        return;
      }
      finish("Post published");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    const id = idRef.current;
    if (!id || !validate()) return;
    setSubmitting(true);
    try {
      const f = formRef.current;
      const date = f.status === "published" ? f.date ?? new Date().toISOString() : f.date;
      const result = await callApi(`/api/blogs/${id}`, "PUT", toPayload(f, { date }));
      if (!result.ok) {
        toast.error("Failed to update post: " + result.error);
        return;
      }
      finish("Blog post updated");
    } finally {
      setSubmitting(false);
    }
  };

  const busy = saving || submitting;
  const statusText = saving
    ? "Saving..."
    : lastSaved
      ? `Last saved ${lastSaved.toLocaleTimeString()}`
      : postId
        ? isNew ? "Draft loaded" : ""
        : "Not saved yet";

  return (
    <div className="max-w-5xl space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">
        {isNew ? "New Blog Post" : "Edit Post"}
      </h1>

      <BlogEditorWrapper
        form={form}
        update={update}
        categoryOptions={categoryOptions}
        onCategoryOptionsChange={setCategoryOptions}
      >
        <TitleInput value={form.title} onChange={handleTitleChange} />
        <SlugInput value={form.slug} onChange={handleSlugChange} />

        {/* Summary — an optional short TL;DR rendered as a callout at the top
            of the public post. */}
        <div className="space-y-2">
          <div>
            <h3 className="text-base font-semibold text-gray-900">Summary (TL;DR)</h3>
            <p className="text-xs text-gray-500">
              A short summary — 2–4 bullets or a couple of sentences — shown in a
              highlighted box at the top of the post, for the reader who wants the
              takeaway before committing to the full read. Leave blank to skip.
            </p>
          </div>
          <TinyMCEEditor
            variant="compact"
            value={form.summary}
            onChange={(val) => {
              if (val !== formRef.current.summary) update("summary", val);
            }}
            placeholder="A short note on what this post covers."
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-base font-semibold text-gray-900">Content</h3>
          <TinyMCEEditor
            value={form.content}
            onChange={(val) => {
              if (val !== formRef.current.content) update("content", val);
            }}
          />
        </div>
      </BlogEditorWrapper>

      <div className="flex flex-col sm:flex-row gap-3 items-center pt-4">
        {isNew ? (
          <>
            <Button variant="outline" onClick={() => void saveDraft()} disabled={busy}>
              {saving ? "Saving draft..." : "Save draft"}
            </Button>
            <Button onClick={handlePublish} disabled={busy}>
              {submitting ? "Publishing..." : "Save & Publish"}
            </Button>
          </>
        ) : (
          <Button onClick={handleUpdate} disabled={busy}>
            {submitting ? "Updating..." : "Update Post"}
          </Button>
        )}

        <Button
          variant={isNew ? "ghost" : "outline"}
          onClick={() => router.push("/admin/blog")}
          disabled={busy}
        >
          Cancel
        </Button>

        <span className="text-sm text-gray-400">{statusText}</span>
      </div>
    </div>
  );
}
