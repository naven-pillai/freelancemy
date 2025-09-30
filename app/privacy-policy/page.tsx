// app/privacy-policy/page.tsx

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12 font-sans">
      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
        Privacy Policy
      </h1>
      <p className="text-gray-600 mb-10 text-sm">
        Last updated: <strong>September 2025</strong>
      </p>

      {/* Content */}
      <div className="space-y-8 text-gray-700 leading-relaxed text-base">
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            1. Introduction
          </h3>
          <p>
            FreelanceMY (“we”, “our”, “us”) values your privacy. This Privacy
            Policy explains how we collect, use, and safeguard your{" "}
            <span className="text-accent font-semibold">personal data</span> in
            line with the{" "}
            <span className="text-accent font-semibold hover:text-orange-600 transition-colors">
              Personal Data Protection Act 2010 (PDPA)
            </span>{" "}
            in Malaysia.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            2. Information We Collect
          </h3>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <span className="font-semibold">Personal details:</span> name,
              email, contact info
            </li>
            <li>
              <span className="font-semibold">Technical data:</span> IP,
              browser, device info
            </li>
            <li>
              <span className="font-semibold">Usage data:</span> pages visited,
              interactions
            </li>
            <li>
              <span className="font-semibold">Form data:</span> details you
              provide via forms (e.g., Contact page)
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            3. How We Use Your Data
          </h3>
          <ul className="list-disc list-inside space-y-1">
            <li>To provide and improve our services</li>
            <li>To respond to your inquiries and support requests</li>
            <li>
              To send <span className="font-semibold">newsletters and updates</span>
            </li>
            <li>To analyze site usage and improve user experience</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            4. Data Sharing & Disclosure
          </h3>
          <p>
            We <span className="font-semibold">do not sell</span> your personal
            data. We may only share it with trusted service providers (hosting,
            analytics, email) or when legally required.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">5. Your Rights</h3>
          <p>
            Under PDPA, you have the right to{" "}
            <span className="font-semibold">access</span>,{" "}
            <span className="font-semibold">correct</span>, or{" "}
            <span className="font-semibold">delete</span> your data. You can
            also withdraw consent for marketing at any time.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            6. Data Retention
          </h3>
          <p>
            We keep data only as long as needed for services, compliance, or
            disputes. Old data will be securely{" "}
            <span className="font-semibold">deleted</span> or{" "}
            <span className="font-semibold">anonymized</span>.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">7. Security</h3>
          <p>
            We use <span className="font-semibold">encryption</span> and access
            controls to protect your data, but no system is 100% secure. You use
            our site at your own risk.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            8. Changes to This Policy
          </h3>
          <p>
            We may update this policy periodically. Please review it regularly
            to stay informed.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">9. Contact Us</h3>
          <p>
            For privacy-related questions, reach us at: <br />
            <strong>Email:</strong>{" "}
            <a
              href="mailto:privacy@freelancemy.com"
              className="text-accent hover:text-orange-600 transition-colors"
            >
              privacy@freelancemy.com
            </a>
            <br />
            <strong>Address:</strong> (Insert business address here)
          </p>
        </section>
      </div>
    </main>
  );
}
