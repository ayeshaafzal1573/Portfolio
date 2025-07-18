"use client"

import { useState, useEffect, useRef } from "react"
import { ExternalLink, ChevronLeft, ChevronRight } from "lucide-react"
import { supabase, type LiveProject, isSupabaseConfigured } from "@/lib/supabase"

export function LiveProjectsSlider() {
  const [projects, setProjects] = useState<LiveProject[]>([])
  const [loading, setLoading] = useState(true)
  const sliderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchLiveProjects()
  }, [])

  const fetchLiveProjects = async () => {
    try {
      if (!isSupabaseConfigured()) {
        console.log("Supabase not configured, using mock data")
        setProjects(getMockLiveProjects())
        return
      }

      const { data, error } = await supabase.from("live_projects").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error("Error fetching live projects:", error)
      setProjects(getMockLiveProjects())
    } finally {
      setLoading(false)
    }
  }

  const getMockLiveProjects = (): LiveProject[] => [
    {
      id: "1",
      name: "SMF Jewels",
      thumbnail_url: "/1.png?height=200&width=300",
      live_url: "https://smf-jewels.vercel.app/",
      created_at: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Hotel Management System",
      thumbnail_url: "/2.png?height=200&width=300",
      live_url: "https://luxurystay-hms.vercel.app/",
      created_at: new Date().toISOString(),
    },
    {
      id: "3",
      name: "Trippy",
      thumbnail_url: "/3.png?height=200&width=300",
      live_url: "https://trippy.pk/",
      created_at: new Date().toISOString(),
    },
    {
      id: "4",
      name: "Plant Palace",
      thumbnail_url: "/4.png?height=200&width=300",
      live_url: "https://plant-palace-techarmy.netlify.app/",
      created_at: new Date().toISOString(),
    },
    {
      id: "5",
      name: "Pandemix",
      thumbnail_url: "/5.png?height=200&width=300",
      live_url: "https://projects.sunaina.codes/pandemix/index.php",
      created_at: new Date().toISOString(),
    },
  ]

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const scrollAmount = 320
      sliderRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  if (loading) {
    return (
      <section id="live-projects" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-sora font-bold mb-6">Live Projects</h2>
          </div>
          <div className="flex gap-6 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-shrink-0 w-80 glass-card rounded-2xl overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-300 dark:bg-gray-700"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="live-projects" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-sora font-bold mb-6">Live Projects</h2>
          <p className="text-xl text-opacity-80 max-w-2xl mx-auto">
            Explore my latest live applications and websites currently running in production.
          </p>
        </div>

        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 glass-card rounded-full hover:scale-110 transition-all duration-300"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 glass-card rounded-full hover:scale-110 transition-all duration-300"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Slider */}
          <div
            ref={sliderRef}
            className="flex gap-6 overflow-x-auto hide-scrollbar px-12 py-4"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {projects.map((project, index) => (
              <div
                key={project.id}
                className="flex-shrink-0 w-80 glass-card rounded-2xl overflow-hidden hover:scale-105 transition-all duration-500 group"
                style={{ scrollSnapAlign: "start", animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={project.thumbnail_url || "/placeholder.svg"}
                    alt={project.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-sora font-bold mb-4">{project.name}</h3>
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 pastel:bg-gradient-to-r pastel:from-purple-500 pastel:to-pink-500 dark:bg-gradient-to-r dark:from-blue-500 dark:to-purple-500 girly-blue:bg-gradient-to-r girly-blue:from-blue-500 girly-blue:to-indigo-500 text-white rounded-full font-semibold hover:scale-105 transition-all duration-300"
                  >
                    View Live
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
