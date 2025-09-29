import type { Metadata } from "next";
import { Titillium_Web, Fira_Code } from "next/font/google";
import "./globals.css";

// ✅ Titillium Web for modern sans-serif
const titillium = Titillium_Web({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap", // 👈 avoids FOIT
});

// ✅ Fira Code for monospace (code blocks, pre, inline code)
const firaCode = Fira_Code({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
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
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${titillium.variable} ${firaCode.variable} font-sans antialiased bg-white text-gray-900`}
      >
        {children}
      </body>
    </html>
  );
}
