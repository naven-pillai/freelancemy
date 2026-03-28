"use client";

import { Search, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminHeader() {
  const [search, setSearch] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) setUserEmail(user.email);
    });
  }, []);

  const initials = userEmail
    ? userEmail
        .split("@")[0]
        .split(/[._-]/)
        .slice(0, 2)
        .map((s) => s.charAt(0).toUpperCase())
        .join("")
    : "A";

  const displayName = userEmail ? userEmail.split("@")[0] : "Admin";

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/admin/blog?q=${encodeURIComponent(search.trim())}`);
    }
  }

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100/80 hidden lg:block">
      <div className="flex items-center justify-between h-14 px-10">
        {/* Search */}
        <form onSubmit={handleSearch} className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-lg border border-gray-200 bg-gray-50/80 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
          />
        </form>

        {/* Right side */}
        <div className="flex items-center gap-3 ml-4">
          <button
            className="relative p-2 rounded-lg hover:bg-gray-50 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4 text-gray-400" />
          </button>

          <div className="w-px h-5 bg-gray-200" />

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center shadow-sm">
              <span className="text-white text-[11px] font-semibold">
                {initials}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 leading-none">
                {displayName}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">Admin</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
