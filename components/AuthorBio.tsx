"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Linkedin, X, Globe } from "lucide-react"; // ✅ swapped Twitter → X

export default function AuthorBio() {
  return (
    <Card
      className="author-bio not-prose p-4 md:p-5 flex flex-col md:flex-row items-center md:items-start gap-4 border rounded-xl shadow-sm bg-gray-50"
      itemScope
      itemType="https://schema.org/Person"
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        <Image
          src="/naven-pillai-bio-image.jpeg"
          alt="Naven Pillai"
          width={56}
          height={56}
          className="rounded-full object-cover border border-gray-200"
        />
      </div>

      {/* Author Info */}
      <div className="flex-1 text-center md:text-left">
        <h4 className="text-sm font-semibold mb-1" itemProp="name">
          Naven Pillai
        </h4>
        <p
          className="text-xs md:text-[13px] text-gray-700 leading-snug"
          itemProp="description"
        >
          Driving digital transformation and sustainable growth as Regional
          Marketing Manager at Zoho Malaysia. Advocate of marketing automation
          and practical strategies that work for real businesses.
        </p>

        {/* Social Links */}
        <div
          className="flex justify-center md:justify-start gap-3 mt-2"
          itemProp="sameAs"
        >
          <a
            href="https://www.linkedin.com/in/navenpillai"
            target="_blank"
            rel="noopener noreferrer"
            className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:text-orange-600 hover:border-orange-600 transition-colors"
            aria-label="Naven on LinkedIn"
          >
            <Linkedin className="w-3.5 h-3.5" />
          </a>
          <a
            href="https://x.com/navenpillai"
            target="_blank"
            rel="noopener noreferrer"
            className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:text-orange-600 hover:border-orange-600 transition-colors"
            aria-label="Naven on X"
          >
            <X className="w-3.5 h-3.5" /> {/* ✅ changed icon to X */}
          </a>
          <a
            href="https://navenpillai.com "
            target="_blank"
            rel="noopener noreferrer"
            className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:text-orange-600 hover:border-orange-600 transition-colors"
            aria-label="FreelanceMY"
          >
            <Globe className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </Card>
  );
}
