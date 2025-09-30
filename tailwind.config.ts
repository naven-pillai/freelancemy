import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  // 👇 Force Light Mode (no dark mode support)
  darkMode: false,

  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{md,mdx}",
  ],

  theme: {
    extend: {
      // ✅ Flip fonts
      fontFamily: {
        sans: ["Rubik", ...defaultTheme.fontFamily.sans], // base text
        heading: ["Inter", ...defaultTheme.fontFamily.sans], // headings
        mono: ["JetBrains Mono", ...defaultTheme.fontFamily.mono],
      },
      colors: {
        light: {
          background: "#ffffff",
          surface: "#f9fafb",
          text: "#111827",
          primary: "#2563eb",
          secondary: "#9333ea",
        },
        // 👇 shadcn tokens
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      typography: {
        DEFAULT: {
          css: {
            fontFamily: "Rubik, sans-serif",
            color: "#111827",
            a: {
              color: "#2563eb",
              "&:hover": { color: "#ea580c" },
              fontWeight: "600",
              textDecoration: "none",
            },
            // ✅ Inter for headings
            h1: {
              fontFamily: "Inter, sans-serif",
              color: "#111827",
              fontWeight: "700",
              letterSpacing: "-0.5px",
            },
            h2: {
              fontFamily: "Inter, sans-serif",
              color: "#111827",
              fontWeight: "700",
              letterSpacing: "-0.25px",
            },
            h3: {
              fontFamily: "Inter, sans-serif",
              color: "#111827",
              fontWeight: "600",
            },
            strong: { color: "#111827" },
            code: {
              fontFamily: "JetBrains Mono, monospace",
              color: "#db2777",
              backgroundColor: "#f3f4f6",
              padding: "0.15rem 0.35rem",
              borderRadius: "4px",
            },
            pre: {
              fontFamily: "JetBrains Mono, monospace",
              backgroundColor: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "1rem",
              fontSize: "0.9rem",
              lineHeight: "1.6",
            },
            blockquote: {
              borderLeft: "4px solid #051129",
              color: "#6b7280",
              fontStyle: "italic",
              paddingLeft: "1rem",
            },
          },
        },
      },
    },
  },

  plugins: [require("@tailwindcss/typography")],
};

export default config;
