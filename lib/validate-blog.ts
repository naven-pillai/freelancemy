const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_TITLE = 200;
const MAX_DESCRIPTION = 500;
const MAX_CONTENT = 200000;
const MAX_URL = 2000;
const MAX_TAG = 50;
const MAX_TAGS = 20;
const VALID_STATUSES = ["draft", "published"];

type ValidationResult =
  | { valid: true; data: Record<string, unknown> }
  | { valid: false; error: string };

const ALLOWED_FIELDS = [
  "title",
  "slug",
  "description",
  "content",
  "featured_image",
  "author",
  "categories",
  "tags",
  "status",
  "date",
  "last_updated",
  "canonical_url",
] as const;

function pick(body: Record<string, unknown>) {
  const result: Record<string, unknown> = {};
  for (const key of ALLOWED_FIELDS) {
    if (key in body) result[key] = body[key];
  }
  return result;
}

function isValidUrl(url: string) {
  try {
    new URL(url);
    return url.length <= MAX_URL;
  } catch {
    return false;
  }
}

export function validateBlogCreate(
  body: Record<string, unknown>
): ValidationResult {
  const data = pick(body);

  if (!data.title || typeof data.title !== "string")
    return { valid: false, error: "Title is required" };
  if ((data.title as string).length > MAX_TITLE)
    return { valid: false, error: `Title must be under ${MAX_TITLE} characters` };

  if (!data.slug || typeof data.slug !== "string")
    return { valid: false, error: "Slug is required" };
  if (!SLUG_REGEX.test(data.slug as string))
    return { valid: false, error: "Slug must be lowercase alphanumeric with hyphens" };

  if (data.description && typeof data.description === "string" && (data.description as string).length > MAX_DESCRIPTION)
    return { valid: false, error: `Description must be under ${MAX_DESCRIPTION} characters` };

  if (data.content && typeof data.content === "string" && (data.content as string).length > MAX_CONTENT)
    return { valid: false, error: "Content is too long" };

  if (data.featured_image && typeof data.featured_image === "string" && !isValidUrl(data.featured_image as string))
    return { valid: false, error: "Featured image must be a valid URL" };

  if (data.canonical_url && typeof data.canonical_url === "string" && (data.canonical_url as string).length > 0 && !isValidUrl(data.canonical_url as string))
    return { valid: false, error: "Canonical URL must be a valid URL" };

  if (data.status && !VALID_STATUSES.includes(data.status as string))
    return { valid: false, error: "Status must be draft or published" };

  if (data.categories && !Array.isArray(data.categories))
    return { valid: false, error: "Categories must be an array" };
  if (Array.isArray(data.categories) && (data.categories as string[]).length > MAX_TAGS)
    return { valid: false, error: `Max ${MAX_TAGS} categories` };

  if (data.tags && !Array.isArray(data.tags))
    return { valid: false, error: "Tags must be an array" };
  if (Array.isArray(data.tags)) {
    if ((data.tags as string[]).length > MAX_TAGS)
      return { valid: false, error: `Max ${MAX_TAGS} tags` };
    if ((data.tags as string[]).some((t) => typeof t !== "string" || t.length > MAX_TAG))
      return { valid: false, error: `Each tag must be under ${MAX_TAG} characters` };
  }

  return { valid: true, data };
}

export function validateBlogUpdate(
  body: Record<string, unknown>
): ValidationResult {
  const data = pick(body);

  if (data.title !== undefined) {
    if (typeof data.title !== "string" || (data.title as string).length === 0)
      return { valid: false, error: "Title cannot be empty" };
    if ((data.title as string).length > MAX_TITLE)
      return { valid: false, error: `Title must be under ${MAX_TITLE} characters` };
  }

  if (data.slug !== undefined) {
    if (typeof data.slug !== "string" || !SLUG_REGEX.test(data.slug as string))
      return { valid: false, error: "Slug must be lowercase alphanumeric with hyphens" };
  }

  // Reuse the same field-level checks
  if (data.description && typeof data.description === "string" && (data.description as string).length > MAX_DESCRIPTION)
    return { valid: false, error: `Description must be under ${MAX_DESCRIPTION} characters` };

  if (data.content && typeof data.content === "string" && (data.content as string).length > MAX_CONTENT)
    return { valid: false, error: "Content is too long" };

  if (data.featured_image && typeof data.featured_image === "string" && !isValidUrl(data.featured_image as string))
    return { valid: false, error: "Featured image must be a valid URL" };

  if (data.canonical_url && typeof data.canonical_url === "string" && (data.canonical_url as string).length > 0 && !isValidUrl(data.canonical_url as string))
    return { valid: false, error: "Canonical URL must be a valid URL" };

  if (data.status && !VALID_STATUSES.includes(data.status as string))
    return { valid: false, error: "Status must be draft or published" };

  if (data.categories && !Array.isArray(data.categories))
    return { valid: false, error: "Categories must be an array" };

  if (data.tags && !Array.isArray(data.tags))
    return { valid: false, error: "Tags must be an array" };

  return { valid: true, data };
}
