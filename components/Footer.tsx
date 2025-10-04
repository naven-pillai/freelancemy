"use client";

import Link from "next/link";
import { Facebook, Linkedin, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button"; // ✅ shadcn button styles
import { cn } from "@/lib/utils"; // ✅ helper for merging classes

export default function Footer() {
  return (
    <footer className="border-t bg-white-50 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand Section */}
        <div>
          <h5 className="text-lg font-bold text-gray-900">FreelanceMY</h5>
          <p className="mt-3 text-sm text-gray-600 leading-relaxed">
            FreelanceMY is your trusted resource for freelancing in Malaysia —
            insights, guides, and opportunities for the modern independent
            professional.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="text-sm font-semibold text-gray-800 mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>
              <Link href="/about" className="hover:text-orange-600 transition">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-orange-600 transition">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:text-orange-600 transition">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms-conditions" className="hover:text-orange-600 transition">
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 className="text-sm font-semibold text-gray-800 mb-4">Connect</h4>
          <div className="flex gap-3">
            <Link
              href="https://www.facebook.com/freelancemy"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "rounded-full hover:text-blue-600"
              )}
            >
              <Facebook className="h-5 w-5" />
            </Link>
            <Link
              href="https://x.com/freelancemy"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "rounded-full hover:text-black"
              )}
            >
              <X className="h-5 w-5" />
            </Link>
            <Link
              href="https://linkedin.com/company/freelancemy"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "rounded-full hover:text-blue-700"
              )}
            >
              <Linkedin className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t bg-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
          <p>© {new Date().getFullYear()} FreelanceMY. All rights reserved.</p>
          <p className="mt-2 md:mt-0">
            Built with ❤️ for freelancers in Malaysia.
          </p>
        </div>
      </div>
    </footer>
  );
}
