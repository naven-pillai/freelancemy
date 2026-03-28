// app/terms-conditions/page.tsx
import type { Metadata } from "next";
import TermsConditionsClient from "./TermsConditionsClient";

export const metadata: Metadata = {
  title: "Terms & Conditions — FreelanceMY",
  description:
    "Review the terms and conditions for using FreelanceMY, including website usage, content policies, and liability information for freelancers in Malaysia.",
  alternates: {
    canonical: "https://freelancemy.com/terms-conditions",
  },
};

export default function TermsConditionsPage() {
  return <TermsConditionsClient />;
}
