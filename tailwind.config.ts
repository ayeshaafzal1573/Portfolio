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
        // Soft Minimalist Standard Colors overrides
        purple: {
          50: '#FDFCFB', 100: '#F7F4F2', 200: '#EAE1DC', 300: '#DCCBBE', 400: '#CDB1A1',
          500: '#B89080', 600: '#A47D6D', 700: '#906B5B', 800: '#7C5B4D', 900: '#694E42',
        },
        pink: {
          50: '#FDFBFB', 100: '#F9F4F5', 200: '#EFE3E5', 300: '#E3C9CE', 400: '#D5AAB2',
          500: '#C78C97', 600: '#B87280', 700: '#A55F6D', 800: '#8A515C', 900: '#70444E',
        },
        blue: {
          50: '#FCFDFD', 100: '#F6F8F9', 200: '#E8EDF1', 300: '#D6DFE6', 400: '#BFCDDB',
          500: '#A5B9CB', 600: '#8BA4BB', 700: '#758FA7', 800: '#627A91', 900: '#52667A',
        },
        indigo: {
          50: '#FEFDFB', 100: '#FDF9F3', 200: '#F8EFE2', 300: '#F1E0C9', 400: '#E8CDAB',
          500: '#DFBA8D', 600: '#D1A36B', 700: '#BC8A51', 800: '#A27341', 900: '#865F36',
        },
        mint: {
          400: '#EAE1DC',
          500: '#DCCBBE',
        },
        sky: {
          400: '#E8CDAB',
          500: '#DFBA8D',
        },
        electric: {
          500: '#D5AAB2',
        },
        lime: {
          500: '#A5B9CB',
        },
        // Legacy customized objects
        pastel: {
          primary: "#FAF9F6",
          secondary: "#F2EFE9",
          text: "#2C2C2C",
          lavender: "#EAE1DC",
          mint: "#EFE3E5",
          blush: "#DCCBBE",
          sky: "#D6DFE6",
        },
        dark: {
          primary: "#1C1A1A",
          secondary: "#262322",
          tertiary: "#302C2C",
          text: "#EBE5E0",
          electric: "#D5AAB2",
          purple: "#B89080",
          lime: "#A5B9CB",
        },
        girly: {
          primary: "#FFFFFF",
          secondary: "#F8F6F4",
          text: "#333130",
          blue: "#CDB1A1",
          lightBlue: "#E8CDAB",
          darkBlue: "#DFBA8D",
          pink: "#E3C9CE",
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