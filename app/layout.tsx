import type { Metadata } from "next";
import { Rubik, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ✅ Inter for clean body text
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// ✅ Rubik for headings
const rubik = Rubik({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "FreelanceMY Blog",
    template: "%s | FreelanceMY Blog",
  },
  description: "Guides, insights, and news for freelancers in Malaysia.",
  openGraph: {
    type: "website",
    locale: "en_MY",
    url: "https://freelancemy.com",
    siteName: "FreelanceMY Blog",
  },
  twitter: {
    card: "summary_large_image",
    site: "@freelancemy",
    creator: "@freelancemy",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${rubik.variable} font-sans antialiased bg-gray-50 text-gray-900 flex flex-col min-h-screen`}
      >
        {/* ✅ Sticky Navbar */}
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
          <Navbar />
        </header>

        {/* ✅ Main Content */}
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        {/* ✅ Footer */}
        <footer className="border-t border-gray-200 mt-8 bg-white">
          <Footer />
        </footer>
      </body>
    </html>
  );
}
