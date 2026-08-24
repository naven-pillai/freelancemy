"use client";

import Image from "next/image";
import { X, Globe } from "lucide-react";
import { FaLinkedin } from "react-icons/fa6";

const iconLink =
  "w-8 h-8 flex items-center justify-center border border-black text-black hover:text-blue-600 hover:border-blue-600 transition-colors";

export default function AuthorBio() {
  return (
    <div
      className="author-bio not-prose p-5 flex flex-col md:flex-row items-center md:items-start gap-4 border border-black bg-white"
      itemScope
      itemType="https://schema.org/Person"
    >
      {/* Avatar */}
      <div className="shrink-0">
        <Image
          src="/naven-pillai-bio-image.jpeg"
          alt="Naven Pillai"
          width={56}
          height={56}
          className="object-cover"
        />
      </div>

      {/* Author Info */}
      <div className="flex-1 text-center md:text-left">
        <h4 className="text-[15px] font-bold text-black mb-1" itemProp="name">
          Naven Pillai
        </h4>
        <p className="text-[13px] text-black leading-snug" itemProp="description">
          Driving digital transformation and sustainable growth as Regional
          Marketing Manager at Zoho Malaysia. Advocate of marketing automation
          and practical strategies that work for real businesses.
        </p>

        {/* Social Links */}
        <div className="flex justify-center md:justify-start gap-2 mt-3" itemProp="sameAs">
          <a
            href="https://www.linkedin.com/in/navenpillai"
            target="_blank"
            rel="noopener noreferrer"
            className={iconLink}
            aria-label="Naven on LinkedIn"
          >
            <FaLinkedin className="w-3.5 h-3.5" />
          </a>
          <a
            href="https://x.com/navenpillai"
            target="_blank"
            rel="noopener noreferrer"
            className={iconLink}
            aria-label="Naven on X"
          >
            <X className="w-3.5 h-3.5" />
          </a>
          <a
            href="https://navenpillai.com"
            target="_blank"
            rel="noopener noreferrer"
            className={iconLink}
            aria-label="FreelanceMY"
          >
            <Globe className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
