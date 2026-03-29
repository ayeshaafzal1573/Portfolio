import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { LiveProjectsSlider } from "@/components/live-projects-slider"
import { FeaturedProjectsCards } from "@/components/featured-projects-cards"
import { AboutSection } from "@/components/about-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"
import { Analytics } from "@vercel/analytics/next"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Analytics />
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
