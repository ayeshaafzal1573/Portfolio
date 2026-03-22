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
        // Soft Pastel Colors overrides
        purple: {
          50: '#FDFBFF', 100: '#F5F3FF', 200: '#EDE9FE', 300: '#DDD6FE', 400: '#C4B5FD',
          500: '#A78BFA', 600: '#8B5CF6', 700: '#7C3AED', 800: '#6D28D9', 900: '#5B21B6',
        },
        pink: {
          50: '#FFF1F2', 100: '#FFE4E6', 200: '#FECDD3', 300: '#FDA4AF', 400: '#FB7185',
          500: '#F43F5E', 600: '#E11D48', 700: '#BE123C', 800: '#9F1239', 900: '#881337',
        },
        blue: {
          50: '#EFF6FF', 100: '#DBEAFE', 200: '#BFDBFE', 300: '#93C5FD', 400: '#60A5FA',
          500: '#3B82F6', 600: '#2563EB', 700: '#1D4ED8', 800: '#1E40AF', 900: '#1E3A8A',
        },
        yellow: {
          50: '#FEFCE8', 100: '#FEF9C3', 200: '#FEF08A', 300: '#FDE047', 400: '#FACC15',
          500: '#EAB308', 600: '#CA8A04', 700: '#A16207', 800: '#854D0E', 900: '#713F12',
        },
        mint: {
          400: '#98FF98',
          500: '#6EE7B7',
        },
        sky: {
          400: '#87CEEB',
          500: '#38BDF8',
        },
        electric: {
          500: '#00D4FF',
        },
        lime: {
          500: '#A3E635',
        },
        // Legacy customized objects
        pastel: {
          primary: "#FFFFFF",
          secondary: "#F8F9FA",
          text: "#334155",
          lavender: "#E6E6FA",
          mint: "#98FF98",
          blush: "#FFC0CB",
          sky: "#87CEEB",
        },
        dark: {
          primary: "#0F172A",
          secondary: "#1E293B",
          tertiary: "#334155",
          text: "#F8FAFC",
          electric: "#00D4FF",
          purple: "#A78BFA",
          lime: "#A3E635",
        },
        girly: {
          primary: "#FFFFFF",
          secondary: "#FDF2F8",
          text: "#475569",
          blue: "#BFDBFE",
          lightBlue: "#DBEAFE",
          darkBlue: "#3B82F6",
          pink: "#FBCFE8",
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
      backgroundImage: {
        'gradient-main': 'var(--gradient-main)',
      },
    },
  },
  // Ensure tailwindcss-animate is included
  plugins: [require("tailwindcss-animate")],
}

export default config;