"use client";

import { useCallback } from "react";
import { LinkIcon, Facebook, Linkedin, X } from "lucide-react";

type ShareBarProps = {
  title: string;
  url: string;
  className?: string;
};

export default function ShareBar({ title, url, className }: ShareBarProps) {
  const enc = (s: string) => encodeURIComponent(s);

  const links = {
    x: `https://x.com/intent/tweet?text=${enc(title)}&url=${enc(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`,
  };

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert("Link copied!");
    } catch {
      window.prompt("Copy this link:", url);
    }
  }, [url]);

  // base pill styling
  const pill =
    "flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors";

  return (
    <div
      className={`flex items-center flex-wrap gap-2 border-t border-b border-gray-200 py-3 ${className ?? ""}`}
    >
      <span className="text-xs font-semibold text-gray-500">Share this blog post:</span>

      {/* X */}
      <a
        href={links.x}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X"
        className={`${pill} bg-gray-100 text-gray-700 hover:bg-gray-200`}
      >
        <X className="h-4 w-4" />
      </a>

      {/* LinkedIn */}
      <a
        href={links.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        className={`${pill} bg-blue-50 text-[#0A66C2] hover:bg-blue-100`}
      >
        <Linkedin className="h-4 w-4" />
        LinkedIn
      </a>

      {/* Facebook */}
      <a
        href={links.facebook}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Facebook"
        className={`${pill} bg-blue-50 text-[#1877F2] hover:bg-blue-100`}
      >
        <Facebook className="h-4 w-4" />
        Facebook
      </a>

      {/* Copy */}
      <button
        onClick={handleCopy}
        aria-label="Copy link"
        className={`${pill} bg-gray-100 text-gray-700 hover:bg-gray-200`}
      >
        <LinkIcon className="h-4 w-4" />
        Copy
      </button>
    </div>
  );
}
