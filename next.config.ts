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

  // ✅ Permanent redirects
  async redirects() {
    return [
      {
        source: "/become-a-freelance-digital-marketer",
        destination: "https://freelancemy.com/freelance-digital-marketing-malaysia",
        permanent: true,
      },
      {
        source: "/become-a-freelance-writer-in-malaysia",
        destination: "https://freelancemy.com/become-a-freelance-writer-in-malaysia",
        permanent: true,
      },
    ];
  },
};

export default withMDX(nextConfig);