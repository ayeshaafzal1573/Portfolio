import type React from "react"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { CustomCursor } from "@/components/custom-cursor"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL("https://ayeshaafzalqadir.vercel.app"),
  title: {
    default: "Ayesha Afzal | Senior Full Stack Software Engineer & MERN Specialist Karachi",
    template: "%s | Ayesha Afzal",
  },
  description:
    "Ayesha Afzal is a premier Full Stack Developer & Software Engineer based in Karachi. Expert in MERN stack, Next.js, React Native, FastAPI, AI automation, and scalable enterprise web & mobile architectures.",
  keywords: [
    "Ayesha Afzal",
    "Ayesha Afzal Qadir",
    "Full Stack Developer Karachi",
    "Software Engineer Karachi",
    "Ayesha Afzal Full Stack Developer",
    "MERN Developer Pakistan",
    "Next.js React Developer",
    "React Native Mobile Developer",
    "FastAPI Python Developer",
    "Aptech Diploma Software Engineering",
    "Virtual University Pakistan Computer Science",
    "Asani.io Software Engineer",
    "Karachi Tech Portfolio",
    "AI Automation Engineer"
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
    icon: "/ayesha-afzal-qadir.jpeg",
    shortcut: "/ayesha-afzal-qadir.jpeg",
    apple: "/ayesha-afzal-qadir.jpeg",
  },
  openGraph: {
    title: "Ayesha Afzal | Full Stack Software Engineer & MERN Specialist",
    description:
      "Explore the portfolio of Ayesha Afzal, a Full Stack Developer & UI/UX Designer building state-of-the-art web and mobile apps with MERN, Next.js, and FastAPI.",
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
    title: "Ayesha Afzal | Full Stack Software Engineer",
    description:
      "Full Stack Developer specializing in MERN, Next.js, React Native, and AI enterprise architectures.",
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
        <ThemeProvider>
          <CustomCursor />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
