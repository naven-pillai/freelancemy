"use client";

// Sera UI — Glow Button (adapted). Light-theme palette (the public site is
// light), and made polymorphic so a CTA can render as a Next.js Link.
// https://seraui.com/docs/glow-button
import React from "react";
import Link from "next/link";

type Variant = "blue" | "amber" | "pink";

const variants: Record<
  Variant,
  {
    outerGlow: string;
    blobGlow: string;
    blobHighlight: string;
    blobShadow: string;
    innerGlow: string;
    innerHighlight: string;
    outerBg: string;
    innerBg: string;
    textColor: string;
  }
> = {
  blue: {
    outerGlow: "rgba(37, 99, 235, 0.45)",
    blobGlow: "rgba(37, 99, 235, 0.6)",
    blobHighlight: "#60a5fa",
    blobShadow: "rgba(37, 99, 235, 0.25)",
    innerGlow: "rgba(37, 99, 235, 0.12)",
    innerHighlight: "rgba(147, 197, 253, 0.18)",
    outerBg: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
    innerBg: "linear-gradient(135deg, #ffffff 0%, #eff6ff 100%)",
    textColor: "#1e3a8a",
  },
  amber: {
    outerGlow: "rgba(245, 158, 11, 0.45)",
    blobGlow: "rgba(245, 158, 11, 0.6)",
    blobHighlight: "#fbbf24",
    blobShadow: "rgba(245, 158, 11, 0.25)",
    innerGlow: "rgba(245, 158, 11, 0.12)",
    innerHighlight: "rgba(253, 230, 138, 0.18)",
    outerBg: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
    innerBg: "linear-gradient(135deg, #ffffff 0%, #fffbeb 100%)",
    textColor: "#78350f",
  },
  pink: {
    outerGlow: "rgba(236, 72, 153, 0.45)",
    blobGlow: "rgba(236, 72, 153, 0.6)",
    blobHighlight: "#f472b6",
    blobShadow: "rgba(236, 72, 153, 0.25)",
    innerGlow: "rgba(236, 72, 153, 0.12)",
    innerHighlight: "rgba(251, 207, 232, 0.18)",
    outerBg: "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)",
    innerBg: "linear-gradient(135deg, #ffffff 0%, #fdf2f8 100%)",
    textColor: "#831843",
  },
};

interface GlowButtonProps {
  children: React.ReactNode;
  variant?: Variant;
  href?: string;
  type?: "button" | "submit";
  className?: string;
  "aria-label"?: string;
}

export default function GlowButton({
  children,
  variant = "blue",
  href,
  type = "button",
  className = "",
  "aria-label": ariaLabel,
}: GlowButtonProps) {
  const colors = variants[variant] ?? variants.blue;

  const outerClass = `relative inline-block cursor-pointer rounded-2xl border-none p-0.5 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95 ${className}`;

  const inner = (
    <>
      <span
        className="absolute top-0 right-0 h-[60%] w-[65%] rounded-[120px] -z-10"
        style={{ boxShadow: `0 0 30px ${colors.outerGlow}` }}
      />
      <span
        className="absolute bottom-0 left-0 h-full w-[70px] rounded-2xl"
        style={{
          boxShadow: `-10px 10px 30px ${colors.blobShadow}`,
          background: `radial-gradient(circle 60px at 0% 100%, ${colors.blobHighlight}, ${colors.blobGlow}, transparent)`,
        }}
      />
      <span
        className="relative z-20 flex h-12 items-center justify-center overflow-hidden rounded-[14px] px-8"
        style={{ background: colors.innerBg, color: colors.textColor }}
      >
        <span
          className="absolute top-0 left-0 h-full w-full rounded-[14px]"
          style={{
            background: `radial-gradient(circle 60px at 0% 100%, ${colors.innerHighlight}, ${colors.innerGlow}, transparent)`,
          }}
        />
        <span className="relative z-10 whitespace-nowrap text-base font-semibold">
          {children}
        </span>
      </span>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        aria-label={ariaLabel}
        className={outerClass}
        style={{ background: colors.outerBg }}
      >
        {inner}
      </Link>
    );
  }

  return (
    <button
      type={type}
      aria-label={ariaLabel}
      className={outerClass}
      style={{ background: colors.outerBg }}
    >
      {inner}
    </button>
  );
}
