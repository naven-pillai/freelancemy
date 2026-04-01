/**
 * Cloudinary image loader for Next.js <Image />.
 *
 * Uses Cloudinary's "fetch" delivery type so no migration is needed —
 * your existing Supabase image URLs are proxied and optimised automatically.
 *
 * Activate by setting NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME in .env.local
 * and setting `loader: "custom"` + `loaderFile` in next.config.ts.
 *
 * Cloudinary free tier: 25 GB storage / 25 GB bandwidth / month.
 * Sign up at: https://cloudinary.com/users/register_free
 */

type ImageLoaderProps = {
  src: string;
  width: number;
  quality?: number;
};

export default function cloudinaryLoader({ src, width, quality }: ImageLoaderProps): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  // Fallback: return src as-is if cloud name is missing (should not happen
  // at runtime since next.config.ts only activates this loader when the var is set)
  if (!cloudName) return src;

  const q = quality ?? 75;
  const transformations = `f_auto,q_${q},w_${width}`;

  // Local/relative paths need an absolute URL for Cloudinary fetch
  const absoluteSrc = src.startsWith("/")
    ? `https://freelancemy.com${src}`
    : src;

  // Cloudinary fetch: proxies any public URL and applies transformations
  return `https://res.cloudinary.com/${cloudName}/image/fetch/${transformations}/${absoluteSrc}`;
}
