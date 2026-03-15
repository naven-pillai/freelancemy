"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <nav>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="https://loigoouddqshbpygboos.supabase.co/storage/v1/object/public/blog-images/freelance-my-logo.png"
              alt="FreelanceMY Logo"
              width={140}
              height={40}
              className="h-10"
              style={{ width: "auto", height: "2.5rem" }}
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8">
            <Link
              href="/about"
              className="text-gray-700 hover:text-orange-600 font-medium"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-orange-600 font-medium"
            >
              Contact
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-orange-600 focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-3 space-y-2 shadow-sm">
          <Link
            href="/about"
            className="block text-gray-700 hover:text-orange-600 font-medium"
            onClick={() => setIsOpen(false)}
          >
            About Us
          </Link>
          <Link
            href="/contact"
            className="block text-gray-700 hover:text-orange-600 font-medium"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>
        </div>
      )}
    </nav>
  );
}
