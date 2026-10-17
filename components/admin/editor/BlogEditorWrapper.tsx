"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SITE_URL } from "@/lib/constants";
import PublishSettings from "./PublishSettings";
import CategorySelector from "./CategorySelector";
import TagSelector from "./TagSelector";
import SeoSettings from "./SeoSettings";
import ContentScore from "./ContentScore";
import FeaturedImageUploader from "./FeaturedImageUploader";
import InternalLinks from "./InternalLinks";
import type { PostFormState, UpdateField } from "./types";
import { boxClass, fieldClass } from "./styles";

type BlogEditorWrapperProps = {
  children: React.ReactNode;
  form: PostFormState;
  update: UpdateField;
  categoryOptions: string[];
  onCategoryOptionsChange: (next: string[]) => void;
};

/**
 * Two-column editor layout. The main column carries the shared editors passed
 * as children (title, slug, summary, body) followed by publish settings, post
 * details and SEO. The sidebar carries the live Content Score, the featured
 * image uploader and internal-link lookup.
 */
export default function BlogEditorWrapper({
  children,
  form,
  update,
  categoryOptions,
  onCategoryOptionsChange,
}: BlogEditorWrapperProps) {
  // What the public page actually emits — the analyzer should score that,
  // not the raw (possibly empty) override fields.
  const effectiveMetaTitle = form.seo_title || form.title;
  const effectiveCanonical =
    form.canonical_url || (form.slug ? `${SITE_URL}/${form.slug}` : "");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Editor */}
      <div className="lg:col-span-2 space-y-8">
        {children}

        <PublishSettings
          status={form.status}
          onStatusChange={(s) => update("status", s)}
          publishedAt={form.date}
          onPublishedAtChange={(d) => update("date", d)}
          isFeatured={form.is_featured}
          onFeaturedChange={(v) => update("is_featured", v)}
        />

        <div className={boxClass}>
          <h3 className="text-lg font-semibold text-gray-900">Post Details</h3>

          <CategorySelector
            value={form.category}
            onChange={(c) => update("category", c)}
            options={categoryOptions}
            onOptionsChange={onCategoryOptionsChange}
          />
          <TagSelector tags={form.tags} onTagsChange={(t) => update("tags", t)} />

          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              value={form.author}
              onChange={(e) => update("author", e.target.value)}
              className={fieldClass}
            />
          </div>
        </div>

        <SeoSettings
          metaTitle={form.seo_title}
          onMetaTitleChange={(v) => update("seo_title", v)}
          metaDescription={form.description}
          onMetaDescriptionChange={(v) => update("description", v)}
          canonicalUrl={form.canonical_url}
          onCanonicalUrlChange={(v) => update("canonical_url", v)}
          featuredImage={form.featured_image}
          title={form.title}
          slug={form.slug}
        />
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <ContentScore
          content={form.content}
          title={form.title}
          slug={form.slug}
          metaTitle={effectiveMetaTitle}
          metaDescription={form.description}
          featuredImage={form.featured_image}
          altText={form.featured_image ? form.title : ""}
          canonicalUrl={effectiveCanonical}
          schemaType="BlogPosting"
          tags={form.tags}
        />

        <FeaturedImageUploader
          featuredImage={form.featured_image}
          onFeaturedImageChange={(url) => update("featured_image", url)}
        />

        <InternalLinks currentSlug={form.slug} />
      </div>
    </div>
  );
}
