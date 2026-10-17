"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Monitor, Smartphone } from "lucide-react";
import { SITE_URL } from "@/lib/constants";
import { boxClass, fieldClass, helpClass } from "./styles";

const META_TITLE_MAX = 60;
const META_DESC_MAX = 160;

type SeoSettingsProps = {
  /** Stored as `seo_title`; the post title is used when empty. */
  metaTitle: string;
  onMetaTitleChange: (value: string) => void;
  /** Stored as `description`. */
  metaDescription: string;
  onMetaDescriptionChange: (value: string) => void;
  canonicalUrl: string;
  onCanonicalUrlChange: (value: string) => void;
  featuredImage?: string;
  /** Post title — the fallback for the meta title in the preview. */
  title: string;
  slug: string;
};

function CharCounter({ current, max, ideal }: { current: number; max: number; ideal: number }) {
  const color =
    current === 0
      ? "text-gray-400"
      : current <= ideal
      ? "text-green-600"
      : current <= max
      ? "text-yellow-600"
      : "text-red-600";
  return (
    <span className={`text-xs font-medium tabular-nums ${color}`}>
      {current}/{max}
    </span>
  );
}

export default function SeoSettings({
  metaTitle,
  onMetaTitleChange,
  metaDescription,
  onMetaDescriptionChange,
  canonicalUrl,
  onCanonicalUrlChange,
  featuredImage,
  title,
  slug,
}: SeoSettingsProps) {
  const displayUrl = SITE_URL.replace(/^https?:\/\//, "");
  const previewTitle = metaTitle || title;
  const previewSlug = slug || "your-post-slug";

  const placeholderTitle = (
    <span className="text-gray-400 italic">Meta title will appear here</span>
  );
  const placeholderDesc = (
    <span className="text-gray-400 italic">Meta description will appear here</span>
  );

  return (
    <div className={`${boxClass} space-y-6`}>
      <h3 className="text-lg font-semibold text-gray-900">SEO Settings</h3>

      {/* Google Search Preview */}
      <div className="space-y-2">
        <Label>Search Preview</Label>
        <Tabs defaultValue="desktop">
          <TabsList className="h-8 w-full grid grid-cols-2 rounded-lg">
            <TabsTrigger value="desktop" className="text-xs gap-1.5 rounded-md px-2 py-1">
              <Monitor size={12} /> Desktop
            </TabsTrigger>
            <TabsTrigger value="mobile" className="text-xs gap-1.5 rounded-md px-2 py-1">
              <Smartphone size={12} /> Mobile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="desktop">
            <div className="p-3 rounded-md border border-gray-200 bg-white text-sm space-y-0.5">
              <p className="text-xs text-gray-500 truncate">
                {displayUrl} <span className="text-gray-400">›</span> {previewSlug}
              </p>
              <p className="text-[#1a0dab] text-lg font-medium leading-snug line-clamp-1 hover:underline cursor-pointer">
                {previewTitle || placeholderTitle}
              </p>
              <p className="text-gray-600 text-sm line-clamp-2 leading-snug">
                {metaDescription || placeholderDesc}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="mobile">
            <div className="flex justify-center">
              <div className="w-[320px] border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden text-sm">
                <div className="bg-gray-100 px-3 py-1.5 flex items-center gap-2 border-b border-gray-200">
                  <div className="flex-1 bg-white rounded-full px-2 py-0.5 text-[10px] text-gray-500 truncate border border-gray-200">
                    {displayUrl}
                  </div>
                </div>
                <div className="p-3 space-y-0.5">
                  <p className="text-[11px] text-gray-500 truncate">
                    {displayUrl} <span className="text-gray-400">›</span> {previewSlug}
                  </p>
                  <p className="text-[#1a0dab] text-sm font-medium leading-snug line-clamp-2">
                    {previewTitle || placeholderTitle}
                  </p>
                  <p className="text-gray-600 text-xs line-clamp-3 leading-snug">
                    {metaDescription || placeholderDesc}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Meta Title */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="metaTitle">Meta Title</Label>
          <CharCounter current={previewTitle.length} max={META_TITLE_MAX} ideal={50} />
        </div>
        <Input
          id="metaTitle"
          value={metaTitle}
          onChange={(e) => onMetaTitleChange(e.target.value)}
          placeholder={title || "50–60 characters recommended"}
          maxLength={META_TITLE_MAX}
          className={fieldClass}
        />
        <p className={helpClass}>
          Appears as the clickable headline in Google search results.
          {!metaTitle && " Falls back to the post title when empty."}
        </p>
      </div>

      {/* Meta Description */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="metaDescription">Meta Description</Label>
          <CharCounter current={metaDescription.length} max={META_DESC_MAX} ideal={150} />
        </div>
        <Textarea
          id="metaDescription"
          value={metaDescription}
          onChange={(e) => onMetaDescriptionChange(e.target.value)}
          placeholder="150–160 characters recommended"
          maxLength={META_DESC_MAX}
          className={fieldClass}
        />
        <p className={helpClass}>
          A concise summary for search engines and social previews.
        </p>
      </div>

      {/* Canonical URL */}
      <div className="space-y-2">
        <Label htmlFor="canonicalUrl">Canonical URL</Label>
        <Input
          id="canonicalUrl"
          value={canonicalUrl}
          onChange={(e) => onCanonicalUrlChange(e.target.value)}
          placeholder={`${SITE_URL}/${previewSlug}`}
          className={fieldClass}
        />
        <p className={helpClass}>
          Only needed when this post also lives elsewhere. Defaults to this post&apos;s own URL.
        </p>
      </div>

      {/* OG Image */}
      <div className="space-y-2">
        <Label>Open Graph Image</Label>
        <div className="p-3 rounded-md bg-gray-50 border border-gray-200 text-sm text-gray-500">
          Uses the <strong className="text-gray-700">Featured Image</strong> for social sharing automatically.
          {featuredImage && (
            <p className="mt-1 truncate text-xs text-emerald-700">{featuredImage}</p>
          )}
        </div>
      </div>

      {/* Schema Type — fixed for this site */}
      <div className="space-y-2">
        <Label>Schema Type</Label>
        <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900">
          <span className="font-mono">BlogPosting</span>{" "}
          <span className="text-gray-500">(auto)</span>
        </div>
        <p className={helpClass}>
          Posts publish as schema.org BlogPosting with author, publisher, dates,
          categories and tags filled in from this form.
        </p>
      </div>
    </div>
  );
}
