"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
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
          // "ezbiz.ssm.gov.my" typed without a scheme would otherwise be saved
          // as a relative link and resolve to freelancemy.com/ezbiz.ssm.gov.my.
          // "https" prefixes it silently instead of prompting.
          link_assume_external_targets: "https",

          // 📷 Upload images through the admin API (service role) so it works
          // regardless of browser storage RLS.
          images_upload_handler: async (blobInfo) => {
            setUploading(true);
            try {
              const filename = blobInfo.filename();
              const file = new File([blobInfo.blob()], filename, {
                type: blobInfo.blob().type,
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

              const form = new FormData();
              form.append("file", uploadFile, filename);

              const res = await fetch("/api/upload", {
                method: "POST",
                body: form,
              });
              if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || `Upload failed (${res.status})`);
              }
              const { url } = await res.json();
              return url as string;
            } catch (err: unknown) {
              const message =
                err instanceof Error ? err.message : "Image upload failed";
              console.error("Image upload error:", message);
              throw new Error(message);
            } finally {
              setUploading(false);
            }
          },

          // 🔗 Internal links must stay followable. link_rel_default puts
          // rel="nofollow" on every link the dialog creates or edits, so strip
          // it (and sponsored/ugc) from our own URLs whenever content is
          // serialized — that covers new links, edited links and pasted HTML.
          // lib/sanitize.ts repeats this on save and render as a backstop.
          setup: (editor) => {
            editor.on("PreInit", () => {
              editor.serializer.addNodeFilter("a", (nodes) => {
                for (const node of nodes) {
                  const href = node.attr("href") ?? "";
                  const isInternal =
                    (href.startsWith("/") && !href.startsWith("//")) ||
                    /^https?:\/\/(www\.)?freelancemy\.com(\/|$)/i.test(href);
                  if (!isInternal) continue;

                  const rel = (node.attr("rel") ?? "")
                    .split(/\s+/)
                    .filter((r) => r && !["nofollow", "sponsored", "ugc"].includes(r));
                  node.attr("rel", rel.length ? rel.join(" ") : null);
                }
              });
            });
          },

          content_style:
            "body { font-family: Helvetica, Arial, sans-serif; font-size: 16px; line-height: 1.6; }",
        }}
      />
    </div>
  );
}
