import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Roboto } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ClickyAnalytics from "@/analytics/ClickyAnalytics";

// UI + headings font
const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

// Long-form reading font (article prose only)
const roboto = Roboto({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "FreelanceMY | Guides & Resources for Freelancers in Malaysia",
    template: "%s | FreelanceMY",
  },
  description:
    "#1 resource hub for freelancers in Malaysia. Explore expert guides, tips, and tools to elevate your freelance career.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_MY",
    url: "https://freelancemy.com",
    siteName: "FreelanceMY Blog",
    images: [
      {
        url: "https://freelancemy.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "FreelanceMY — Guides & Resources for Freelancers in Malaysia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@freelancemy",
    creator: "@freelancemy",
    images: ["https://freelancemy.com/og-image.jpg"],
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
        className={`${plusJakartaSans.variable} ${roboto.variable} font-sans antialiased bg-gray-50 text-gray-900 flex flex-col min-h-screen`}
      >
        {/* ✅ Clicky Analytics */}
        <ClickyAnalytics />

        {/* ✅ Sticky Navbar */}
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

        {/* ✅ Footer */}
        <Footer />
      </body>
    </html>
  );
}
