import type { Metadata } from "next";
import { Rubik, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ✅ Rubik for body text (base)
const rubik = Rubik({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// ✅ Inter for headings
const inter = Inter({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "FreelanceMY | Guides & Resources for Freelancers in Malaysia",
    template: "%s | FreelanceMY",
  },
  description:
    "#1 resource hub for freelancers in Malaysia. Explore expert guides, tips, and tools to elevate your freelance career.",
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
        className={`${rubik.variable} ${inter.variable} font-sans antialiased bg-gray-50 text-gray-900 flex flex-col min-h-screen`}
      >
        {/* ✅ Full-width Sticky Navbar */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm w-full">
          <Navbar />
        </header>

        {/* ✅ Main Content Area */}
        <main
          id="main"
          className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-12"
        >
          {children}
        </main>

        {/* ✅ Full-width Footer */}
        <footer className="w-full bg-white border-t border-gray-200">
          <Footer />
        </footer>
      </body>
    </html>
  );
}
