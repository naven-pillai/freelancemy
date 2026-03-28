import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

const supabaseHostname = new URL(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"
).hostname;

// When Cloudinary is configured, images are served via res.cloudinary.com
const cloudinaryHostname = "res.cloudinary.com";
const useCloudinary = !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' static.getclicky.com",
      "style-src 'self' 'unsafe-inline'",
      `img-src 'self' data: https://${supabaseHostname} https://freelancemy.com https://${cloudinaryHostname}`,
      "font-src 'self'",
      `connect-src 'self' https://${supabaseHostname} wss://${supabaseHostname} https://in.getclicky.com http://in.getclicky.com`,
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days

    // When Cloudinary is active the custom loader handles all images.
    // remotePatterns is only needed for the default Next.js loader.
    ...(!useCloudinary && {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "freelancemy.com",
          pathname: "/**",
        },
        {
          protocol: "https",
          hostname: supabaseHostname,
          pathname: "/storage/v1/object/public/**",
        },
      ],
    }),

    ...(useCloudinary && {
      loader: "custom",
      loaderFile: "./lib/cloudinaryLoader.ts",
    }),
  },

  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],

  experimental: {
    optimizeCss: true,
  },

  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },

  async redirects() {
    return [
      {
        source: "/become-a-freelance-digital-marketer",
        destination: "https://freelancemy.com/freelance-digital-marketing-malaysia",
        permanent: true,
      },
      {
        source: "/become-a-freelance-writer-in-malaysia",
        destination: "https://freelancemy.com/freelance-writer-malaysia",
        permanent: true,
      },
    ];
  },
};

const config = withBundleAnalyzer(withMDX(nextConfig));

// Workaround: @next/mdx injects a 'conditions' key into turbopack that Next.js no longer recognises
if (config.turbopack && "conditions" in config.turbopack) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (config.turbopack as any).conditions;
}

export default config;
