"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FaLinkedinIn, FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { submitContactForm, type ContactFormState } from "./actions";

export default function ContactPage() {
  const [state, formAction, isPending] = useActionState<ContactFormState, FormData>(
    submitContactForm,
    null
  );

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Get in Touch</h1>
        <p className="text-lg text-gray-600">
          Have a question, feedback, or just want to connect? Fill out the form below — we&apos;d love to hear from you.
        </p>
      </div>

      {/* Contact Form */}
      <div className="bg-white shadow-md rounded-xl p-8 border border-gray-200">
        {state?.success ? (
          <div className="text-center py-8 space-y-2">
            <p className="text-green-600 font-semibold text-lg">{state.message}</p>
            <p className="text-gray-500 text-sm">We&apos;ll get back to you at your provided email.</p>
          </div>
        ) : (
          <form action={formAction} className="space-y-6">
            <div>
              <label htmlFor="contact-name" className="block text-sm font-semibold text-gray-800 mb-2">
                Your Name
              </label>
              <Input
                id="contact-name"
                name="name"
                type="text"
                placeholder="John Doe"
                required
                disabled={isPending}
                className="w-full border-gray-300 focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label htmlFor="contact-email" className="block text-sm font-semibold text-gray-800 mb-2">
                Email Address
              </label>
              <Input
                id="contact-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                disabled={isPending}
                className="w-full border-gray-300 focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label htmlFor="contact-message" className="block text-sm font-semibold text-gray-800 mb-2">
                Your Message
              </label>
              <Textarea
                id="contact-message"
                name="message"
                placeholder="Write your message here..."
                rows={5}
                required
                disabled={isPending}
                className="w-full border-gray-300 focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {state && !state.success && (
              <p className="text-sm font-medium text-red-600">{state.message}</p>
            )}

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-blue-600 hover:bg-blue-800 text-white font-semibold py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              {isPending ? "Sending..." : "Send Message"}
            </Button>
          </form>
        )}
      </div>

      {/* Extra Info */}
      <div className="mt-12 text-center text-gray-600">
        <p>
          Or email us directly at{" "}
          <a
            href="mailto:hello@freelancemy.com"
            className="text-blue-600 font-semibold hover:text-orange-500"
          >
            hello@freelancemy.com
          </a>
        </p>
      </div>

      {/* Social Links */}
      <div className="mt-10 flex justify-center gap-6">
        <a
          href="https://linkedin.com/company/freelancemalaysia"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-blue-50 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition"
        >
          <FaLinkedinIn className="w-5 h-5 text-blue-700" />
          <span className="text-sm font-medium text-gray-800">LinkedIn</span>
        </a>
        <a
          href="https://x.com/freelancemalaysia"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition"
        >
          <FaXTwitter className="w-5 h-5 text-black" />
          <span className="text-sm font-medium text-gray-800">X</span>
        </a>
        <a
          href="https://facebook.com/freelancemalaysia"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-blue-100 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition"
        >
          <FaFacebookF className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-gray-800">Facebook</span>
        </a>
      </div>
    </main>
  );
}
