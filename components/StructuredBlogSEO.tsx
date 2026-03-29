import { SITE_URL, SITE_NAME } from "@/lib/constants";

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
  articleBody?: string;
};

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
  articleBody,
}: StructuredBlogSEOProps) {
  const org: JsonLd = {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logo.png`,
    },
  };

  const jsonLd: JsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    url,
    ...(author && {
      author: {
        "@type": "Person",
        name: author,
        url: "https://navenpillai.com",
      },
    }),
    publisher: org,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl || url,
    },
    datePublished,
    dateModified: dateModified ?? datePublished,
    ...(image && { image: [image] }),
    ...(categories.length > 0 && { articleSection: categories }),
    ...(tags.length > 0 && { keywords: tags.join(", ") }),
    inLanguage: "en-MY",
    isAccessibleForFree: true,
    ...(wordCount && { wordCount }),
    ...(articleBody && { articleBody: articleBody.slice(0, 5000) }),
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "article p:first-of-type"],
    },
    ...(entities.length > 0 && {
      about: entities.slice(0, 6).map((e) => ({ "@type": "Thing", name: e })),
      mentions: entities.slice(6).map((e) => ({ "@type": "Thing", name: e })),
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd)
          .replace(/</g, "\\u003c")
          .replace(/>/g, "\\u003e")
          .replace(/&/g, "\\u0026"),
      }}
    />
  );
}
