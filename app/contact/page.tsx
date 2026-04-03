import type { Metadata } from "next";
import ContactPageClient from "./ContactPageClient";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact — FreelanceMY",
  description:
    "Have questions or feedback? Contact the FreelanceMY team for support, partnerships, or media inquiries. We're here to help you succeed as a freelancer in Malaysia.",
  openGraph: {
    title: "Contact — FreelanceMY",
    description:
      "Have questions or feedback? Contact the FreelanceMY team. We're here to help you succeed as a freelancer in Malaysia.",
    url: `${SITE_URL}/contact`,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Contact — FreelanceMY",
    description:
      "Have questions or feedback? Contact the FreelanceMY team. We're here to help you succeed as a freelancer in Malaysia.",
  },
  alternates: {
    canonical: `${SITE_URL}/contact`,
  },
};

export default function ContactPage() {
  return <ContactPageClient />;
}
