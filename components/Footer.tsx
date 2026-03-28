import Link from "next/link";
import { FaFacebook, FaLinkedin, FaXTwitter } from "react-icons/fa6";

const footerLinks = {
  explore: [
    { href: "/", label: "Blog" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ],
  legal: [
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/terms-conditions", label: "Terms & Conditions" },
  ],
  resources: [
    { href: "https://kerja-remote.com", label: "Kerja Remote", external: true },
    { href: "https://navenpillai.com", label: "Naven Pillai", external: true },
  ],
};

const socials = [
  {
    href: "https://facebook.com/freelancemy",
    label: "Facebook",
    icon: FaFacebook,
    color: "text-blue-600 border-blue-200 hover:bg-blue-50",
  },
  {
    href: "https://x.com/freelancemy",
    label: "X",
    icon: FaXTwitter,
    color: "text-gray-700 border-gray-200 hover:bg-gray-50",
  },
  {
    href: "https://linkedin.com/company/freelancemy",
    label: "LinkedIn",
    icon: FaLinkedin,
    color: "text-blue-700 border-blue-200 hover:bg-blue-50",
  },
];

export default function Footer() {
  return (
    <footer className="w-full bg-gray-50 border-t border-gray-200 mt-16">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 pt-14 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
          {/* Brand — spans 2 columns on lg */}
          <div className="lg:col-span-2 space-y-4">
            <h5 className="text-lg font-bold text-gray-900 tracking-tight">
              FreelanceMY
            </h5>
            <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
              Your trusted resource for freelancing in Malaysia — insights,
              guides, and opportunities for the modern independent professional.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2 pt-2">
              {socials.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.href}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`FreelanceMY on ${social.label}`}
                    className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-colors ${social.color}`}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h6 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
              Explore
            </h6>
            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h6 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
              Resources
            </h6>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h6 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
              Legal
            </h6>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} FreelanceMY. All rights reserved.
          </p>
          <p className="text-xs text-gray-400">
            Built for freelancers in Malaysia.
          </p>
        </div>
      </div>
    </footer>
  );
}
