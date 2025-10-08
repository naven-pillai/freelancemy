import type { Metadata } from "next";
import AboutPageClient from "./AboutPageClient";

export const metadata: Metadata = {
  title: "About — FreelanceMY",
  description:
    "Discover the story behind FreelanceMY — a platform built to empower Malaysian freelancers through education, tools, and community support. Learn about our mission to make freelancing a sustainable career path in Malaysia and across APAC.",
  openGraph: {
    title: "About — FreelanceMY",
    description:
      "FreelanceMY empowers freelancers in Malaysia with tools, insights, and opportunities to thrive in the digital economy.",
    url: "https://freelancemy.com/about",
    siteName: "FreelanceMY",
    type: "website",
  },
  alternates: {
    canonical: "https://freelancemy.com/about",
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
