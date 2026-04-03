// app/terms-conditions/page.tsx
import type { Metadata } from "next";
import TermsConditionsClient from "./TermsConditionsClient";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms & Conditions — FreelanceMY",
  description:
    "Review the terms and conditions for using FreelanceMY, including website usage, content policies, and liability information for freelancers in Malaysia.",
  openGraph: {
    title: "Terms & Conditions — FreelanceMY",
    description:
      "Review the terms and conditions for using FreelanceMY, including website usage, content policies, and liability information.",
    url: `${SITE_URL}/terms-conditions`,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Terms & Conditions — FreelanceMY",
    description:
      "Review the terms and conditions for using FreelanceMY, including website usage, content policies, and liability information.",
  },
  alternates: {
    canonical: `${SITE_URL}/terms-conditions`,
  },
};

export default function TermsConditionsPage() {
  return <TermsConditionsClient />;
}
