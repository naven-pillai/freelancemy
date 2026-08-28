"use client";

// Sera UI — Aurora Text (adapted). Animated gradient text; keyframes live in
// globals.css as `.animate-aurora`. https://seraui.com/docs/aurora
import React, { memo } from "react";

interface AuroraTextProps {
  children: React.ReactNode;
  className?: string;
  colors?: string[];
  speed?: number;
}

export const AuroraText = memo(function AuroraText({
  children,
  className = "",
  colors = ["#2563eb", "#7928CA", "#0070F3", "#f59e0b"],
  speed = 1,
}: AuroraTextProps) {
  const gradientStyle: React.CSSProperties = {
    backgroundImage: `linear-gradient(135deg, ${colors.join(", ")}, ${colors[0]})`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    animationDuration: `${10 / speed}s`,
  };

  return (
    <span className={`relative inline-block ${className}`}>
      <span className="sr-only">{children}</span>
      <span
        className="relative animate-aurora bg-[length:200%_auto] bg-clip-text text-transparent"
        style={gradientStyle}
        aria-hidden="true"
      >
        {children}
      </span>
    </span>
  );
});
