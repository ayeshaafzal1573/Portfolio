"use client"

import { useState, useEffect } from "react"
import { ExternalLink, Github, Code, Smartphone, Palette, Globe, Layers } from "lucide-react"
import { useCategorizedProjects } from "@/lib/useConfig"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

const categoryIcons: Record<string, React.ComponentType<any>> = {
  "MERN Stack": Globe,
  "Full-Stack": Code,
  "Mobile Apps": Smartphone,
  "UI/UX Designs": Palette,
  "Web Development": Code,
}

const videoExtensions = [".mp4", ".webm", ".ogg"]

export function FeaturedProjectsCards() {
  const { data: projectsData, loading } = useCategorizedProjects()
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const categories = ["All", "MERN Stack", "Full-Stack", "Mobile Apps", "UI/UX Designs", "Web Development"]
  useScrollReveal()

  const projects = projectsData || []
  const filteredProjects = selectedCategory === "All" ? projects : projects.filter((p) => p.category === selectedCategory)

  const getMediaSource = (project: any) => project.video_url || project.image_url || ""
  const isVideoSource = (source: string) => videoExtensions.some((ext) => source.toLowerCase().includes(ext))

  if (loading) {
    return (
      <section id="projects" className="section-shell">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16"><h2 className="section-title">Featured Projects</h2></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="glass-card rounded-2xl overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-300 dark:bg-gray-700" />
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded" />
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="projects" className="section-shell relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 reveal">
          <div className="inline-flex items-center gap-2 rounded-full chip px-4 py-1.5 text-xs font-bold uppercase tracking-wider mb-4">
            <Layers className="w-4 h-4 text-[color:var(--accent-primary)]" />
            My Portfolio
          </div>
          <h2 className="section-title">Featured Works</h2>
          <p className="section-subtitle text-xl max-w-3xl mx-auto mb-8">
            Explore my work across different categories, from full-stack applications to vocational designs and mobile apps.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button key={category} onClick={() => setSelectedCategory(category)} className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 cursor-pointer ${selectedCategory === category ? "btn-primary shadow-md hover:scale-[1.03]" : "btn-secondary hover:scale-[1.03]"}`}>
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 reveal-scale">
          {filteredProjects.map((project, index) => {
            const IconComponent = categoryIcons[project.category] || Code
            const mediaSource = getMediaSource(project)
            const shouldRenderVideo = isVideoSource(mediaSource)
            return (
              <div key={project.id} className="group glass-card rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-xl relative flex flex-col h-full" style={{ animationDelay: `${index * 0.05}s` }}>
                <div className="relative overflow-hidden h-48 shrink-0">
                  {mediaSource ? (
                    shouldRenderVideo ? (
                      <video src={mediaSource} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" autoPlay muted loop playsInline />
                    ) : (
                      <img src={mediaSource} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    )
                  ) : (
                    <div className="h-full bg-slate-200 dark:bg-slate-800" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                  <div className="absolute top-4 left-4">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-200 border border-slate-200/20 text-xs font-bold shadow-md">
                      <IconComponent className="w-3.5 h-3.5 text-[color:var(--accent-primary)]" />
                      {project.category}
                    </div>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-sora font-extrabold mb-2.5 text-[color:var(--text-primary)] group-hover:text-[color:var(--accent-primary)] transition-colors duration-300">{project.title}</h3>
                  <p className="mb-4 text-sm leading-relaxed line-clamp-3 text-[color:var(--text-secondary)] flex-grow">{project.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {(project.tech_stack || []).map((tech: string) => (
                      <span key={tech} className="chip px-2.5 py-1 text-[10px] font-semibold rounded-full">{tech}</span>
                    ))}
                  </div>
                  <div className="flex gap-3 mt-auto">
                    {project.demo_url && project.demo_url !== "#" && (
                      <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 flex-1 py-2.5 rounded-xl btn-primary text-xs font-bold hover:shadow-md hover:scale-[1.02] transition-all duration-300">
                        <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                      </a>
                    )}
                    {project.github_url && project.github_url !== "#" && (
                      <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 flex-1 py-2.5 rounded-xl btn-secondary text-xs font-bold hover:shadow-md hover:scale-[1.02] transition-all duration-300">
                        <Github className="w-3.5 h-3.5" /> Source Code
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
