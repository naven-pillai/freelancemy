"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Editor as TinyMCEEditorType } from "tinymce";
import imageCompression from "browser-image-compression";

const Editor = dynamic(
  () => import("@tinymce/tinymce-react").then((m) => m.Editor),
  { ssr: false }
);

export type TinyMCEEditorProps = {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
  /**
   * 'full' is the post body. 'compact' is for short rich text like the summary:
   * a lower box, no menubar, and only the formatting that makes sense in a few
   * sentences — no images, media or tables.
   */
  variant?: "full" | "compact";
  placeholder?: string;
};

const COMPACT_PLUGINS = "advlist autolink lists link charmap wordcount";
const COMPACT_TOOLBAR = "bold italic | bullist numlist | link | removeformat";

export default function TinyMCEEditor({
  value,
  onChange,
  disabled = false,
  variant = "full",
  placeholder,
}: TinyMCEEditorProps) {
  const compact = variant === "compact";
  const editorRef = useRef<TinyMCEEditorType | null>(null);
  const [uploading, setUploading] = useState(false);

  return (
    <div className="relative">
      {uploading && (
        <div className="absolute inset-0 z-50 bg-white/60 flex items-center justify-center rounded-lg">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      <Editor
        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
        value={value}
        disabled={disabled}
        onInit={(_, editor) => {
          editorRef.current = editor;
        }}
        onEditorChange={(content) => {
          if (!disabled) onChange(content);
        }}
        init={{
          height: compact ? 200 : 600,
          menubar: !compact,
          statusbar: !compact,
          placeholder,

          // Without this TinyMCE defaults to 'named' and rewrites every
          // apostrophe and curly quote to &rsquo;/&ldquo; on each save.
          entity_encoding: "raw",

          plugins: compact
            ? COMPACT_PLUGINS
            : "advlist autolink lists link image charmap preview anchor " +
              "searchreplace visualblocks code fullscreen insertdatetime media " +
              "table help wordcount",
          toolbar: compact
            ? COMPACT_TOOLBAR
            : "undo redo | blocks | bold italic underline | " +
              "alignleft aligncenter alignright alignjustify | " +
              "bullist numlist outdent indent | link image media table | " +
              "blockquote code | removeformat | help",

          // SEO-safe links
          link_title: true,
          link_context_toolbar: true,
          link_default_target: "_blank",
          link_rel_default: "nofollow",
          link_rel_list: [
            { title: "NoFollow (default)", value: "nofollow" },
            { title: "Follow", value: "" },
            { title: "Sponsored", value: "sponsored" },
          ],
          link_target_list: [
            { title: "New tab", value: "_blank" },
            { title: "Same tab", value: "_self" },
          ],
          link_assume_external_targets: true,

          // 📷 Auto-upload images to Supabase blog-images bucket
          images_upload_handler: async (blobInfo) => {
            setUploading(true);
            try {
              const supabase = createClient();
              const originalBlob = blobInfo.blob();
              const filename = blobInfo.filename();
              const filePath = `content-images/${Date.now()}-${filename}`;

              const file = new File([originalBlob], filename, {
                type: originalBlob.type,
                lastModified: Date.now(),
              });

              // Only compress genuinely large photos; re-encoding small,
              // text-heavy images (screenshots/diagrams) just softens the text.
              const COMPRESS_ABOVE_BYTES = 2 * 1024 * 1024; // 2 MB
              const uploadFile =
                file.size > COMPRESS_ABOVE_BYTES
                  ? await imageCompression(file, {
                      maxSizeMB: 3,
                      maxWidthOrHeight: 2200,
                      useWebWorker: true,
                    })
                  : file;

              const { error: uploadError } = await supabase.storage
                .from("blog-images")
                .upload(filePath, uploadFile, {
                  cacheControl: "3600",
                  upsert: false,
                });

              if (uploadError) throw uploadError;

              const {
                data: { publicUrl },
              } = supabase.storage.from("blog-images").getPublicUrl(filePath);

              return publicUrl;
            } catch (err: unknown) {
              const message =
                err instanceof Error ? err.message : "Image upload failed";
              console.error("Image upload error:", message);
              throw new Error("Image upload failed");
            } finally {
              setUploading(false);
            }
          },

          // 🔗 Fix rel/target for links (nofollow external, clean internal)
          setup: (editor) => {
            editor.on("ExecCommand", (e) => {
              if (e.command === "mceInsertLink") {
                const node = editor.selection.getNode();
                if (node?.nodeName === "A") {
                  const href = node.getAttribute("href") || "";
                  const isInternal =
                    href.startsWith("/") ||
                    href.includes("freelancemy.com");

                  node.setAttribute("target", "_blank");

                  if (isInternal) {
                    node.removeAttribute("rel");
                  } else if (!node.getAttribute("rel")) {
                    node.setAttribute("rel", "nofollow");
                  }
                }
              }
            });
          },

          content_style:
            "body { font-family: Helvetica, Arial, sans-serif; font-size: 16px; line-height: 1.6; }",
        }}
      />
    </div>
  );
}
