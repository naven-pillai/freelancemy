import sanitizeHtml from "sanitize-html";
import { SITE_URL } from "@/lib/constants";

const SITE_HOST = new URL(SITE_URL).hostname; // "freelancemy.com"

/**
 * rel values that tell search engines not to pass equity. They are right for
 * external links, but on a link to one of our own pages they just stop
 * crawlers following it (Semrush/Ahrefs report "Blocked (No Follow Attribute)").
 */
const REL_NOT_FOR_INTERNAL = new Set(["nofollow", "sponsored", "ugc"]);

/**
 * File extensions that could be mistaken for a TLD in a relative href such as
 * "guide.pdf" or "page.html". Those stay relative.
 */
const NOT_A_TLD = new Set([
  "html", "htm", "php", "asp", "aspx", "jsp", "pdf", "png", "jpg", "jpeg",
  "gif", "webp", "svg", "avif", "css", "js", "json", "xml", "txt", "md",
  "zip", "mp4", "mp3", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "csv", "ico",
]);

/**
 * "ezbiz.ssm.gov.my", "www.example.com/path" — a hostname typed without a
 * scheme. Browsers resolve these relative to the current page, which on the
 * live site turns into https://freelancemy.com/ezbiz.ssm.gov.my (a 404).
 */
const BARE_DOMAIN_RE =
  /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+([a-z]{2,63})(?::\d{1,5})?(?=[/?#]|$)/i;

function looksLikeBareDomain(href: string): boolean {
  const match = BARE_DOMAIN_RE.exec(href);
  return !!match && !NOT_A_TLD.has(match[1].toLowerCase());
}

/** Drop a trailing slash from the path part, but leave the site root alone. */
function stripTrailingSlash(href: string): string {
  const match = /^([^?#]*)([?#].*)?$/.exec(href);
  if (!match) return href;
  const [, path, rest = ""] = match;
  const isRoot = /^(?:https?:\/\/[^/]+)?\/$/.test(path);
  return (isRoot ? path : path.replace(/\/+$/, "")) + rest;
}

/**
 * Normalize one <a> tag's attributes so the rendered site stays crawlable:
 *
 *  - scheme-less external links ("ezbiz.ssm.gov.my") get "https://"
 *  - links to our own pages use https + the bare host, lose
 *    nofollow/sponsored/ugc, and lose the trailing slash (Next.js would
 *    otherwise answer them with a 308 redirect)
 *  - target="_blank" always carries noopener noreferrer (reverse-tabnabbing)
 *
 * Runs on save (API) and on render (post page), and is also what the
 * scripts/fix-content-links.ts repair script applies to stored posts.
 */
export function normalizeLinkAttribs(
  attribs: Record<string, string>
): Record<string, string> {
  const out = { ...attribs };
  let href = (out.href ?? "").trim();

  if (href && looksLikeBareDomain(href)) {
    href = `https://${href}`;
  }

  let internal = false;
  if (href.startsWith("/") && !href.startsWith("//")) {
    internal = true;
  } else if (/^https?:\/\//i.test(href)) {
    try {
      const url = new URL(href);
      const host = url.hostname.toLowerCase();
      if (host === SITE_HOST || host === `www.${SITE_HOST}`) {
        internal = true;
        url.protocol = "https:";
        url.hostname = SITE_HOST;
        href = url.toString();
      }
    } catch {
      // Not a parseable URL — sanitize-html will still vet the scheme.
    }
  }

  if (internal) {
    href = stripTrailingSlash(href);
  }

  const rel = new Set((out.rel ?? "").split(/\s+/).filter(Boolean));
  if (internal) {
    for (const value of REL_NOT_FOR_INTERNAL) rel.delete(value);
  }
  if (out.target === "_blank") {
    rel.add("noopener");
    rel.add("noreferrer");
  }
  if (rel.size) out.rel = Array.from(rel).join(" ");
  else delete out.rel;

  if (href) out.href = href;
  return out;
}

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
  // Restrict inline styles to a safe whitelist (alignment/indent from TinyMCE)
  // rather than allowing arbitrary CSS.
  allowedStyles: {
    "*": {
      "text-align": [/^(?:left|right|center|justify)$/],
      "padding-left": [/^\d{1,3}(?:\.\d+)?(?:px|em|rem)$/],
      "margin-left": [/^\d{1,3}(?:\.\d+)?(?:px|em|rem)$/],
    },
  },
  // Only allow iframes from known embed providers.
  allowedIframeHostnames: [
    "www.youtube.com", "youtube.com", "www.youtube-nocookie.com",
    "player.vimeo.com",
  ],
  // Link hygiene: see normalizeLinkAttribs.
  transformTags: {
    a: (tagName, attribs) => ({ tagName, attribs: normalizeLinkAttribs(attribs) }),
  },
};

export function sanitize(html: string, extra?: sanitizeHtml.IOptions): string {
  return sanitizeHtml(html, { ...baseOptions, ...extra });
}

/**
 * True when the content is our editor/HTML output (it begins with a block-level
 * tag), false for Markdown. Checking the START — not just "contains a tag" — is
 * what keeps Markdown that happens to embed some inline HTML on the MDX path
 * instead of being dumped out raw.
 */
export function looksLikeHtml(value: string): boolean {
  return /^\s*<(?:p|h[1-6]|ul|ol|li|div|figure|table|blockquote|pre|img|section|article|hr|br|span|a|strong|em)\b/i.test(
    value
  );
}
