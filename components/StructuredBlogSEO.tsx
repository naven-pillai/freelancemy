"use client";

import Script from "next/script";

type StructuredBlogSEOProps = {
  title: string;
  description: string;
  url: string;
  canonicalUrl?: string; // ✅ Add this
  datePublished: string;
  dateModified?: string;
  image?: string;
  author?: string;
  categories?: string[];
  tags?: string[];
  wordCount?: number;
};  

export default function StructuredBlogSEO({
  title,
  description,
  url,
  canonicalUrl, // ✅ pick it up
  datePublished,
  dateModified,
  image,
  author = "Naven Pillai",
  categories = [],
  tags = [],
  wordCount,
}: StructuredBlogSEOProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    author: {
      "@type": "Person",
      name: author,
      url: "https://www.linkedin.com/in/navenpillai",
    },
    publisher: {
      "@type": "Organization",
      name: "FreelanceMY",
      logo: {
        "@type": "ImageObject",
        url: "https://freelancemy.com/logo.png",
      },
    },
    url,
    datePublished,
    dateModified: dateModified ?? datePublished,
    image: image ? [image] : undefined,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl || url, // ✅ canonical used here
    },
    articleSection: categories.length > 0 ? categories : undefined,
    keywords: tags.length > 0 ? tags.join(", ") : undefined,
    inLanguage: "en-MY",
    isAccessibleForFree: true,
    wordCount: wordCount || undefined,
  };

  return (
    <>
      <link rel="canonical" href={canonicalUrl || url} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}