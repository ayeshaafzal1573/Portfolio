import type React from "react"
import type { Metadata } from "next"
import { Inter, Sora } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Script from "next/script"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://ayeshaafzalqadir.vercel.app/"),
  title: "Ayesha Afzal - Full-Stack Developer | React Native | UI/UX Designer | MERN Stack Expert",
  description:
    "Ayesha Afzal is a highly skilled Full-Stack Developer & Mobile Application Developer with 2+ years of experience. Specializing in MERN Stack, React Native, Next.js, Fastify, PostgreSQL, and delivering exceptional UI/UX design for scalable web and mobile applications.",
  generator: "Next.js, React, Node.js",
  keywords: [
    "Ayesha Afzal",
    "Full-Stack Developer",
    "Mobile Application Developer",
    "React Native Developer",
    "MERN Stack Developer",
    "Backend Developer Asani",
    "Next.js Developer",
    "Fastify Developer",
    "PostgreSQL Developer",
    "Software Engineer Pakistan",
    "UI/UX Designer",
    "Frontend Developer",
    "Backend Developer",
    "Web Developer",
    "Software Developer Portfolio",
    "Top Freelance Full Stack Developer",
    "Scalable Applications",
    "Portfolio Ayesha Afzal", 
  ],
  authors: [{ name: "Ayesha Afzal", url: "https://ayeshaafzalqadir.vercel.app/" }],
  creator: "Ayesha Afzal",
  alternates: { canonical: '/' },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // PASTE YOUR GOOGLE SEARCH CONSOLE HTML TAG CONTENT HERE
    google: "PASTE_YOUR_GOOGLE_VERIFICATION_CODE_HERE",
  },
  icons: {
    icon: "/AyeshaAfzal.jpeg",
    shortcut: "/AyeshaAfzal.jpeg",
    apple: "/AyeshaAfzal.jpeg",
  },
  openGraph: {
    title: "Ayesha Afzal - Full-Stack & Mobile Developer Portfolio",
    description:
      "Explore the portfolio of Ayesha Afzal – expert in MERN Stack, React Native, Next.js, Fastify, and UI/UX design. Delivering innovative and scalable web & mobile solutions.", 
    url: "https://ayeshaafzalqadir.vercel.app/",
    siteName: "Ayesha Afzal Portfolio",
    images: [
      {
        url: "https://ayeshaafzalqadir.vercel.app/AyeshaAfzal.jpeg", 
        width: 1200,
        height: 630,
        alt: "Ayesha Afzal - Full-Stack Developer & Mobile Application Developer Portfolio",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@ayeshaafzal1573",
    creator: "@ayeshaafzal1573",
    title: "Ayesha Afzal - Full-Stack & Mobile Developer Portfolio",
    description: "Explore the portfolio of Ayesha Afzal – expert in MERN Stack, React Native, Next.js, and UI/UX design.",
    images: ["https://ayeshaafzalqadir.vercel.app/AyeshaAfzal.jpeg"],
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          id="person-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Ayesha Afzal",
              jobTitle: "Full-Stack & Mobile App Developer",
              url: "https://ayeshaafzalqadir.netlify.app",
              image: "https://ayeshaafzalqadir.vercel.app/ayesha-afzal-qadir.jpg",
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} ${sora.variable} font-inter antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
