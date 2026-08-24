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
  { href: "https://facebook.com/freelancemy", label: "Facebook", icon: FaFacebook },
  { href: "https://x.com/freelancemy", label: "X", icon: FaXTwitter },
  { href: "https://linkedin.com/company/freelancemy", label: "LinkedIn", icon: FaLinkedin },
];

const linkClass =
  "text-[16px] text-black hover:text-glitch transition-colors";
const headingClass =
  "text-[14px] font-bold uppercase tracking-wide text-black mb-4";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-hairline mt-12">
      <div className="max-w-300 mx-auto px-5 sm:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <p className="text-[20px] font-bold text-black tracking-tight">
              FreelanceMY
            </p>
            <p className="text-[16px] leading-[1.38] text-black max-w-sm">
              Your resource for freelancing in Malaysia — insights, guides, and
              opportunities for the modern independent professional.
            </p>
            <div className="flex items-center gap-4 pt-1">
              {socials.map(({ href, label, icon: Icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`FreelanceMY on ${label}`}
                  className="text-black hover:text-glitch transition-colors"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <p className={headingClass}>Explore</p>
            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <p className={headingClass}>Resources</p>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className={headingClass}>Legal</p>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-hairline mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[14px] text-black">
            &copy; {new Date().getFullYear()} FreelanceMY. All rights reserved.
          </p>
          <p className="text-[14px] text-black">Built for freelancers in Malaysia.</p>
        </div>
      </div>
    </footer>
  );
}
