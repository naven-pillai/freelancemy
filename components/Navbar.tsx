"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Close mobile menu on route change (React idiom: derive state during render)
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
  }

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMenu();
        return;
      }
      if (e.key === "Tab" && menuRef.current) {
        const focusable = menuRef.current.querySelectorAll<HTMLElement>(
          'a, button, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    const firstLink = menuRef.current?.querySelector<HTMLElement>("a");
    firstLink?.focus();

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeMenu]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const linkClass = (active: boolean) =>
    `text-[16px] font-semibold text-black border-b-2 pb-0.5 transition-colors ${
      active ? "border-[#2563eb]" : "border-transparent hover:border-[#2563eb]"
    }`;

  return (
    <nav>
      <div className="max-w-300 mx-auto px-5 sm:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0" aria-label="FreelanceMY home">
            <Image
              src="https://loigoouddqshbpygboos.supabase.co/storage/v1/object/public/blog-images/freelance-my-logo.png"
              alt="FreelanceMY Logo"
              width={140}
              height={40}
              sizes="120px"
              className="h-8 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-5">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={linkClass(isActive(link.href))}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop action — outlined magenta, never filled */}
          <div className="hidden md:flex items-center">
            <Link
              href="/contact"
              className="inline-flex items-center px-4 py-2 text-[16px] font-semibold text-black border-2 border-glitch hover:text-glitch transition-colors"
            >
              Get in Touch
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            ref={toggleRef}
            className="md:hidden p-2 text-black"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div
          ref={menuRef}
          id="mobile-menu"
          role="menu"
          className="md:hidden bg-white px-5 py-5 space-y-4 border-t border-hairline"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block text-[18px] font-semibold text-black w-fit border-b-2 ${
                isActive(link.href) ? "border-glitch" : "border-transparent"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="inline-flex items-center px-4 py-2 text-[16px] font-semibold text-black border-2 border-glitch"
          >
            Get in Touch
          </Link>
        </div>
      )}
    </nav>
  );
}
