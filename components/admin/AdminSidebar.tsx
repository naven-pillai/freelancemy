"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Mail,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Blog", href: "/admin/blog", icon: FileText },
  { label: "Comments", href: "/admin/comments", icon: MessageSquare },
  { label: "Messages", href: "/admin/messages", icon: Mail },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const sidebar = (
    <nav className="flex flex-col h-full bg-white">
      {/* Brand */}
      <div className="px-5 pt-6 pb-4 border-b border-gray-100">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shrink-0 shadow-sm">
            <span className="text-white text-xs font-bold">FM</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 leading-none">
              FreelanceMY
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Section label */}
      <div className="px-5 pt-5 pb-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
          Content Manager
        </p>
      </div>

      {/* Nav items */}
      <div className="flex-1 overflow-y-auto px-3 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                active
                  ? "bg-emerald-600/10 text-emerald-700"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 shrink-0 transition-colors",
                  active
                    ? "text-emerald-600"
                    : "text-gray-400 group-hover:text-gray-600"
                )}
              />
              <span className="flex-1">{item.label}</span>
              {active && (
                <ChevronRight className="w-3.5 h-3.5 text-emerald-600 opacity-60" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Logout */}
      <div className="border-t border-gray-100 px-3 py-3">
        <Link
          href="/admin/logout"
          className="group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:bg-red-50 hover:text-red-600 transition-all duration-150"
        >
          <LogOut className="w-4 h-4 shrink-0 group-hover:text-red-600 transition-colors" />
          Logout
        </Link>
      </div>
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-60 lg:fixed lg:inset-y-0 bg-white border-r border-gray-100 z-40">
        {sidebar}
      </aside>

      {/* Mobile toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">FM</span>
          </div>
          <span className="text-sm font-bold text-gray-900">FreelanceMY</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-label="Toggle navigation menu"
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {mobileOpen ? (
            <X className="h-5 w-5 text-gray-600" />
          ) : (
            <Menu className="h-5 w-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 w-60 bg-white shadow-2xl z-50">
            {sidebar}
          </aside>
        </div>
      )}
    </>
  );
}
