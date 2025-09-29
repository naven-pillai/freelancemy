"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Linkedin, Twitter, Globe } from "lucide-react";

export default function AuthorBio() {
  return (
    <Card className="author-bio not-prose p-4 md:p-5 flex flex-col md:flex-row items-center md:items-start gap-4 border rounded-xl shadow-sm bg-gray-50">
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
        <h4 className="mb-1">Naven Pillai</h4>
        <p>
          Driving digital transformation and sustainable growth as Regional
          Marketing Manager at Zoho Malaysia. Advocate of marketing automation
          and practical strategies that work for real businesses.
        </p>

        {/* Social Links */}
        <div className="flex justify-center md:justify-start gap-3 mt-2">
          <a
            href="https://www.linkedin.com/in/navenpillai"
            target="_blank"
            rel="noopener noreferrer"
            className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:text-orange-600 hover:border-orange-600 transition-colors"
          >
            <Linkedin className="w-3.5 h-3.5" />
          </a>
          <a
            href="https://x.com/navenpillai"
            target="_blank"
            rel="noopener noreferrer"
            className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:text-orange-600 hover:border-orange-600 transition-colors"
          >
            <Twitter className="w-3.5 h-3.5" />
          </a>
          <a
            href="https://freelancemy.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:text-orange-600 hover:border-orange-600 transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </Card>
  );
}
