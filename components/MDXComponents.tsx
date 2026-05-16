import Image from "next/image";
import type { MDXComponents } from "mdx/types";

export const mdxComponents: MDXComponents = {
  img: ({ src, alt, title }) => {
    if (!src) return null;

    // Parse title for caption: "Caption text|https://source-url"
    let captionText: string | undefined;
    let captionUrl: string | undefined;
    if (title) {
      const parts = title.split("|");
      captionText = parts[0]?.trim();
      captionUrl = parts[1]?.trim();
    }

    return (
      <figure className="my-6">
        <Image
          src={src}
          alt={alt || "Blog post image"}
          width={800}
          height={450}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
          className="w-full h-auto rounded-lg shadow-md mx-auto"
        />
        {captionText && (
          <figcaption className="mt-2 text-center text-xs text-gray-500">
            {captionUrl ? (
              <a
                href={captionUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="hover:text-gray-700 underline"
              >
                {captionText}
              </a>
            ) : (
              captionText
            )}
          </figcaption>
        )}
      </figure>
    );
  },

  h2: ({ children }) => (
    <h2 className="text-2xl sm:text-3xl font-bold mt-10 sm:mt-14 mb-4 sm:mb-5 leading-tight tracking-tight text-gray-900 scroll-mt-24">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl sm:text-2xl font-semibold mt-8 sm:mt-10 mb-3 sm:mb-4 leading-snug tracking-tight text-gray-900 scroll-mt-24">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-base sm:text-lg md:text-xl font-semibold mt-6 sm:mt-8 mb-2 sm:mb-3 leading-snug text-gray-900 scroll-mt-24">
      {children}
    </h4>
  ),

  ul: ({ children }) => (
    <ul className="list-disc pl-5 sm:pl-6 my-4 sm:my-5 marker:text-orange-500">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal pl-5 sm:pl-6 my-4 sm:my-5 marker:text-orange-500 marker:font-semibold">
      {children}
    </ol>
  ),

  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-orange-500 pl-4 sm:pl-6 py-1 my-6 sm:my-8 italic text-gray-700 text-base sm:text-lg leading-relaxed">
      {children}
    </blockquote>
  ),

  code: ({ children }) => (
    <code className="bg-gray-100 text-pink-700 px-1.5 py-0.5 rounded text-[0.9em] font-mono font-medium">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-x-auto text-sm font-mono my-6 leading-relaxed">
      {children}
    </pre>
  ),

  table: ({ children }) => (
    <div className="overflow-x-auto my-8 rounded-lg border border-gray-200">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border-b border-gray-200 bg-gray-50 px-4 py-3 text-left font-semibold text-gray-900">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-b border-gray-100 px-4 py-3 text-gray-700">{children}</td>
  ),

  hr: () => <hr className="my-10 border-t border-gray-200" />,
};
