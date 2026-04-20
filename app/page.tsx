import Script from "next/script"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { LiveProjectsSlider } from "@/components/live-projects-slider"
import { FeaturedProjectsCards } from "@/components/featured-projects-cards"
import { AboutSection } from "@/components/about-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Script
        id="person-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Ayesha Afzal",
            url: "https://ayeshaafzalqadir.vercel.app",
            jobTitle: "Full Stack Developer",
            sameAs: [
              "https://www.linkedin.com/in/ayeshaafzalqadir/",
              "https://github.com/ayeshaafzal1573/",
              "https://www.behance.net/ayeshaafzal14",
            ],
            worksFor: {
              "@type": "Organization",
              name: "asani.io",
            },
          }),
        }}
      />
      <Analytics />
      <SpeedInsights />
      <Navbar />
      <HeroSection />
      <LiveProjectsSlider />
      <FeaturedProjectsCards />
      <AboutSection />
      <ContactSection />
      <Footer />
      <ScrollToTop />
    </main>
  )
}
