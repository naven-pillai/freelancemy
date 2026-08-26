"use client";

import { useCallback } from "react";
import { LinkIcon, X } from "lucide-react";
import { FaFacebook, FaLinkedin } from "react-icons/fa6";
import { toast } from "sonner";

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
      toast.success("Link copied!");
    } catch {
      toast.error("Could not copy link.");
    }
  }, [url]);

  // sharp outlined button — ink default, blue on hover
  const pill =
    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium text-gray-700 border border-gray-200 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/50 transition-colors";

  return (
    <div
      className={`flex items-center flex-wrap gap-3 border-t border-b border-gray-200 py-4 ${className ?? ""}`}
    >
      <span className="text-[13px] font-semibold text-gray-500">Share this post:</span>

      <a href={links.x} target="_blank" rel="noopener noreferrer" aria-label="Share on X" className={pill}>
        <X className="h-4 w-4" />
      </a>

      <a href={links.linkedin} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn" className={pill}>
        <FaLinkedin className="h-4 w-4" />
        LinkedIn
      </a>

      <a href={links.facebook} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook" className={pill}>
        <FaFacebook className="h-4 w-4" />
        Facebook
      </a>

      <button onClick={handleCopy} aria-label="Copy link" className={pill}>
        <LinkIcon className="h-4 w-4" />
        Copy
      </button>
    </div>
  );
}
