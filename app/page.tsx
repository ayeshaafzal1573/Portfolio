import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { LiveProjectsSlider } from "@/components/live-projects-slider"
import { FeaturedProjectsCards } from "@/components/featured-projects-cards"
import { AboutSection } from "@/components/about-section"
import { EducationSection } from "@/components/education-section"
import { ContactSection } from "@/components/contact-section"
import { HireMeSection } from "@/components/hire-me-section"
import { Footer } from "@/components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"
import { PortfolioChatbot } from "@/components/portfolio-chatbot"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <EducationSection />
      <LiveProjectsSlider />
      <FeaturedProjectsCards />
      <HireMeSection />
      <ContactSection />
      <Footer />
      <ScrollToTop />
      <PortfolioChatbot />
    </main>
  )
}
