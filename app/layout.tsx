import type React from "react"
import type { Metadata } from "next"
import { Inter, Sora } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
})

export const metadata: Metadata = {
  title: "Ayesha Afzal - Full-Stack Developer | React Native | UI/UX Designer | MERN Stack Expert", // More detailed and keyword-rich
  description:
    "Ayesha Afzal is a highly skilled Full-Stack Developer & Mobile Application Developer with 2+ years of experience. Specializing in MERN Stack, React Native, Next.js, and delivering exceptional UI/UX design for scalable web and mobile applications. View my portfolio for innovative projects and solutions.",
  generator: "Next.js, React, Node.js",
  keywords: [
    "Ayesha Afzal",
    "Full-Stack Developer",
    "Mobile Application Developer", // Added for clarity
    "React Native Developer", // More specific
    "MERN Stack Developer", // More specific
    "React.js Developer",
    "Node.js Developer",
    "Express.js Developer",
    "MongoDB Developer",
    "Next.js Developer", // Crucial since the site uses it
    "UI/UX Designer",
    "Frontend Developer",
    "Backend Developer",
    "Web Developer",
    "App Developer",
    "Software Developer Portfolio", // Broader term
    "Custom Web Development",
    "Scalable Applications",
    "Portfolio Ayesha Afzal", 
  ],
  authors: [{ name: "Ayesha Afzal", url: "https://ayeshaafzalqadir.netlify.app/" }],
  creator: "Ayesha Afzal",
  icons: {
    icon: "/AyeshaAfzal.jpeg",
    shortcut: "/AyeshaAfzal.jpeg",
    apple: "/AyeshaAfzal.jpeg",
  },
  openGraph: {
    title: "Ayesha Afzal - Full-Stack & Mobile Developer Portfolio",
    description:
      "Explore the portfolio of Ayesha Afzal – expert in MERN Stack, React Native, Next.js, and UI/UX design. Delivering innovative and scalable web & mobile solutions.", 
    url: "https://ayeshaafzalqadir.netlify.app/",
    siteName: "Ayesha Afzal Portfolio",
    images: [
      {
        url: "https://ayeshaafzalqadir.netlify.app/AyeshaAfzal.jpeg", 
        width: 1200,
        height: 630,
        alt: "Ayesha Afzal - Full-Stack Developer & Mobile Application Developer Portfolio", // More descriptive alt text
      },
    ],
    type: "website",
  },
  twitter: {
    card: "/AyeshaAfzal.jpeg",
    site: "@ayeshaafzal1573" || "", // Replace with your actual Twitter handle if you have one
    creator: "@ayeshaafzal1573" || "", // Replace with your actual Twitter handle
    title: "Ayesha Afzal - Full-Stack & Mobile Developer Portfolio",
    description: "Explore the portfolio of Ayesha Afzal – expert in MERN Stack, React Native, Next.js, and UI/UX design. Delivering innovative and scalable web & mobile solutions.",
    images: ["https://ayeshaafzalqadir.netlify.app/AyeshaAfzal.jpeg"],
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${sora.variable} font-inter antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
