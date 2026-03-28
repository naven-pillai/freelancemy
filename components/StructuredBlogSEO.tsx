type StructuredBlogSEOProps = {
  title: string;
  description: string;
  url: string;
  canonicalUrl?: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  author?: string;
  categories?: string[];
  tags?: string[];
  wordCount?: number;
  entities?: string[];
};

// ✅ Broader JSON-LD type to allow string[], number[], objects, etc.
type JsonLd =
  | string
  | number
  | boolean
  | undefined
  | { [key: string]: JsonLd }
  | JsonLd[];

export default function StructuredBlogSEO({
  title,
  description,
  url,
  canonicalUrl,
  datePublished,
  dateModified,
  image,
  author,
  categories = [],
  tags = [],
  wordCount,
  entities = [],
}: StructuredBlogSEOProps) {
  // ✅ Publisher / Org info
  const org: JsonLd = {
    "@type": "Organization",
    name: "FreelanceMY",
    url: "https://freelancemy.com",
    logo: {
      "@type": "ImageObject",
      url: "https://freelancemy.com/logo.png",
    },
  };

  // ✅ BlogPosting schema
  const jsonLd: JsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    url,
    author: {
      "@type": "Person",
      name: author,
      url: "https://www.linkedin.com/in/navenpillai",
    },
    publisher: org,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl || url,
    },
    datePublished,
    dateModified: dateModified ?? datePublished,
    image: image ? [image] : undefined,
    articleSection: categories.length ? categories : undefined,
    keywords: tags.length ? tags.join(", ") : undefined,
    inLanguage: "en-MY",
    isAccessibleForFree: true,
    wordCount: wordCount || undefined,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "article p:first-of-type"], // now valid
    },
    about: entities.slice(0, 6).map((e) => ({ "@type": "Thing", name: e })),
    mentions: entities.slice(6).map((e) => ({ "@type": "Thing", name: e })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        // Escape </script> sequences so the JSON-LD block cannot be broken
        // out of by user-controlled content in frontmatter fields.
        __html: JSON.stringify(jsonLd)
          .replace(/</g, "\\u003c")
          .replace(/>/g, "\\u003e")
          .replace(/&/g, "\\u0026"),
      }}
    />
  );
}
