import type { Config } from "tailwindcss"

const config: Config = {
  // Add shadcn's darkMode and content paths here
  darkMode: ["class"], // Ensure this is present for shadcn's dark mode handling
  content: [
    // Existing paths for your project files
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    // Add shadcn's component path. It's often './src/**/*.{ts,tsx}' or similar.
    // Confirm where your shadcn components are installed relative to your root.
    "./src/**/*.{ts,tsx}", // Common path for shadcn components
    // If your components are directly in `components/ui`, you might already have it.
    // The "*.{js,ts,jsx,tsx,mdx}" in your original content array is quite broad
    // and might capture things you don't intend, consider being more specific.
  ],
  theme: {
    container: { // Shadcn UI typically adds this container configuration
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // Your custom font families
      fontFamily: {
        inter: ["var(--font-inter)", "sans-serif"],
        sora: ["var(--font-sora)", "sans-serif"],
      },
      // Your custom color palettes
      colors: {
        // Shadcn UI base colors (from CSS variables in globals.css)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Your custom pastel colors
        pastel: {
          primary: "#F8F8F8",
          secondary: "#E0E0E0",
          text: "#333333",
          lavender: "#E6E6FA",
          mint: "#98FF98",
          blush: "#FFC0CB",
          sky: "#87CEEB",
        },
        // Your custom dark theme colors
        dark: {
          primary: "#1A1A1A",
          secondary: "#0D0D0D",
          tertiary: "#2C2C2C",
          text: "#FFFFFF",
          electric: "#00D4FF",
          purple: "#8B5CF6",
          lime: "#84CC16",
        },
        // Your custom girly theme colors
        girly: {
          primary: "#FFFFFF",
          secondary: "#F8F9FA",
          text: "#2C3E50",
          blue: "#8AAAE5",
          lightBlue: "#B0C4DE",
          darkBlue: "#6A80B8",
          pink: "#F8BBD9",
        },
      },
      // Shadcn UI border radius variables
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      // Your custom animations and keyframes
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out", // From shadcn
        "accordion-up": "accordion-up 0.2s ease-out",     // From shadcn
        float: "float 6s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        "accordion-down": { // From shadcn
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {   // From shadcn
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        glow: {
          from: { boxShadow: "0 0 20px var(--accent-blue)" }, // Ensure --accent-blue is defined in your CSS vars
          to: { boxShadow: "0 0 30px var(--accent-blue), 0 0 40px var(--accent-blue)" },
        },
      },
    },
  },
  // Ensure tailwindcss-animate is included
  plugins: [require("tailwindcss-animate")],
}

export default config;