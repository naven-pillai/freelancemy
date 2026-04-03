import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/constants";
import AboutPageClient from "./AboutPageClient";

export const metadata: Metadata = {
  title: "About — FreelanceMY",
  description:
    "Discover the story behind FreelanceMY — a platform built to empower Malaysian freelancers through education, tools, and community support. Learn about our mission to make freelancing a sustainable career path in Malaysia and across APAC.",
  openGraph: {
    title: "About — FreelanceMY",
    description:
      "FreelanceMY empowers freelancers in Malaysia with applications, insights, and opportunities to thrive in the digital economy.",
    url: `${SITE_URL}/about`,
    siteName: SITE_NAME,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About — FreelanceMY",
    description:
      "FreelanceMY empowers freelancers in Malaysia with applications, insights, and opportunities to thrive in the digital economy.",
  },
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
};

function OrganizationSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: SITE_NAME,
          url: SITE_URL,
          description:
            "A platform built to empower Malaysian freelancers through education, tools, and community support.",
          founder: {
            "@type": "Person",
            name: "Naven Pillai",
            url: "https://navenpillai.com",
          },
          sameAs: [
            "https://facebook.com/freelancemy",
            "https://x.com/freelancemy",
            "https://linkedin.com/company/freelancemy",
          ],
        }),
      }}
    />
  );
}

export default function AboutPage() {
  return (
    <>
      <OrganizationSchema />
      <AboutPageClient />
    </>
  );
}
