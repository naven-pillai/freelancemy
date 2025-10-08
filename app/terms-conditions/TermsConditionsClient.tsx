"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function TermsConditionsClient() {
  const [isTOCOpen, setIsTOCOpen] = useState(false);

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 font-sans text-gray-700 leading-relaxed">
      <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>

      <button
        className="mb-4 text-sm text-blue-600 underline"
        onClick={() => setIsTOCOpen(!isTOCOpen)}
      >
        {isTOCOpen ? "Hide TOC" : "Show Table of Contents"}
      </button>

      {isTOCOpen && (
        <ul className="mb-6 list-disc list-inside text-sm text-gray-600">
          <li><a href="#usage">Website Usage</a></li>
          <li><a href="#privacy">Privacy Policy</a></li>
          <li><a href="#liability">Limitation of Liability</a></li>
          <li><a href="#updates">Changes to Terms</a></li>
        </ul>
      )}

      <section id="usage" className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. Website Usage</h2>
        <p>
          By accessing FreelanceMY, you agree to use the site only for lawful purposes.
          You must not misuse or attempt to hack, overload, or interfere with the website.
        </p>
      </section>

      <section id="privacy" className="mb-6">
        <h2 className="text-xl font-semibold mb-2">2. Privacy Policy</h2>
        <p>
          We respect your privacy. All personal data is handled as outlined in our{" "}
          <Link href="/privacy-policy" className="text-blue-600 underline">Privacy Policy</Link>.
        </p>
      </section>

      <section id="liability" className="mb-6">
        <h2 className="text-xl font-semibold mb-2">3. Limitation of Liability</h2>
        <p>
          FreelanceMY is not liable for any indirect damages arising from your use of the platform.
        </p>
      </section>

      <section id="updates" className="mb-6">
        <h2 className="text-xl font-semibold mb-2">4. Changes to Terms</h2>
        <p>
          We may update our terms from time to time. You’re advised to review this page periodically.
        </p>
      </section>
    </main>
  );
}
