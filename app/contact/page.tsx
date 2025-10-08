import type { Metadata } from "next";
import ContactPageClient from "./ContactPageClient";

export const metadata: Metadata = {
  title: "Contact — FreelanceMY",
  description:
    "Have questions or feedback? Contact the FreelanceMY team for support, partnerships, or media inquiries. We're here to help you succeed as a freelancer in Malaysia.",
};

export default function ContactPage() {
  return <ContactPageClient />;
}
