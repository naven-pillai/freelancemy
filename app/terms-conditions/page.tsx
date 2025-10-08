// app/terms-conditions/page.tsx
import type { Metadata } from "next";
import TermsConditionsClient from "./TermsConditionsClient";

export const metadata: Metadata = {
  title: "Terms & Conditions — FreelanceMY",
  description: "Review our terms and conditions for using FreelanceMY.",
};

export default function TermsConditionsPage() {
  return <TermsConditionsClient />;
}
