"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function LayoutShell({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <div className="admin-shell">{children}</div>;
  }

  return (
    <div className="public-site bg-white">
      <header className="w-full bg-white pt-4">
        <Navbar />
      </header>

      <main
        id="main"
        className="flex-1 w-full max-w-300 mx-auto px-5 sm:px-8 py-8 sm:py-12"
      >
        {children}
      </main>

      {footer}
    </div>
  );
}
