import Image from "next/image";
import Link from "next/link";
import { getAllPostsMeta } from "@/lib/posts";
import SearchSuggestions from "@/components/SearchSuggestions";

export default async function NotFound() {
  const posts = await getAllPostsMeta(); // fetch blog meta

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 bg-gradient-to-b from-gray-50 to-white">
      {/* Logo / Illustration */}
      <Link href="/" className="mb-2">
        <Image
          src="/page-not-found.svg"
          alt="page-not-found"
          width={240}
          height={150}
          priority
        />
      </Link>
      {/* Heading */}
      <h1 className="text-6xl font-extrabold text-gray-900 mb-2 tracking-tight">
        404
      </h1>
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-6">
        Oops! Page not found
      </h2>

      {/* Description */}
      <p className="text-gray-600 max-w-xl mb-8 text-center leading-relaxed">
        The page you’re looking for doesn’t exist or has been moved.  
        Don’t worry — try searching our latest guides and articles below,  
        or head back to explore our blog.
      </p>

      {/* ✅ Search suggestions */}
      <div className="w-full max-w-lg mb-8">
        <SearchSuggestions posts={posts} />
      </div>

{/* CTA Buttons */}
<div className="flex flex-col sm:flex-row gap-4">
  {/* Secondary - White button with black hover */}
  <Link
    href="/"
    className="px-6 py-3 rounded-lg bg-white text-black font-medium shadow-md border border-gray-300 hover:bg-black hover:!text-white transition-all"
  >
    Back to Home
  </Link>

  {/* Primary - Blue button with inverted hover */}
  <Link
    href="/"
    className="px-6 py-3 rounded-lg bg-indigo-600 !text-white font-medium shadow-md hover:bg-white hover:!text-blue-600 hover:border hover:border-blue-600 transition-all"
  >
    Explore Blog
  </Link>
</div>
    
    </div>
  );
}
