"use client";

import Link from "next/link";
import { Facebook, Linkedin, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Footer() {
  return (
    <footer className="w-full bg-white mt-16 footer">
      {/* Upper Section */}
      <div className="w-full bg-white">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-10 md:gap-y-12 gap-x-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <h5 className="text-base font-semibold text-gray-900">FreelanceMY</h5>
            <p>
              FreelanceMY is your trusted resource for freelancing in Malaysia —
              insights, guides, and opportunities for the modern independent
              professional.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4>Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="footer-link">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="footer-link">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="footer-link">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-conditions" className="footer-link">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div className="space-y-4">
            <h4>Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/blog" className="footer-link">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="footer-link">
                  Remote Jobs
                </Link>
              </li>
              <li>
                <Link href="/post-a-job" className="footer-link">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link href="/faq" className="footer-link">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h4>Connect</h4>
            <div className="flex gap-4 items-center">
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
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <p>© {new Date().getFullYear()} FreelanceMY. All rights reserved.</p>
          <p className="mt-1 md:mt-0">Built with ❤️ for freelancers in Malaysia.</p>
        </div>
      </div>
    </footer>
  );
}
