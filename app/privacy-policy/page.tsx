import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — FreelanceMY",
  description:
    "Read our Privacy Policy to understand how FreelanceMY collects, uses, and protects your personal data in accordance with Malaysia's PDPA (2010).",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12 font-sans">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
        Privacy Policy
      </h1>
      <p className="text-gray-600 mb-10 text-sm">
        Last updated: <strong>September 2025</strong>
      </p>

      <div className="space-y-10 text-gray-800 leading-relaxed text-base">
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Introduction</h3>
          <p>
            FreelanceMY (“we”, “our”, “us”) is committed to protecting your privacy. This
            Privacy Policy outlines how we collect, use, and protect your{" "}
            <span className="font-semibold text-orange-600">personal data</span> in accordance
            with the <span className="font-semibold text-orange-600">Personal Data Protection Act 2010 (PDPA)</span> of Malaysia.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Information We Collect</h3>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Personal details:</strong> name, email, contact number</li>
            <li><strong>Technical data:</strong> IP address, browser type, device info</li>
            <li><strong>Usage data:</strong> pages visited, time on site, interactions</li>
            <li><strong>Form data:</strong> information submitted through our forms</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">3. How We Use Your Data</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>To operate and maintain our platform</li>
            <li>To communicate with you and provide support</li>
            <li>To send newsletters and marketing updates (only if opted in)</li>
            <li>To analyze usage for improvements and optimizations</li>
            <li>To comply with legal and regulatory requirements</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">4. Data Sharing & Disclosure</h3>
          <p>
            We <span className="font-semibold">do not sell</span> your personal data. We may share it with
            trusted third-party service providers (e.g., hosting, analytics, email services) or
            when legally required.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">5. Your Rights</h3>
          <p>
            Under PDPA, you have the right to{" "}
            <span className="font-semibold">access</span>,{" "}
            <span className="font-semibold">correct</span>, or{" "}
            <span className="font-semibold">delete</span> your personal data. You may also withdraw your
            consent for marketing at any time by contacting us.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">6. Data Retention</h3>
          <p>
            We retain your data only for as long as necessary to fulfill the purposes described in this
            policy or to comply with legal obligations. We then securely{" "}
            <span className="font-semibold">delete</span> or{" "}
            <span className="font-semibold">anonymize</span> your data.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">7. Data Security</h3>
          <p>
            We implement technical and organizational safeguards including{" "}
            <span className="font-semibold">encryption</span> and access controls. However, no online
            system is entirely secure. You use our platform at your own risk.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">8. Changes to This Policy</h3>
          <p>
            We may update this Privacy Policy occasionally. When we do, the updated date will reflect at
            the top of this page. Please check back regularly.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">9. Contact Us</h3>
          <p>
            For questions or concerns about this Privacy Policy:
            <br />
            <strong>Email:</strong>{" "}
            <a
              href="mailto:info@freelancemy.com"
              className="text-orange-600 hover:underline"
            >
              info@freelancemy.com
            </a>
            <br />
            <strong>Address:</strong> No.6, Lorong Batu Nilam 13G, Bandar Bukit Tinggi, 41200 Klang, Selangor, Malaysia
          </p>
        </section>
      </div>
    </main>
  );
}
