import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { IdleMonitor } from "@/components/idle-monitor"
import { ThreeBackgroundLazy } from "@/components/three/three-background-lazy"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  metadataBase: new URL("https://ayeshaafzalqadir.vercel.app"),
  title: {
    default: "Ayesha Afzal | Full-Stack Web & Mobile Engineer",
    template: "%s | Ayesha Afzal",
  },
  description:
    "Portfolio of Ayesha Afzal — a full-stack web & mobile engineer in Karachi building production web apps, mobile apps, real-time and IoT systems with Next.js, React Native, Node.js, FastAPI and PostgreSQL.",
  keywords: [
    "Ayesha Afzal",
    "Ayesha Afzal Qadir",
    "Full Stack Developer Karachi",
    "Software Engineer Karachi",
    "React Native Developer",
    "Next.js Developer",
    "FastAPI Python Developer",
    "Full-Stack Portfolio",
    "Asani.io Software Engineer",
    "Karachi Tech Portfolio",
    "Web & Mobile Engineer",
  ],
  authors: [{ name: "Ayesha Afzal", url: "https://ayeshaafzalqadir.vercel.app" }],
  creator: "Ayesha Afzal",
  alternates: {
    canonical: "https://ayeshaafzalqadir.vercel.app",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "SgBG-tA1lcg8f1-cJF3YenkDx2VBZv9evORLnIVyN2U",
  },
  icons: {
    icon: "/ayesha-afzal-qadir.png",
    shortcut: "/ayesha-afzal-qadir.png",
    apple: "/ayesha-afzal-qadir.png",
  },
  openGraph: {
    title: "Ayesha Afzal | Full-Stack Web & Mobile Engineer",
    description:
      "Full-stack engineer building production web apps, mobile apps, real-time and IoT systems with Next.js, React Native, Node.js, FastAPI and PostgreSQL.",
    url: "https://ayeshaafzalqadir.vercel.app",
    siteName: "Ayesha Afzal Portfolio",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_PK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ayesha Afzal | Full-Stack Web & Mobile Engineer",
    description:
      "Production web apps, mobile apps, real-time & IoT systems — Next.js, React Native, Node.js, FastAPI, PostgreSQL.",
    images: ["/og.png"],
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      name: "Ayesha Afzal",
      jobTitle: "Full-Stack Web & Mobile Engineer",
      url: "https://ayeshaafzalqadir.vercel.app",
      image: "/og.png",
      email: "mailto:ayeshaafzal1573@gmail.com",
      address: { "@type": "PostalAddress", addressLocality: "Karachi", addressCountry: "PK" },
      knowsAbout: [
        "Next.js",
        "React",
        "React Native",
        "Node.js",
        "FastAPI",
        "PostgreSQL",
        "IoT",
        "Real-time systems",
      ],
    },
    {
      "@type": "WebSite",
      name: "Ayesha Afzal Portfolio",
      url: "https://ayeshaafzalqadir.vercel.app",
    },
  ],
} as const

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="font-inter antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider>
          <IdleMonitor />
          <ThreeBackgroundLazy />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
