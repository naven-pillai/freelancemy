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
  "text-[15px] text-neutral-400 hover:text-white transition-colors";

function Column({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-[12px] font-bold uppercase tracking-widest text-neutral-500 mb-4">
        {title}
      </div>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="w-full bg-black text-white mt-16">
      <div className="max-w-300 mx-auto px-5 sm:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-5 space-y-5">
            <div className="text-2xl font-bold tracking-tight">FreelanceMY</div>
            <div className="text-[15px] leading-relaxed text-neutral-400 max-w-sm">
              Your resource for freelancing in Malaysia — insights, guides, and
              opportunities for the modern independent professional.
            </div>
            <div className="flex items-center gap-3 pt-1">
              {socials.map(({ href, label, icon: Icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`FreelanceMY on ${label}`}
                  className="w-9 h-9 flex items-center justify-center border border-neutral-700 text-neutral-300 hover:text-white hover:border-white transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-1" aria-hidden="true" />

          <div className="md:col-span-2">
            <Column title="Explore">
              {footerLinks.explore.map((l) => (
                <Link key={l.href} href={l.href} className={linkClass}>
                  {l.label}
                </Link>
              ))}
            </Column>
          </div>

          <div className="md:col-span-2">
            <Column title="Resources">
              {footerLinks.resources.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  {l.label}
                </a>
              ))}
            </Column>
          </div>

          <div className="md:col-span-2">
            <Column title="Legal">
              {footerLinks.legal.map((l) => (
                <Link key={l.href} href={l.href} className={linkClass}>
                  {l.label}
                </Link>
              ))}
            </Column>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="text-[13px] text-neutral-500">
            &copy; {new Date().getFullYear()} FreelanceMY. All rights reserved.
          </div>
          <div className="text-[13px] text-neutral-500">
            Built for freelancers in Malaysia.
          </div>
        </div>
      </div>
    </footer>
  );
}
