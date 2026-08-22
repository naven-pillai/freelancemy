import sanitizeHtml from "sanitize-html";

/**
 * Sanitizes admin-authored HTML (from the TinyMCE editor) so it is safe to
 * store and to render via dangerouslySetInnerHTML. Used both on save (in the
 * blog API) and on render (public post page) as defense in depth.
 */
const baseOptions: sanitizeHtml.IOptions = {
  allowedTags: [
    "h1", "h2", "h3", "h4", "h5", "h6",
    "p", "br", "hr",
    "ul", "ol", "li",
    "a", "strong", "b", "em", "i", "u", "s", "mark", "sub", "sup",
    "code", "pre", "blockquote",
    "span", "div",
    "img", "figure", "figcaption",
    // Tables (GFM content + the TinyMCE table plugin)
    "table", "thead", "tbody", "tfoot", "tr", "td", "th", "caption", "colgroup", "col",
    // Media embeds (YouTube/Vimeo) — locked to trusted hosts below
    "iframe",
  ],
  allowedAttributes: {
    a: ["href", "name", "target", "rel", "title"],
    img: ["src", "alt", "title", "width", "height", "loading"],
    iframe: [
      "src", "width", "height", "title", "frameborder",
      "allow", "allowfullscreen", "loading",
    ],
    td: ["colspan", "rowspan"],
    th: ["colspan", "rowspan", "scope"],
    col: ["span"],
    "*": ["class", "id", "style"],
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  // Only allow iframes from known embed providers.
  allowedIframeHostnames: [
    "www.youtube.com", "youtube.com", "www.youtube-nocookie.com",
    "player.vimeo.com",
  ],
  // Force rel on links that open a new tab (avoids reverse-tabnabbing).
  transformTags: {
    a: (tagName, attribs) => {
      if (attribs.target === "_blank") {
        const rel = new Set((attribs.rel ?? "").split(/\s+/).filter(Boolean));
        rel.add("noopener");
        rel.add("noreferrer");
        attribs.rel = Array.from(rel).join(" ");
      }
      return { tagName, attribs };
    },
  },
};

export function sanitize(html: string, extra?: sanitizeHtml.IOptions): string {
  return sanitizeHtml(html, { ...baseOptions, ...extra });
}

/**
 * True when the string contains real markup, so we render it as HTML. Legacy
 * Markdown posts (no tags) fail this check and fall back to the MDX pipeline.
 */
export function looksLikeHtml(value: string): boolean {
  return /<\/?[a-z][\s\S]*>/i.test(value);
}
