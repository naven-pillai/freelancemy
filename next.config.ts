import type { NextConfig } from "next";
import createMDX from "@next/mdx";

// ✅ Enable MDX with `.mdx` + `.md`
const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

const nextConfig: NextConfig = {
  images: {
    // ✅ Modern formats (AVIF + WebP)
    formats: ["image/avif", "image/webp"],

    // ✅ Allow remote images (Supabase + your domain)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "freelancemalaysia.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "loigoouddqshbpygboos.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },

  // ✅ Add `.mdx` to pageExtensions
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],

  // ✅ Optional: improve cache headers for images served by Next
  experimental: {
    optimizeCss: true,
  },
};

export default withMDX(nextConfig);
