"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <div className="admin-shell">{children}</div>;
  }

  return (
    <div className="public-site">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm w-full">
        <Navbar />
      </header>

      <main
        id="main"
        className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-12"
      >
        {children}
      </main>

      <Footer />
    </div>
  );
}
