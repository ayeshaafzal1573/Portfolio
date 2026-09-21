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
import { ScrollDepth } from "@/components/three/scroll-depth"
import { DeviceIntro } from "@/components/three/device-intro"
import { DeviceShowcase } from "@/components/three/device-showcase"

export default function Home() {
  return (
    <main className="min-h-screen">
      <DeviceIntro />
      <Navbar />
      <ScrollDepth tilt={8} depth={90}>
        <HeroSection />
      </ScrollDepth>
      <DeviceShowcase />
      <ScrollDepth tilt={16} depth={150}>
        <AboutSection />
      </ScrollDepth>
      <ScrollDepth tilt={14} depth={140}>
        <EducationSection />
      </ScrollDepth>
      <ScrollDepth mode="pop" amount={52}>
        <LiveProjectsSlider />
      </ScrollDepth>
      <ScrollDepth mode="pop" amount={52}>
        <FeaturedProjectsCards />
      </ScrollDepth>
      <ScrollDepth tilt={14} depth={130}>
        <HireMeSection />
      </ScrollDepth>
      <ScrollDepth tilt={12} depth={110}>
        <ContactSection />
      </ScrollDepth>
      <ScrollDepth tilt={8} depth={80}>
        <Footer />
      </ScrollDepth>
      <ScrollToTop />
      <PortfolioChatbot />
    </main>
  )
}
