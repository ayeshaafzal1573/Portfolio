import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { FeaturedProjectsCards } from "@/components/featured-projects-cards"
import { AboutSection } from "@/components/about-section"
import { WhatIBuild } from "@/components/what-i-build"
import { SelectedWork } from "@/components/selected-work"
import { ExperienceSection } from "@/components/experience-section"
import { TechStackSection } from "@/components/tech-stack-section"
import { ArchitectureSection } from "@/components/architecture-section"
import { ProcessSection } from "@/components/process-section"
import { ProductionSection } from "@/components/production-section"
import { LiveProjectsSlider } from "@/components/live-projects-slider"
import { CurrentlySection } from "@/components/currently-section"
import { EducationSection } from "@/components/education-section"
import { ContactSection } from "@/components/contact-section"
import { HireMeSection } from "@/components/hire-me-section"
import { Footer } from "@/components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"
import { PortfolioChatbot } from "@/components/portfolio-chatbot"
import { ScrollDepth } from "@/components/three/scroll-depth"
import { DeviceShowcase } from "@/components/three/device-showcase"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <ScrollDepth tilt={8} depth={90}>
        <HeroSection />
      </ScrollDepth>
      <DeviceShowcase />
      <ScrollDepth tilt={16} depth={150}>
        <AboutSection />
      </ScrollDepth>
      <ScrollDepth tilt={10} depth={110}>
        <WhatIBuild />
      </ScrollDepth>
      <ScrollDepth mode="pop" amount={52}>
        <SelectedWork />
      </ScrollDepth>
      <ScrollDepth tilt={14} depth={140}>
        <ExperienceSection />
      </ScrollDepth>
      <ScrollDepth tilt={10} depth={120}>
        <TechStackSection />
      </ScrollDepth>
      <ScrollDepth mode="pop" amount={52}>
        <FeaturedProjectsCards />
      </ScrollDepth>
      <ScrollDepth tilt={12} depth={110}>
        <ArchitectureSection />
      </ScrollDepth>
      <ScrollDepth mode="pop" amount={48}>
        <ProcessSection />
      </ScrollDepth>
      <ScrollDepth tilt={12} depth={110}>
        <ProductionSection />
      </ScrollDepth>
      <ScrollDepth mode="pop" amount={40}>
        <LiveProjectsSlider />
      </ScrollDepth>
      <ScrollDepth mode="pop" amount={40}>
        <CurrentlySection />
      </ScrollDepth>
      <ScrollDepth tilt={12} depth={110}>
        <EducationSection />
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