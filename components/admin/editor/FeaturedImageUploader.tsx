"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { fieldClass, helpClass } from "./styles";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/svg+xml",
];
const MAX_SIZE_MB = 5;

type Props = {
  featuredImage: string;
  onFeaturedImageChange: (url: string) => void;
};

async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: formData });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { error?: string }).error || "Upload failed");
  }
  const { url } = (await res.json()) as { url: string };
  return url;
}

export default function FeaturedImageUploader({
  featuredImage,
  onFeaturedImageChange,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [broken, setBroken] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Reset so the same file can be re-selected
    e.target.value = "";
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Only JPEG, PNG, WebP, AVIF, GIF and SVG images are allowed");
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`Image must be under ${MAX_SIZE_MB}MB`);
      return;
    }

    setUploading(true);
    try {
      const url = await uploadImage(file);
      setBroken(false);
      onFeaturedImageChange(url);
      toast.success("Featured image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label>Featured Image</Label>

      {featuredImage && !broken ? (
        <div className="relative w-full h-48 rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={featuredImage}
            alt="Featured preview"
            className="h-full w-full object-cover"
            onError={() => setBroken(true)}
          />
          <div className="absolute top-2 right-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                onFeaturedImageChange("");
                setBroken(false);
              }}
            >
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div className="w-full h-48 rounded-lg border border-gray-200 flex items-center justify-center text-sm text-gray-500 bg-gray-50">
          {featuredImage && broken ? "Image failed to load" : "No image selected"}
        </div>
      )}

      <Input
        type="file"
        accept={ALLOWED_TYPES.join(",")}
        onChange={handleFileChange}
        disabled={uploading}
        className={`${fieldClass} file:text-gray-700`}
      />
      {uploading && <p className={helpClass}>Uploading…</p>}

      <Input
        type="url"
        placeholder="…or paste an image URL"
        value={featuredImage}
        onChange={(e) => {
          setBroken(false);
          onFeaturedImageChange(e.target.value);
        }}
        className={fieldClass}
      />
      <p className={helpClass}>
        JPEG, PNG, WebP, AVIF, GIF or SVG up to {MAX_SIZE_MB} MB. The post title is used
        as the image&apos;s alt text.
      </p>
    </div>
  );
}
