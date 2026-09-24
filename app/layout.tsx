import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { IdleMonitor } from "@/components/idle-monitor"
import { ThemeProvider } from "@/components/theme-provider"
import {
  DEFAULT_CONFIG,
  buildThemeVars,
  normalizeConfig,
  type ThemeConfig,
} from "@/lib/theme"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

const SITE_URL = "https://ayeshaafzalqadir.vercel.app"
const PORTRAIT_URL = `${SITE_URL}/ayesha-afzal-qadir.png`

async function loadThemeConfig(): Promise<ThemeConfig> {
  try {
    const { getSupabase } = await import("@/lib/supabase")
    const supabase = getSupabase()
    const { data } = await supabase
      .from("theme_settings")
      .select("theme")
      .eq("id", "00000000-0000-0000-0000-000000000001")
      .maybeSingle()
    return normalizeConfig(data?.theme)
  } catch {
    return DEFAULT_CONFIG
  }
}

async function loadSocialProfiles(): Promise<string[]> {
  try {
    const { getSupabase } = await import("@/lib/supabase")
    const supabase = getSupabase()
    const { data } = await supabase
      .from("social_links")
      .select("url")
      .not("url", "eq", "#")
      .not("url", "is", null)
      .limit(12)
    return (data || [])
      .map((row: { url: string }) => row.url)
      .filter((u) => /^https?:\/\//.test(u))
  } catch {
    return []
  }
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Ayesha Afzal | Full-Stack Web & Mobile Engineer",
    template: "%s | Ayesha Afzal",
  },
  description:
    "Portfolio of Ayesha Afzal — a full-stack web & mobile engineer in Karachi building production web apps, mobile apps, real-time and IoT systems with Next.js, React Native, Node.js, FastAPI and PostgreSQL.",
  applicationName: "Ayesha Afzal Portfolio",
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
  authors: [{ name: "Ayesha Afzal", url: SITE_URL }],
  creator: "Ayesha Afzal",
  alternates: {
    canonical: SITE_URL,
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
    url: SITE_URL,
    siteName: "Ayesha Afzal Portfolio",
    images: [
      {
        url: PORTRAIT_URL,
        width: 420,
        height: 560,
        alt: "Ayesha Afzal — Full-Stack Web & Mobile Engineer",
        type: "image/png",
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
    images: [{ url: PORTRAIT_URL, alt: "Ayesha Afzal — Full-Stack Web & Mobile Engineer" }],
  },
}

function buildJsonLd(sameAs: string[]) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        name: "Ayesha Afzal",
        jobTitle: "Full-Stack Web & Mobile Engineer",
        description:
          "Full-stack web & mobile software engineer from Karachi building production web apps, mobile apps, real-time and IoT systems with Next.js, React Native, Node.js, FastAPI and PostgreSQL.",
        url: SITE_URL,
        image: PORTRAIT_URL,
        email: "mailto:ayeshaafzal1573@gmail.com",
        address: { "@type": "PostalAddress", addressLocality: "Karachi", addressCountry: "PK" },
        sameAs: sameAs,
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
        url: SITE_URL,
      },
    ],
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [config, socialProfiles] = await Promise.all([loadThemeConfig(), loadSocialProfiles()])
  const themeVars = buildThemeVars(config.modes[config.default])
  const themeBootScript = `(function(){try{var root=document.documentElement;root.setAttribute("data-theme",${JSON.stringify(config.default)});var vars=${JSON.stringify(themeVars)};for(var k in vars){root.style.setProperty(k,vars[k]);}}catch(e){}})();`

  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="font-inter antialiased">
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(socialProfiles)) }}
        />
        <ThemeProvider config={config}>
          <IdleMonitor />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
