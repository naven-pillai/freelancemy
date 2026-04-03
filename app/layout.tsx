import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Roboto } from "next/font/google";
import "./globals.css";
import ClickyAnalytics from "@/analytics/ClickyAnalytics";
import LayoutShell from "@/components/LayoutShell";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";
import { SITE_URL } from "@/lib/constants";

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

export const viewport: Viewport = {
  themeColor: "#2563eb",
};

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
    url: SITE_URL,
    siteName: "FreelanceMY Blog",
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
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
    images: [`${SITE_URL}/og-image.jpg`],
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
        suppressHydrationWarning
      >
        <ClickyAnalytics />
        <Toaster position="top-right" richColors />
        <LayoutShell footer={<Footer />}>{children}</LayoutShell>
      </body>
    </html>
  );
}
