"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage =
    pathname === "/admin/login" || pathname === "/admin/logout";

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100 antialiased">
      <AdminSidebar />

      {/* Main content — white panel with rounded top-left */}
      <div className="flex-1 flex flex-col lg:ml-60">
        <div className="flex-1 bg-white md:rounded-tl-3xl shadow-inner min-h-screen">
          <AdminHeader />
          <main className="pt-14 lg:pt-0">
            <div className="px-6 py-8 lg:px-10 lg:py-8 max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
