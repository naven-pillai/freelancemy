import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  // 👇 Force Light Mode (darkMode disabled)
  darkMode: false,

  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{md,mdx}",
  ],

  theme: {
    extend: {
      fontFamily: {
        sans: ["Rubik", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        light: {
          background: "#ffffff",
          surface: "#f9fafb",
          text: "#111827",
          primary: "#2563eb", // Tailwind blue-600
          secondary: "#9333ea", // purple-600
        },
        // 👇 shadcn tokens (safe to add, won't override your globals)
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
            color: "#111827",
            a: {
              color: "#2563eb",
              "&:hover": { color: "#ea580c" }, // orange hover
              fontWeight: "600",
              textDecoration: "none",
            },
            h1: { color: "#111827", fontWeight: "700" },
            h2: { color: "#111827", fontWeight: "700" },
            h3: { color: "#111827", fontWeight: "600" },
            strong: { color: "#111827" },
            code: { color: "#db2777" }, // pink
          },
        },
      },
    },
  },

  plugins: [require("@tailwindcss/typography")],
};

export default config;
