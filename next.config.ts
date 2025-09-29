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
};

export default withMDX(nextConfig);

