"use client";

import Link from "next/link";
import { Facebook, Linkedin, X } from "lucide-react";

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
                <Link href="/about" className="footer-link">About</Link>
              </li>
              <li>
                <Link href="/contact" className="footer-link">Contact</Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="footer-link">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms-conditions" className="footer-link">Terms & Conditions</Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div className="space-y-4">
            <h4>Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://kerja-remote.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  Kerja Remote
                </Link>
              </li>
              <li>
                <Link
                  href="https://navenpillai.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  Naven Pillai
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Accounts */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-wide text-muted-foreground">Connect</h4>
            <div className="flex flex-wrap gap-2">
              <Link
                href="https://facebook.com/freelancemy"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="FreelanceMY on Facebook"
                className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition text-sm"
              >
                <Facebook className="h-4 w-4 text-blue-600 group-hover:text-white transition" />
                <span className="group-hover:text-white transition">Facebook</span>
              </Link>

              <Link
                href="https://x.com/freelancemy"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="FreelanceMY on X"
                className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-black text-black hover:bg-black hover:text-white transition text-sm"
              >
                <X className="h-4 w-4 text-black group-hover:text-white transition" />
                <span className="group-hover:text-white transition">X</span>
              </Link>

              <Link
                href="https://linkedin.com/company/freelancemy"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="FreelanceMY on LinkedIn"
                className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white transition text-sm"
              >
                <Linkedin className="h-4 w-4 text-blue-700 group-hover:text-white transition" />
                <span className="group-hover:text-white transition">LinkedIn</span>
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
