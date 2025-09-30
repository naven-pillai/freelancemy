// app/terms-conditions/page.tsx
"use client";

import { useState } from "react";

export default function TermsConditionsPage() {
  const [isTOCOpen, setIsTOCOpen] = useState(false);

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 font-sans text-gray-700 leading-relaxed">
      {/* ✅ Header */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
        Terms & Conditions
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        Last updated: <strong>September 2025</strong>
      </p>

      {/* ✅ Collapsible TOC with consistent background */}
      <div className="mb-12 bg-gray-50 border rounded-lg shadow-sm">
        <button
          onClick={() => setIsTOCOpen(!isTOCOpen)}
          className="w-full flex justify-between items-center p-4 rounded-lg"
        >
          <span className="text-sm font-medium text-gray-800">Table of Contents</span>
          <span className="text-gray-500">{isTOCOpen ? "−" : "+"}</span>
        </button>
        {isTOCOpen && (
          <ul className="mt-2 mb-4 pl-6 pr-4 space-y-1 text-sm text-blue-700">
            <li className="list-disc list-inside marker:text-xs">
              <a href="#acceptance" className="hover:text-orange-600">1. Acceptance of Terms</a>
            </li>
            <li className="list-disc list-inside marker:text-xs">
              <a href="#changes" className="hover:text-orange-600">2. Changes to Terms</a>
            </li>
            <li className="list-disc list-inside marker:text-xs">
              <a href="#use" className="hover:text-orange-600">3. Use of Content</a>
            </li>
            <li className="list-disc list-inside marker:text-xs">
              <a href="#prohibited" className="hover:text-orange-600">4. Prohibited Uses</a>
            </li>
            <li className="list-disc list-inside marker:text-xs">
              <a href="#submissions" className="hover:text-orange-600">5. User Submissions</a>
            </li>
            <li className="list-disc list-inside marker:text-xs">
              <a href="#disclaimer" className="hover:text-orange-600">6. Disclaimer & Liability</a>
            </li>
            <li className="list-disc list-inside marker:text-xs">
              <a href="#indemnification" className="hover:text-orange-600">7. Indemnification</a>
            </li>
            <li className="list-disc list-inside marker:text-xs">
              <a href="#law" className="hover:text-orange-600">8. Governing Law</a>
            </li>
            <li className="list-disc list-inside marker:text-xs">
              <a href="#severability" className="hover:text-orange-600">9. Severability</a>
            </li>
            <li className="list-disc list-inside marker:text-xs">
              <a href="#contact" className="hover:text-orange-600">10. Contact Information</a>
            </li>
          </ul>
        )}
      </div>

      {/* ✅ Content */}
      <section className="space-y-10">
        <div id="acceptance">
          <h3 className="text-base font-semibold text-gray-900 mb-2">1. Acceptance of Terms</h3>
          <p>
            By accessing or using the FreelanceMY website (https://freelancemy.com), you agree to these Terms & Conditions.
            If you do not accept, please discontinue use of this website.
          </p>
        </div>

        <div id="changes">
          <h3 className="text-base font-semibold text-gray-900 mb-2">2. Changes to Terms</h3>
          <p>
            We may revise these Terms periodically. Updates will be reflected in the “Last updated” date above. Continued
            use after changes means you accept the revised Terms.
          </p>
        </div>

        <div id="use">
          <h3 className="text-base font-semibold text-gray-900 mb-2">3. Use of Content</h3>
          <p>
            Content (articles, text, images, and resources) is owned by or licensed to FreelanceMY, unless otherwise stated.
            You may view and share content for personal, non-commercial purposes with proper attribution.
          </p>
        </div>

        <div id="prohibited">
          <h3 className="text-base font-semibold text-gray-900 mb-2">4. Prohibited Uses</h3>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Engage in unlawful, fraudulent, or harmful activity.</li>
            <li>Infringe intellectual property or privacy rights.</li>
            <li>Upload or distribute malicious code.</li>
            <li>Scrape, crawl, or data-mine without permission.</li>
            <li>Bypass security measures or reverse-engineer systems.</li>
          </ul>
        </div>

        <div id="submissions">
          <h3 className="text-base font-semibold text-gray-900 mb-2">5. User Submissions</h3>
          <p>
            Any content you provide (e.g., through forms or comments) grants FreelanceMY a worldwide, royalty-free license
            to use, reproduce, and display it as necessary. You represent that your submission is lawful and does not violate
            third-party rights.
          </p>
        </div>

        <div id="disclaimer">
          <h3 className="text-base font-semibold text-gray-900 mb-2">6. Disclaimer & Liability</h3>
          <p>
            Content is provided for informational purposes only. We do not guarantee accuracy, reliability, or completeness.
            Use of the site is at your own risk.
          </p>
          <p>
            FreelanceMY will not be held liable for indirect, incidental, or consequential damages resulting from the use of
            this website.
          </p>
        </div>

        <div id="indemnification">
          <h3 className="text-base font-semibold text-gray-900 mb-2">7. Indemnification</h3>
          <p>
            You agree to indemnify and hold harmless FreelanceMY, its affiliates, and partners from any claims, damages, or
            losses arising out of your use of the site or breach of these Terms.
          </p>
        </div>

        <div id="law">
          <h3 className="text-base font-semibold text-gray-900 mb-2">8. Governing Law</h3>
          <p>
            These Terms are governed by the laws of Malaysia. Disputes shall be subject to the exclusive jurisdiction of
            courts in Malaysia.
          </p>
        </div>

        <div id="severability">
          <h3 className="text-base font-semibold text-gray-900 mb-2">9. Severability</h3>
          <p>
            If any provision of these Terms is deemed invalid, the remaining provisions shall remain in full effect.
          </p>
        </div>

        <div id="contact">
          <h3 className="text-base font-semibold text-gray-900 mb-2">10. Contact Information</h3>
          <p>
            For inquiries regarding these Terms, contact us at: <br />
            <strong>Email:</strong> support@freelancemy.com <br />
            <strong>Address:</strong> (Insert company address here)
          </p>
        </div>
      </section>
    </main>
  );
}
