import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClickyAnalytics from "@/analytics/ClickyAnalytics";
import LayoutShell from "@/components/LayoutShell";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";
import { SITE_URL } from "@/lib/constants";

// Inter carries the whole site — nav, body, headings, meta. 400 for body/meta,
// 600/700 for titles and nav.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#2563eb",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "FreelanceMY | Guides & Resources for Freelancers in Malaysia",
    template: "%s | FreelanceMY",
  },
  description:
    "#1 resource hub for freelancers in Malaysia. Explore expert guides, tips, and tools to elevate your freelance career.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_MY",
    url: SITE_URL,
    siteName: "FreelanceMY",
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
  // When the Cloudinary loader is active it serves the LCP featured image.
  // Preconnect so the connection is ready before the image request fires.
  const cloudinaryEnabled = !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  return (
    <html lang="en" suppressHydrationWarning>
      {cloudinaryEnabled && (
        <head>
          <link rel="preconnect" href="https://res.cloudinary.com" />
          <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        </head>
      )}
      <body
        className={`${inter.variable} font-sans antialiased bg-white text-black flex flex-col min-h-screen`}
        suppressHydrationWarning
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "FreelanceMY",
              url: SITE_URL,
              logo: "https://loigoouddqshbpygboos.supabase.co/storage/v1/object/public/blog-images/freelance-my-logo.png",
              description:
                "The #1 resource hub for freelancers in Malaysia. Expert guides, tips, and tools to elevate your freelance career.",
              sameAs: [
                "https://facebook.com/freelancemy",
                "https://x.com/freelancemy",
                "https://linkedin.com/company/freelancemy",
              ],
            }),
          }}
        />
        <ClickyAnalytics />
        <Toaster position="top-right" richColors />
        <LayoutShell footer={<Footer />}>{children}</LayoutShell>
      </body>
    </html>
  );
}
