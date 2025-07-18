"use client"

import { useState, useEffect } from "react"
import { ExternalLink, Github } from "lucide-react"
import { supabase, type Project, isSupabaseConfigured } from "@/lib/supabase"

export function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      // Check if Supabase is configured
      if (!isSupabaseConfigured()) {
        console.log("Supabase not configured, using mock data")
        setProjects(getMockProjects())
        return
      }

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("is_featured", true)
        .order("created_at", { ascending: false })

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error("Error fetching projects:", error)
      // Fallback to mock data if Supabase fails
      setProjects(getMockProjects())
    } finally {
      setLoading(false)
    }
  }

  const getMockProjects = (): Project[] => [
    {
      id: "1",
      title: "E-Commerce Platform",
      description: "Full-stack e-commerce solution with real-time inventory management and payment processing.",
      tech_stack: ["Next.js", "Supabase", "Stripe", "Tailwind CSS"],
      demo_url: "#",
      github_url: "#",
      image_url: "/placeholder.svg?height=300&width=400",
      is_featured: true,
      created_at: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Task Management App",
      description: "Collaborative project management tool with real-time updates and team collaboration features.",
      tech_stack: ["React", "Node.js", "MongoDB", "Socket.io"],
      demo_url: "#",
      github_url: "#",
      image_url: "/placeholder.svg?height=300&width=400",
      is_featured: true,
      created_at: new Date().toISOString(),
    },
    {
      id: "3",
      title: "Design System Library",
      description: "Comprehensive design system with React components and automated documentation.",
      tech_stack: ["React", "Storybook", "TypeScript", "Figma"],
      demo_url: "#",
      github_url: "#",
      image_url: "/placeholder.svg?height=300&width=400",
      is_featured: true,
      created_at: new Date().toISOString(),
    },
  ]

  if (loading) {
    return (
      <section id="projects" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-sora font-bold mb-6">Featured Projects</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card rounded-2xl overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-300 dark:bg-gray-700"></div>
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="projects" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-sora font-bold mb-6">Featured Projects</h2>
          <p className="text-xl text-opacity-80 max-w-3xl mx-auto">
            A showcase of full-stack applications and design systems that demonstrate technical expertise and creative
            problem-solving.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="group glass-card rounded-2xl overflow-hidden hover:scale-105 hover:rotate-1 transition-all duration-500"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={project.image_url || "/placeholder.svg?height=300&width=400"}
                  alt={project.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-sora font-bold mb-3">{project.title}</h3>
                <p className="text-opacity-80 mb-4 line-clamp-3">{project.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech_stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-sm rounded-full pastel:bg-purple-100 pastel:text-purple-700 dark:bg-blue-900 dark:text-blue-300 girly-blue:bg-blue-100 girly-blue:text-blue-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex gap-3">
                  {project.demo_url && (
                    <a
                      href={project.demo_url}
                      className="flex items-center gap-2 px-4 py-2 glass-card rounded-lg hover:scale-105 transition-transform"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Demo
                    </a>
                  )}
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      className="flex items-center gap-2 px-4 py-2 glass-card rounded-lg hover:scale-105 transition-transform"
                    >
                      <Github className="w-4 h-4" />
                      Code
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
