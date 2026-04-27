import type React from "react"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL("https://ayeshaafzalqadir.vercel.app"),
  title: {
    default: "Ayesha Afzal | Full Stack Developer Karachi",
    template: "%s | Ayesha Afzal",
  },
  description:
    "Ayesha Afzal is a Full Stack Developer specializing in MERN, Next.js, React Native, FastAPI, and AI-powered applications.",
  keywords: [
    "Ayesha Afzal",
    "Full Stack Developer Karachi",
    "Ayesha Afzal Full Stack Developer",
    "MERN Developer Pakistan",
    "Next.js Developer",
    "React Native Developer",
    "FastAPI Developer",
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
    icon: "/AyeshaAfzal.jpeg",
    shortcut: "/AyeshaAfzal.jpeg",
    apple: "/AyeshaAfzal.jpeg",
  },
  openGraph: {
    title: "Ayesha Afzal | Full Stack Developer",
    description:
      "Portfolio of Ayesha Afzal, Full Stack Developer building scalable web and mobile apps.",
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
    title: "Ayesha Afzal | Full Stack Developer",
    description:
      "Full Stack Developer specializing in MERN, Next.js, React Native, and AI apps.",
    images: ["/og.png"],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-inter antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
