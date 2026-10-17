// lib/content-analyzer.ts
// Pure analysis engine — runs entirely in the browser via DOMParser.
// No network calls, no API cost. Import only in client components.
//
// Ported from the navenpillai.com admin. Site-specific adaptations:
//  - internal/external links are judged against SITE_URL's host
//  - the post title renders as the page <h1>, so the body should contain none
//  - the schema type is fixed (BlogPosting) and only checked for presence

import { SITE_URL } from "@/lib/constants";

const SITE_HOST = new URL(SITE_URL).hostname;

export type CheckStatus = "pass" | "warning" | "fail";

export interface Check {
  id: string;
  label: string;
  status: CheckStatus;
  suggestion: string | null; // null = passing, no suggestion needed
}

export interface CategoryResult {
  score: number; // 0–100
  checks: Check[];
}

export interface AnalysisResult {
  overall: number;
  seo: CategoryResult;
  aio: CategoryResult;
  geo: CategoryResult;
  readability: CategoryResult;
  wordCount: number;
  readingTime: number;
  fleschScore: number;
}

export interface AnalysisInput {
  content: string;       // Raw TinyMCE HTML
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  featuredImage: string;
  altText: string;
  canonicalUrl: string;
  schemaType: string;
  tags: string[];
  focusKeyword: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function parseHtml(html: string): Document {
  if (typeof window === "undefined") {
    return { body: { innerText: "", textContent: "", querySelectorAll: () => [], childNodes: [] } } as unknown as Document;
  }
  return new DOMParser().parseFromString(html || "", "text/html");
}

function getText(doc: Document): string {
  return doc.body?.innerText || doc.body?.textContent || "";
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function contains(text: string, keyword: string): boolean {
  if (!keyword || !text) return false;
  return text.toLowerCase().includes(keyword.toLowerCase());
}

interface WeightedCheck extends Check {
  weight: number;
}

function scoreChecks(checks: WeightedCheck[]): number {
  const totalWeight = checks.reduce((s, c) => s + c.weight, 0);
  if (totalWeight === 0) return 0;
  const earned = checks.reduce((s, c) => {
    const multiplier = c.status === "pass" ? 1 : c.status === "warning" ? 0.5 : 0;
    return s + c.weight * multiplier;
  }, 0);
  return Math.round((earned / totalWeight) * 100);
}

function countOccurrences(text: string, keyword: string): number {
  if (!keyword || !text) return 0;
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return (text.toLowerCase().match(new RegExp(escaped.toLowerCase(), "g")) || []).length;
}

function getSentences(text: string): string[] {
  return text.split(/[.!?]+/).map((s) => s.trim()).filter((s) => s.split(/\s+/).filter(Boolean).length > 1);
}

function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!word.length) return 0;
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "");
  word = word.replace(/^y/, "");
  const matches = word.match(/[aeiouy]{1,2}/g);
  return Math.max(1, matches ? matches.length : 1);
}

export function calcFleschScore(text: string): number {
  const sentences = getSentences(text);
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (!sentences.length || !words.length) return 0;
  const syllables = words.reduce((sum, w) => sum + countSyllables(w), 0);
  const avgWords = words.length / sentences.length;
  const avgSyllables = syllables / words.length;
  return Math.max(0, Math.min(100, Math.round(206.835 - 1.015 * avgWords - 84.6 * avgSyllables)));
}

function isInternalHref(href: string): boolean {
  return href.startsWith("/") || href.includes(SITE_HOST);
}

// ─── SEO Analysis ───────────────────────────────────────────────────────────

function analyzeSeo(input: AnalysisInput, doc: Document, wordCount: number): CategoryResult {
  const { title, slug, metaTitle, metaDescription, featuredImage, altText, focusKeyword } = input;
  const kw = focusKeyword.trim().toLowerCase();
  const hasKw = kw.length > 0;

  const paragraphs = Array.from(doc.querySelectorAll("p"));
  const h2s = Array.from(doc.querySelectorAll("h2"));
  const allHeadings = Array.from(doc.querySelectorAll("h2, h3"));
  const links = Array.from(doc.querySelectorAll("a[href]"));

  const internalLinks = links.filter((a) => isInternalHref(a.getAttribute("href") || ""));
  const externalLinks = links.filter((a) => {
    const href = a.getAttribute("href") || "";
    return href.startsWith("http") && !href.includes(SITE_HOST);
  });

  const firstParaText = paragraphs[0]?.textContent || "";
  const first150Words = firstParaText.split(/\s+/).slice(0, 150).join(" ");

  const checks: WeightedCheck[] = [];

  // 1. Word count
  {
    let status: CheckStatus;
    let suggestion: string | null = null;
    if (wordCount >= 1500) {
      status = "pass";
    } else if (wordCount >= 800) {
      status = "warning";
      suggestion = `Your content is ${wordCount} words. Aim for 1,500+ words — longer content ranks significantly higher in organic search.`;
    } else {
      status = "fail";
      suggestion = `Only ${wordCount} words detected. Search engines heavily favour long-form content. Add more depth, examples, and context to reach at least 1,500 words.`;
    }
    checks.push({ id: "word-count", label: `Word count (${wordCount} words)`, status, suggestion, weight: 15 });
  }

  // 2. Meta title length
  {
    const len = metaTitle.length;
    let status: CheckStatus;
    let suggestion: string | null = null;
    if (len >= 50 && len <= 60) {
      status = "pass";
    } else if (len >= 40 && len <= 70) {
      status = "warning";
      suggestion = `Meta title is ${len} characters. The ideal range is 50–60 — titles outside this range may be truncated in search results.`;
    } else if (len === 0) {
      status = "fail";
      suggestion = "No meta title set. This is the clickable headline shown in Google — it's one of the strongest on-page SEO signals.";
    } else {
      status = "fail";
      suggestion = `Meta title is ${len} characters — ${len < 50 ? "too short" : "too long"}. Rewrite it to be 50–60 characters for optimal search display.`;
    }
    checks.push({ id: "meta-title-length", label: `Meta title (${len}/60 chars)`, status, suggestion, weight: 8 });
  }

  // 3. Meta description length
  {
    const len = metaDescription.length;
    let status: CheckStatus;
    let suggestion: string | null = null;
    if (len >= 150 && len <= 160) {
      status = "pass";
    } else if (len >= 120 && len <= 175) {
      status = "warning";
      suggestion = `Meta description is ${len} characters. The sweet spot is 150–160 for full display without truncation.`;
    } else if (len === 0) {
      status = "fail";
      suggestion = "No meta description set. Write a compelling 150–160 character summary — it directly affects your click-through rate in search results.";
    } else {
      status = "fail";
      suggestion = `Meta description is ${len} characters — ${len < 120 ? "too short to be informative" : "too long and will be truncated"}. Rewrite it to 150–160 characters.`;
    }
    checks.push({ id: "meta-desc-length", label: `Meta description (${len}/160 chars)`, status, suggestion, weight: 8 });
  }

  // 4–8. Focus keyword checks
  const slugKw = kw.replace(/\s+/g, "-");
  const kwChecks: Array<{ id: string; label: string; value: string; kw: string; tip: string; weight: number }> = [
    { id: "kw-title", label: "Keyword in post title", value: title, kw, tip: `Add "${focusKeyword}" to your post title — this is the single strongest keyword placement.`, weight: 10 },
    { id: "kw-meta", label: "Keyword in meta description", value: metaDescription, kw, tip: `Include "${focusKeyword}" in your meta description to reinforce relevance to search engines.`, weight: 8 },
    { id: "kw-slug", label: "Keyword in URL slug", value: slug, kw: slugKw, tip: `Add "${slugKw}" to your URL slug. Keyword-rich slugs improve click-through rates.`, weight: 8 },
    { id: "kw-intro", label: "Keyword in introduction", value: first150Words, kw, tip: `Use "${focusKeyword}" in the opening paragraph. Search engines weight early keyword mentions more heavily.`, weight: 8 },
  ];

  for (const c of kwChecks) {
    if (!hasKw) {
      checks.push({ id: c.id, label: c.label, status: "warning", suggestion: "Set a focus keyword above to check keyword placement.", weight: c.weight });
    } else {
      const pass = contains(c.value, c.kw);
      checks.push({ id: c.id, label: c.label, status: pass ? "pass" : "fail", suggestion: pass ? null : c.tip, weight: c.weight });
    }
  }

  // Keyword in headings
  {
    if (!hasKw) {
      checks.push({ id: "kw-headings", label: "Keyword in headings", status: "warning", suggestion: "Set a focus keyword to check heading optimisation.", weight: 7 });
    } else {
      const found = allHeadings.some((h) => contains(h.textContent || "", kw));
      checks.push({
        id: "kw-headings",
        label: "Keyword in subheadings",
        status: found ? "pass" : "fail",
        suggestion: found ? null : `Include "${focusKeyword}" in at least one H2 or H3 heading to strengthen topical relevance signals.`,
        weight: 7,
      });
    }
  }

  // 9. H2 count
  {
    const count = h2s.length;
    let status: CheckStatus;
    let suggestion: string | null = null;
    if (count >= 3) { status = "pass"; }
    else if (count >= 1) { status = "warning"; suggestion = `Only ${count} H2 heading(s). Add more subheadings to structure your content — aim for at least one H2 every 300 words.`; }
    else { status = "fail"; suggestion = "No H2 headings found. Use subheadings to break up your content — they improve readability, scannability, and help Google understand your content structure."; }
    checks.push({ id: "h2-count", label: `Subheadings (${count} H2s)`, status, suggestion, weight: 7 });
  }

  // 10. Internal links
  {
    const count = internalLinks.length;
    let status: CheckStatus;
    let suggestion: string | null = null;
    if (count >= 3) { status = "pass"; }
    else if (count >= 1) { status = "warning"; suggestion = `Only ${count} internal link(s). Add at least 3 links to related posts to improve site authority and reduce bounce rate.`; }
    else { status = "fail"; suggestion = "No internal links found. Link to 3+ related posts — internal linking distributes page authority, keeps readers on your site, and is a key SEO signal."; }
    checks.push({ id: "internal-links", label: `Internal links (${count})`, status, suggestion, weight: 7 });
  }

  // 11. External links
  {
    const count = externalLinks.length;
    checks.push({
      id: "external-links",
      label: `External links (${count})`,
      status: count >= 1 ? "pass" : "warning",
      suggestion: count >= 1 ? null : "Link to at least one reputable external source. Outbound links to authoritative sites signal credibility to search engines.",
      weight: 5,
    });
  }

  // 12. Featured image
  {
    checks.push({
      id: "featured-image",
      label: "Featured image",
      status: featuredImage ? "pass" : "fail",
      suggestion: featuredImage ? null : "Add a featured image. Posts with images get significantly more clicks from search results and social shares.",
      weight: 5,
    });
  }

  // 13. Alt text
  {
    if (!featuredImage) {
      checks.push({ id: "alt-text", label: "Image alt text", status: "warning", suggestion: "Add a featured image first — its alt text is taken from the post title.", weight: 4 });
    } else {
      checks.push({
        id: "alt-text",
        label: "Image alt text",
        status: altText ? "pass" : "fail",
        suggestion: altText ? null : "The featured image's alt text comes from the post title. Give the post a title so the image is described for accessibility and image search.",
        weight: 4,
      });
    }
  }

  // 14. Paragraph length
  {
    if (paragraphs.length === 0) {
      checks.push({ id: "para-length", label: "Paragraph length", status: "warning", suggestion: "Structure your content using <p> paragraphs for better readability.", weight: 5 });
    } else {
      const longParas = paragraphs.filter((p) => (p.textContent || "").trim().split(/\s+/).filter(Boolean).length > 120);
      let status: CheckStatus;
      let suggestion: string | null = null;
      if (longParas.length === 0) { status = "pass"; }
      else if (longParas.length <= 2) { status = "warning"; suggestion = `${longParas.length} paragraph(s) exceed 120 words. Break them up — readers scan rather than read, and shorter paragraphs improve comprehension and reduce bounce rate.`; }
      else { status = "fail"; suggestion = `${longParas.length} paragraphs are too long (120+ words each). Keep paragraphs to 3–4 sentences max for much better readability and engagement.`; }
      checks.push({ id: "para-length", label: "Paragraph length", status, suggestion, weight: 5 });
    }
  }

  // 15. H1 check — the post title is rendered as the page's only H1, so the
  //     body should not add another.
  {
    const count = doc.querySelectorAll("h1").length;
    let status: CheckStatus;
    let suggestion: string | null = null;
    if (count === 0) { status = "pass"; }
    else { status = "warning"; suggestion = `${count} H1 heading(s) found in the body. The post title is already the page's H1 — change these to H2 so the page keeps a single H1 and clear heading hierarchy.`; }
    checks.push({ id: "h1-check", label: count === 0 ? "Single H1 (post title)" : `Extra H1 headings in body (${count})`, status, suggestion, weight: 8 });
  }

  // 16. Keyword density
  {
    const text = getText(doc);
    if (!hasKw) {
      checks.push({ id: "kw-density", label: "Keyword density", status: "warning", suggestion: "Set a focus keyword to check keyword density.", weight: 10 });
    } else {
      const kwCount = countOccurrences(text, kw);
      const density = wordCount > 0 ? (kwCount / wordCount) * 100 : 0;
      const densityStr = density.toFixed(2);
      let status: CheckStatus;
      let suggestion: string | null = null;
      if (density >= 0.5 && density <= 2.5) {
        status = "pass";
      } else if (density > 2.5) {
        status = "fail";
        suggestion = `Keyword density is ${densityStr}% — over-optimised (limit: 2.5%). Reduce usage of "${focusKeyword}" to avoid a keyword stuffing penalty. Use synonyms instead.`;
      } else {
        status = density === 0 ? "fail" : "warning";
        suggestion = density === 0
          ? `"${focusKeyword}" does not appear in the content at all. Use it naturally throughout the body text.`
          : `Keyword density is ${densityStr}% — too low (target: 0.5%–2.5%). Try to include "${focusKeyword}" a few more times naturally in the body.`;
      }
      checks.push({ id: "kw-density", label: `Keyword density (${densityStr}%)`, status, suggestion, weight: 10 });
    }
  }

  // 17. Keyword in image alt text
  {
    const images = Array.from(doc.querySelectorAll("img"));
    if (!hasKw) {
      checks.push({ id: "kw-img-alt", label: "Keyword in image alt text", status: "warning", suggestion: "Set a focus keyword to check image alt text optimisation.", weight: 6 });
    } else if (images.length === 0) {
      checks.push({ id: "kw-img-alt", label: "Keyword in image alt text", status: "warning", suggestion: "No images found in the content. Add images with descriptive alt text containing your focus keyword.", weight: 6 });
    } else {
      const hasKwInAlt = images.some((img) => contains(img.getAttribute("alt") || "", kw));
      checks.push({
        id: "kw-img-alt",
        label: "Keyword in image alt text",
        status: hasKwInAlt ? "pass" : "warning",
        suggestion: hasKwInAlt ? null : `None of your ${images.length} image(s) have alt text containing "${focusKeyword}". Add the keyword to at least one image alt attribute to strengthen image SEO signals.`,
        weight: 6,
      });
    }
  }

  return { score: scoreChecks(checks), checks };
}

// ─── AIO Analysis ───────────────────────────────────────────────────────────

const QUESTION_WORDS = ["who", "what", "when", "where", "why", "how", "which", "is", "are", "can", "does", "do", "should", "will", "would"];

function analyzeAio(input: AnalysisInput, doc: Document): CategoryResult {
  const { focusKeyword } = input;
  const kw = focusKeyword.trim().toLowerCase();
  const text = getText(doc);
  const paragraphs = Array.from(doc.querySelectorAll("p"));
  const headings = Array.from(doc.querySelectorAll("h2, h3"));
  const lists = Array.from(doc.querySelectorAll("ul, ol"));
  const allWords = text.trim().split(/\s+/).filter(Boolean);
  const intro = allWords.slice(0, 200).join(" ").toLowerCase();

  const checks: WeightedCheck[] = [];

  // 1. Direct answer in introduction
  {
    const hasKeyword = kw ? intro.includes(kw) : intro.length > 50;
    const hasDefinition = /\b(is|are|means|refers to|defined as|can be described as)\b/.test(intro);
    let status: CheckStatus;
    let suggestion: string | null = null;
    if (hasKeyword && hasDefinition) {
      status = "pass";
    } else if (hasKeyword || hasDefinition) {
      status = "warning";
      suggestion = "Your introduction mentions the topic but doesn't give a clear direct answer. Open with a 2–3 sentence definition or answer. AI Overviews preferentially extract this as the featured response.";
    } else {
      status = "fail";
      suggestion = `Your intro doesn't provide a direct answer to the topic. AI engines scan the first 200 words for a concise answer to extract. Try opening with: "${focusKeyword || "Your topic"} is..." or "In this guide you'll learn exactly how to..."`;
    }
    checks.push({ id: "direct-answer", label: "Direct answer in introduction", status, suggestion, weight: 20 });
  }

  // 2. Question-based headings
  {
    const questionHeadings = headings.filter((h) => {
      const t = (h.textContent || "").trim().toLowerCase();
      return QUESTION_WORDS.some((w) => t.startsWith(w + " ") || t.startsWith(w + "?"));
    });
    const count = questionHeadings.length;
    let status: CheckStatus;
    let suggestion: string | null = null;
    if (count >= 2) { status = "pass"; }
    else if (count === 1) { status = "warning"; suggestion = "You have 1 question-based heading. Add at least one more (starting with What, How, Why, etc.) — these are the primary triggers for AI Overview inclusion."; }
    else { status = "fail"; suggestion = `Rephrase at least 2 subheadings as questions (e.g. "What is ${focusKeyword || "X"}?", "How does it work?", "Why does it matter?"). Question headings dramatically increase your chances of appearing in Google's AI Overviews.`; }
    checks.push({ id: "question-headings", label: `Question-based headings (${count})`, status, suggestion, weight: 20 });
  }

  // 3. Lists
  {
    const count = lists.length;
    let status: CheckStatus;
    let suggestion: string | null = null;
    if (count >= 2) { status = "pass"; }
    else if (count === 1) { status = "warning"; suggestion = "Add more bullet or numbered lists. Lists are extracted verbatim into AI Overviews more than any other format."; }
    else { status = "fail"; suggestion = "No lists found. Add at least 2 bullet or numbered lists. Lists are the single most commonly extracted format for AI Overviews and featured snippets."; }
    checks.push({ id: "lists", label: `Lists and bullet points (${count})`, status, suggestion, weight: 15 });
  }

  // 4. Short paragraphs
  {
    if (paragraphs.length === 0) {
      checks.push({ id: "short-paras", label: "Short focused paragraphs", status: "warning", suggestion: "Use short paragraphs (2–3 sentences) so AI engines can extract clean, self-contained answers.", weight: 15 });
    } else {
      const avgSentences = paragraphs.map((p) =>
        (p.textContent || "").split(/[.!?]+/).filter((s) => s.trim().length > 10).length
      ).reduce((a, b) => a + b, 0) / paragraphs.length;
      let status: CheckStatus;
      let suggestion: string | null = null;
      if (avgSentences <= 3) { status = "pass"; }
      else if (avgSentences <= 5) { status = "warning"; suggestion = `Average ${avgSentences.toFixed(1)} sentences per paragraph. Aim for 2–3. Shorter paragraphs are easier for AI to extract as self-contained answers.`; }
      else { status = "fail"; suggestion = `Paragraphs average ${avgSentences.toFixed(1)} sentences — too dense. Break them into 2–3 sentence chunks. AI systems struggle to extract clean answers from long, dense paragraphs.`; }
      checks.push({ id: "short-paras", label: "Short focused paragraphs", status, suggestion, weight: 15 });
    }
  }

  // 5. Definition sentences
  {
    const patterns = [/ is a /, / is an /, / are a /, / means /, / refers to /, / is defined as /, / is the /];
    const count = patterns.filter((p) => p.test(text.toLowerCase())).length;
    let status: CheckStatus;
    let suggestion: string | null = null;
    if (count >= 2) { status = "pass"; }
    else if (count === 1) { status = "warning"; suggestion = `Add more definition-style sentences ("X is a...", "X refers to..."). These are prime candidates for AI-generated answers to "What is X?" queries.`; }
    else { status = "fail"; suggestion = `No definition sentences found. Include clear statements like "${focusKeyword || "Your topic"} is a..." — AI Overviews frequently use these to answer definitional queries directly from your page.`; }
    checks.push({ id: "definitions", label: "Definition sentences", status, suggestion, weight: 10 });
  }

  // 6. FAQ section
  {
    const faqHeading = headings.find((h) => /faq|frequently asked|common questions/i.test(h.textContent || ""));
    checks.push({
      id: "faq",
      label: "FAQ section",
      status: faqHeading ? "pass" : "fail",
      suggestion: faqHeading ? null : `Add a FAQ section with 3–5 question-and-answer pairs at the end of your post. FAQ content is one of the most reliable triggers for Google's "People Also Ask" and AI Overview features.`,
      weight: 20,
    });
  }

  return { score: scoreChecks(checks), checks };
}

// ─── GEO Analysis ───────────────────────────────────────────────────────────

function analyzeGeo(input: AnalysisInput, doc: Document, wordCount: number): CategoryResult {
  const { title, slug, metaTitle, metaDescription, canonicalUrl, schemaType, tags, focusKeyword } = input;
  const kw = focusKeyword.trim().toLowerCase();
  const hasKw = kw.length > 0;
  const text = getText(doc);
  const headings = Array.from(doc.querySelectorAll("h2, h3"));
  const blockquotes = Array.from(doc.querySelectorAll("blockquote"));

  const checks: WeightedCheck[] = [];

  // 1. Schema type — fixed per site, so only presence is checked.
  {
    checks.push({
      id: "schema",
      label: `Schema type (${schemaType || "none"})`,
      status: schemaType ? "pass" : "fail",
      suggestion: schemaType ? null : "Set a schema type. Structured data is essential for AI engines to understand and correctly categorise your content.",
      weight: 10,
    });
  }

  // 2. Content depth for GEO
  {
    let status: CheckStatus;
    let suggestion: string | null = null;
    if (wordCount >= 2000) { status = "pass"; }
    else if (wordCount >= 1500) { status = "warning"; suggestion = `At ${wordCount} words, your content is decent but AI engines strongly favour comprehensive content (2,000+ words). Add more depth, context, step-by-step breakdowns, or case studies.`; }
    else { status = "fail"; suggestion = `At ${wordCount} words, your content lacks the depth AI engines look for. Aim for 2,000+ words with comprehensive, authoritative coverage. Thin content rarely gets cited by AI systems.`; }
    checks.push({ id: "geo-depth", label: `Content depth (${wordCount} words)`, status, suggestion, weight: 15 });
  }

  // 3. Statistics and numbers
  {
    const matches = text.match(/\b\d+(\.\d+)?(%|x|\+)?\b/g) || [];
    const significant = matches.filter((n) => parseFloat(n) > 9 || n.includes("%"));
    const count = significant.length;
    let status: CheckStatus;
    let suggestion: string | null = null;
    if (count >= 5) { status = "pass"; }
    else if (count >= 2) { status = "warning"; suggestion = `Only ${count} statistics or data points found. Add more specific numbers, percentages, year references, and research-backed statistics. Factual, data-rich content gets cited by AI engines far more often.`; }
    else { status = "fail"; suggestion = "No meaningful statistics found. Add specific data points, percentages, and research-backed figures. AI engines like Perplexity, ChatGPT, and Google AI cite sources with concrete, verifiable facts."; }
    checks.push({ id: "statistics", label: `Statistics & data points (${count})`, status, suggestion, weight: 15 });
  }

  // 4. Topic consistency
  {
    if (!hasKw) {
      checks.push({ id: "topic-consistency", label: "Topic consistency", status: "warning", suggestion: "Set a focus keyword to check how consistently your topic appears across all content fields.", weight: 20 });
    } else {
      const signals = [
        { name: "title", hit: contains(title, kw) },
        { name: "meta fields", hit: contains(metaTitle + " " + metaDescription, kw) },
        { name: "URL slug", hit: contains(slug, kw.replace(/\s+/g, "-")) },
        { name: "headings", hit: headings.some((h) => contains(h.textContent || "", kw)) },
        { name: "body content", hit: contains(text, kw) },
      ];
      const hits = signals.filter((s) => s.hit).length;
      const missing = signals.filter((s) => !s.hit).map((s) => s.name);
      let status: CheckStatus;
      let suggestion: string | null = null;
      if (hits >= 4) { status = "pass"; }
      else if (hits >= 2) { status = "warning"; suggestion = `"${focusKeyword}" is missing from: ${missing.join(", ")}. Topic consistency across all content signals tells AI engines this page is authoritative on this subject.`; }
      else { status = "fail"; suggestion = `"${focusKeyword}" barely appears in your content structure (only in ${5 - missing.length}/5 areas). Use it consistently in your title, meta description, slug, headings, and body. Topical consistency is the foundation of GEO.`; }
      checks.push({ id: "topic-consistency", label: `Topic consistency (${hits}/5 signals)`, status, suggestion, weight: 20 });
    }
  }

  // 5. Canonical URL
  {
    checks.push({
      id: "canonical",
      label: "Canonical URL",
      status: canonicalUrl ? "pass" : "warning",
      suggestion: canonicalUrl ? null : "Set a canonical URL. This tells AI engines and search engines which URL is the definitive version — important if your content is syndicated or shared across platforms.",
      weight: 10,
    });
  }

  // 6. Citable content
  {
    const factualPatterns = [/according to/i, /research shows/i, /studies show/i, /data (shows|reveals)/i, /report(s|ed|ing)?/i, /survey(s|ed)?/i, /found that/i, /experts (say|recommend|suggest)/i, /published in/i, /source:/i];
    const citationCount = factualPatterns.filter((p) => p.test(text)).length + blockquotes.length;
    let status: CheckStatus;
    let suggestion: string | null = null;
    if (citationCount >= 3) { status = "pass"; }
    else if (citationCount >= 1) { status = "warning"; suggestion = "Add more citable content — expert quotes, research citations, or phrases like 'According to [source]...'. AI engines strongly prioritise and cite content that references authoritative sources."; }
    else { status = "fail"; suggestion = "No citable content found. Add expert quotes, research findings, or authoritative references using phrases like 'According to...', 'Research by X shows...', 'A 2024 study found...'. This is a key signal that AI engines use to select citation sources."; }
    checks.push({ id: "citable", label: `Citable content (${citationCount} signals)`, status, suggestion, weight: 15 });
  }

  // 7. Tags
  {
    const count = tags.length;
    let status: CheckStatus;
    let suggestion: string | null = null;
    if (count >= 3) { status = "pass"; }
    else if (count >= 1) { status = "warning"; suggestion = `Only ${count} tag(s). Add 3–6 relevant tags to strengthen topical signals and improve discoverability by AI categorisation systems.`; }
    else { status = "fail"; suggestion = "No tags added. Tags signal topical relevance and help AI engines categorise your content correctly. Add 3–6 descriptive tags related to your topic."; }
    checks.push({ id: "tags", label: `Topical tags (${count})`, status, suggestion, weight: 15 });
  }

  return { score: scoreChecks(checks), checks };
}

// ─── Readability Analysis ────────────────────────────────────────────────────

function analyzeReadability(doc: Document, text: string, wordCount: number): CategoryResult {
  const checks: WeightedCheck[] = [];
  const sentences = getSentences(text);

  // 1. Flesch Reading Ease
  {
    const flesch = calcFleschScore(text);
    let status: CheckStatus;
    let label: string;
    let suggestion: string | null = null;
    if (flesch >= 60) {
      status = "pass";
      label = flesch >= 80 ? "Very easy" : flesch >= 70 ? "Fairly easy" : "Standard";
    } else if (flesch >= 50) {
      status = "warning";
      label = "Fairly difficult";
      suggestion = `Flesch score is ${flesch}/100. Your content is a bit hard to read. Aim for 60+ by using shorter sentences and simpler words.`;
    } else {
      status = "fail";
      label = "Difficult";
      suggestion = `Flesch score is ${flesch}/100 — academic-level difficulty. Most web readers need 60+. Shorten sentences, break up dense paragraphs, and replace complex words with simpler alternatives.`;
    }
    checks.push({ id: "flesch", label: `Readability: ${label} (${flesch}/100)`, status, suggestion, weight: 30 });
  }

  // 2. Long sentence percentage
  {
    if (sentences.length === 0) {
      checks.push({ id: "sentence-length", label: "Sentence length", status: "warning", suggestion: "Could not detect sentences. Make sure content uses proper punctuation.", weight: 20 });
    } else {
      const longSentences = sentences.filter((s) => s.split(/\s+/).filter(Boolean).length > 20);
      const pct = Math.round((longSentences.length / sentences.length) * 100);
      let status: CheckStatus;
      let suggestion: string | null = null;
      if (pct <= 15) { status = "pass"; }
      else if (pct <= 25) { status = "warning"; suggestion = `${pct}% of sentences exceed 20 words. Aim to keep this under 15%. Long sentences are harder to scan and reduce reading comprehension.`; }
      else { status = "fail"; suggestion = `${pct}% of sentences are too long (20+ words). Readers lose track mid-sentence. Break long sentences into two shorter ones — it dramatically improves clarity.`; }
      checks.push({ id: "sentence-length", label: `Long sentences (${pct}% over 20 words)`, status, suggestion, weight: 20 });
    }
  }

  // 3. Subheading distribution (no block of text > 300 words without a heading)
  {
    const allNodes = Array.from(doc.body?.childNodes || []);
    let currentBlock = 0;
    let maxBlock = 0;
    for (const node of allNodes) {
      const el = node as Element;
      if (el.tagName && /^H[1-6]$/.test(el.tagName)) {
        maxBlock = Math.max(maxBlock, currentBlock);
        currentBlock = 0;
      } else {
        const wc = (el.textContent || "").trim().split(/\s+/).filter(Boolean).length;
        currentBlock += wc;
      }
    }
    maxBlock = Math.max(maxBlock, currentBlock);
    let status: CheckStatus;
    let suggestion: string | null = null;
    if (maxBlock <= 300) { status = "pass"; }
    else if (maxBlock <= 500) { status = "warning"; suggestion = `One section has ~${maxBlock} words without a subheading. Add an H2 or H3 every 300 words to break up long stretches of text and improve scannability.`; }
    else { status = "fail"; suggestion = `A section has ~${maxBlock} words with no subheading — far too dense. Readers won't scroll through a wall of text. Add subheadings every 300 words maximum.`; }
    checks.push({ id: "subheading-distribution", label: `Subheading distribution (max ${maxBlock}w gap)`, status, suggestion, weight: 20 });
  }

  // 4. Content freshness (mentions a recent year)
  {
    const currentYear = new Date().getFullYear();
    const recentYears = [currentYear, currentYear - 1, currentYear - 2];
    const mentionsYear = recentYears.some((y) => text.includes(String(y)));
    checks.push({
      id: "freshness",
      label: mentionsYear ? "Content references a recent year" : "No recent year reference",
      status: mentionsYear ? "pass" : "warning",
      suggestion: mentionsYear ? null : `Add a reference to ${currentYear} or ${currentYear - 1} (e.g. "As of ${currentYear}…" or a current statistic). Fresh date signals tell readers and search engines the content is up to date.`,
      weight: 15,
    });
  }

  // 5. Image-to-content ratio
  {
    const imageCount = doc.querySelectorAll("img").length;
    const expectedImages = Math.max(1, Math.floor(wordCount / 400));
    let status: CheckStatus;
    let suggestion: string | null = null;
    if (imageCount >= expectedImages) { status = "pass"; }
    else if (imageCount >= 1) { status = "warning"; suggestion = `${imageCount} image(s) for ${wordCount} words. Aim for roughly 1 image per 400 words to break up text and keep readers engaged.`; }
    else { status = "fail"; suggestion = "No images found in the content. Add at least one image per 400 words. Visual content significantly reduces bounce rate and increases time on page."; }
    checks.push({ id: "image-ratio", label: `Images in content (${imageCount})`, status, suggestion, weight: 15 });
  }

  return { score: scoreChecks(checks), checks };
}

// ─── Main Export ────────────────────────────────────────────────────────────

export function analyzeContent(input: AnalysisInput): AnalysisResult {
  const doc = parseHtml(input.content || "");
  const text = getText(doc);
  const wordCount = countWords(text);
  const readingTime = Math.max(1, Math.round(wordCount / 200));
  const flesch = calcFleschScore(text);

  const seo = analyzeSeo(input, doc, wordCount);
  const aio = analyzeAio(input, doc);
  const geo = analyzeGeo(input, doc, wordCount);
  const readability = analyzeReadability(doc, text, wordCount);

  // Weighted overall: SEO 35%, AIO 30%, GEO 20%, Readability 15%
  const overall = Math.round(
    seo.score * 0.35 + aio.score * 0.30 + geo.score * 0.20 + readability.score * 0.15
  );

  return { overall, seo, aio, geo, readability, wordCount, readingTime, fleschScore: flesch };
}
