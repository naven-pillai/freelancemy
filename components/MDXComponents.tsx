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
    <h2 className="text-2xl font-bold mt-10 mb-4">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl font-semibold mt-8 mb-3">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-lg font-semibold mt-6 mb-2">{children}</h4>
  ),

  ul: ({ children }) => (
    <ul className="list-disc pl-6 my-4 space-y-1 font-medium">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal pl-6 my-4 space-y-1 font-medium">{children}</ol>
  ),

  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-orange-500 pl-4 italic text-gray-600 my-6">
      {children}
    </blockquote>
  ),

  code: ({ children }) => (
    <code className="bg-gray-100 text-pink-600 px-1.5 py-0.5 rounded text-sm font-mono">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-x-auto text-sm font-mono">
      {children}
    </pre>
  ),

  table: ({ children }) => (
    <div className="overflow-x-auto my-6">
      <table className="w-full border-collapse border border-gray-300 text-sm">
        {children}
      </table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-gray-300 bg-gray-100 px-3 py-2 text-left font-semibold">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-gray-300 px-3 py-2">{children}</td>
  ),

  hr: () => <hr className="my-8 border-t border-gray-300" />,
};
