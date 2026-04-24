"use client"

import { useState, useEffect } from "react"
import { ExternalLink, Github, Code, Smartphone, Palette, Globe } from "lucide-react"
import { type CategorizedProject } from "@/lib/supabase"

const categoryIcons = {
  "MERN Stack": Globe,
  "Full-Stack": Code,
  "Mobile Apps": Smartphone,
  "UI/UX Designs": Palette,
  "Web Development": Code, // add fallback or specific icon here
}


const categoryColors = {
  "MERN Stack": "bg-gradient-main text-slate-800 border-white/40",
  "Full-Stack": "bg-gradient-main text-slate-800 border-white/40",
  "Mobile Apps": "bg-gradient-main text-slate-800 border-white/40",
  "UI/UX Designs": "bg-gradient-main text-slate-800 border-white/40",
  "Web Development": "bg-gradient-main text-slate-800 border-white/40",
}

export function FeaturedProjectsCards() {
  const [projects, setProjects] = useState<CategorizedProject[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>("All")

  const categories = ["All", "MERN Stack", "Full-Stack", "Mobile Apps", "UI/UX Designs"]

  useEffect(() => {
    fetchCategorizedProjects()
  }, [])

  const fetchCategorizedProjects = async () => {
    try {
     
  setProjects(getMockCategorizedProjects())
    
    } catch (error) {
      console.error("Error fetching categorized projects:", error)
    
    } finally {
      setLoading(false)
    }
  }

 const getMockCategorizedProjects = (): CategorizedProject[] => [
  {
    id: "1",
    title: "SMF-Jewels",
    description:
      "Discover the finest collection of handcrafted luxury jewelry. Each piece tells a story of elegance, craftsmanship, and timeless beauty.",
    category: "Full-Stack",
    tech_stack: ["MongoDB", "Express.js", "React", "Node.js"],
    demo_url: "https://smf-jewels.vercel.app/",
    github_url: "#",
    video_url: "/SMFJEWELS.webm",
    is_featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Luxury Stay",
    description:
      "Indulge in comfort, elegance, and world-class service. Your perfect stay begins here!",
    category: "MERN Stack",
    tech_stack: ["MongoDB", "Express.js", "React", "Node.js"],
    demo_url: "https://luxurystay-hms.vercel.app/home",
    github_url: "#",
    video_url: "/LuxuryStay.mp4",
    is_featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Trippy",
    description:
      "A platform that solves all tour related problems being faced by users, tour agencies or individual tour guides comparably!",
    category: "Full-Stack",
    tech_stack: ["Vue JS", "Firebase", "Express", "Node.js"],
    demo_url: "https://trippy-website-two.vercel.app/",
    github_url: "#",
    video_url: "/trippy.mp4",
    is_featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Yummy Pet Palate",
    description:
      "Your go-to e-commerce destination for delectable pet food, catering to your furry friend's taste and health needs.",
    category: "Full-Stack",
    tech_stack: ["PHP", "MYSQL", "Bootstrap", "JQUERY"],
    demo_url: "https://projects.sunaina.codes/ypp/index.php",
    github_url: "#",
    video_url: "/YummyPetPalate.mp4",
    is_featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "5",
    title: "Pandemix",
    description:
      "Your comprehensive online hospital management system for efficient COVID testing. Streamline processes, enhance patient care, and ensure a safer healthcare experience.",
    category: "Full-Stack",
    tech_stack: ["PHP", "MYSQL", "Bootstrap", "JQUERY"],
    demo_url: "https://projects.sunaina.codes/pandemix",
    github_url: "#",
    video_url: "/Pandemix.mp4",
    is_featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "6",
    title: "Institute Of Fine Arts",
    description:
      "Empowering artistic visions through education and innovation at the Institute of Fine Arts. Join our creative community today.",
    category: "Full-Stack",
    tech_stack: ["ASP.NET", "SQL Server", "Bootstrap"],
    demo_url: "#",
    github_url: "#",
    video_url: "/InstituteofFineArts.mp4",
    is_featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "7",
    title: "Gem Elegance",
    description:
      "Explore Gem Elegance, your premier online destination for exquisite men's and women's jewelry. Discover timeless pieces, unparalleled craftsmanship, and unmatched elegance.",
    category: "Full-Stack",
    tech_stack: ["Laravel", "MYSQL", "Bootstrap"],
    demo_url: "https://www.linkedin.com/posts/ayeshaafzalqadir_laravel-ecommerce-webdevelopment-activity-7228390172533415936-DHsi",
    github_url: "#",
    video_url: "/GemElegance.mp4",
    is_featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "8",
    title: "Baby Shop Hub",
    description:
      "Your go-to e-commerce destination for delectable baby food, catering to your baby health needs.",
    category: "Full-Stack",
    tech_stack: ["Flutter", "Laravel", "MYSQL"],
    demo_url: "https://www.linkedin.com/posts/ayeshaafzalqadir_mobileappdevelopment-flutter-laravel-activity-7256033227704811522-JAEG",
    github_url: "#",
    video_url: "/BabyShopHub.mp4",
    is_featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "9",
    title: "Aligarh Institute of Technology",
    description:
      "I’ve developed an ERP app for Aligarh Institute of Technology using React Native.",
    category: "Mobile Apps",
    tech_stack: ["React Native", "Firebase"],
    demo_url: "https://www.linkedin.com/posts/ayeshaafzalqadir_reactnative-edtech-erpdevelopment-activity-7281908979293708288-DF23",
    github_url: "#",
    video_url: "/Aligarh.mp4",
    is_featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "10",
    title: "Taverna",
    description:
      "Taverna—a modern mobile app designed in react native to revolutionize your bar-hopping experience.",
    category: "Mobile Apps",
    tech_stack: ["React Native", "Node.js", "MongoDB"],
    demo_url: "https://www.linkedin.com/posts/ayeshaafzalqadir_mobileappdevelopment-tavernaapp-innovation-activity-7284941587606884352-GpZZ",
    github_url: "#",
    video_url: "/Taverna.mp4",
    is_featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "11",
    title: "The Groove Fest",
    description:
      "Immerse yourself in music with a website that offers songs and tickets for concerts, creating unforgettable experiences.",
    category: "Web Development",
    tech_stack: ["HTML", "CSS", "JavaScript"],
    demo_url: "https://thegroovefest.netlify.app",
    github_url: "#",
    video_url: "/TheGrooveFest.mp4",
    is_featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "12",
    title: "Apptrix Technologies",
    description:
      "It is a Digital Agency Website.",
    category: "Web Development",
    tech_stack: ["HTML", "CSS", "JavaScript"],
    demo_url: "https://apptrixtechnologies.com/",
    github_url: "#",
    video_url: "/Apptrix.mp4",
    is_featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "13",
    title: "Inventory System",
    description:
      "It is a Inventory System designed for PECT Engineering.",
    category: "Web Development",
    tech_stack: ["React", "Node.js", "MongoDB"],
    demo_url: "https://inventory-frontend-livid.vercel.app/",
    github_url: "#",
    video_url: "/Inventory.mp4",
    is_featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "14",
    title: "Plant Palace",
    description:
      "Your online plant emporium for purchasing a diverse range of green companions and botanical delights.",
    category: "Web Development",
    tech_stack: ["HTML", "CSS", "JavaScript"],
    demo_url: "https://plant-palace-techarmy.netlify.app/",
    github_url: "#",
    video_url: "/PlantPalace.mp4",
    is_featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "15",
    title: "Ruya Airline",
    description:
      "A premier airline website, offering exceptional travel services and a world of destinations.",
    category: "Web Development",
    tech_stack: ["HTML", "CSS", "JavaScript"],
    demo_url: "https://ruyaairlines.netlify.app/",
    github_url: "#",
    video_url: "/RuyaAirlines.mp4",
    is_featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "16",
    title: "Wilson Sporting Goods",
    description:
      "Your source for top-notch sports gear, delivering excellence in equipment and accessories for athletes of all levels.",
    category: "Web Development",
    tech_stack: ["HTML", "CSS", "JavaScript"],
    demo_url: "https://wilsonsportinggoods.netlify.app/",
    github_url: "#",
    video_url: "/WilsonSportingGoods.mp4",
    is_featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "17",
    title: "SA Clothing",
    description:
      "Your ultimate online fashion destination, showcasing a trendy collection of clothing for every style and occasion.",
    category: "Web Development",
    tech_stack: ["HTML", "CSS", "JavaScript"],
    demo_url: "https://saclothing.netlify.app/",
    github_url: "#",
    video_url: "/SAClothing.mp4",
    is_featured: true,
    created_at: new Date().toISOString(),
   },
   {
     id: "18",
     title: "KWSC Unified App",
     description:
       "KWSC Unified App lets you access all water-related services in one place.",
     category: "Full-Stack",
     tech_stack: ["Fastify", "PostgreSQL", "Node JS"],
     demo_url: "https://play.google.com/store/apps/details?id=pk.gov.kwsc.kwsc_digital&hl=en",
     github_url: "#",
     video_url: "/kwsc.png",
     is_featured: true,
     created_at: new Date().toISOString(),
   },
   {
     id: "19",
     title: "Asani Dashboard",
     description:
       "Asani Dashboard is a comprehensive web application designed to provide users with real-time insights and analytics for their projects, enabling efficient management and informed decision-making.",
     category: "Full-Stack",
     tech_stack: ["Redis", "PostgreSQL", "Node JS"],
     demo_url: "asani.io",
     github_url: "#",
     video_url: "/asani-dashboard.png",
     is_featured: true,
     created_at: new Date().toISOString(),
   },
   {
     id: "20",
     title: "Asani Website",
     description:
        "Asani Website is a modern web application designed to provide users with a seamless and intuitive experience for managing their projects, tasks, and team collaboration, all while delivering real-time updates and insights.",
     category: "Full-Stack",
     tech_stack: ["Next.js", "Node JS"],
     demo_url: "https://asani-website.vercel.app/",
     github_url: "#",
     video_url: "/web.png",
     is_featured: true,
     created_at: new Date().toISOString(),
   }
];


  const filteredProjects =
    selectedCategory === "All" ? projects : projects.filter((project) => project.category === selectedCategory)

  if (loading) {
    return (
      <section id="projects" className="section-shell">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title">Featured Projects</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
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
    <section id="projects" className="section-shell">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-title">Featured Projects</h2>
          <p className="section-subtitle text-xl max-w-3xl mx-auto mb-8">
            Explore my work across different categories, from full-stack applications to UI/UX design projects.
          </p>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  selectedCategory === category
                    ? "btn-primary shadow-md"
                    : "btn-secondary hover:scale-105"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => {
            const IconComponent = categoryIcons[project.category]
            return (
              <div
                key={project.id}
                className="group glass-card rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:scale-[1.01]"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative overflow-hidden">
                <video
    src={project.video_url}
    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
    autoPlay
    muted
    loop
    playsInline
  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <div
                      className={`flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${categoryColors[project.category] || "bg-gradient-main text-slate-800 border-white/40"} text-sm font-semibold`}
                    >
                      <IconComponent className="w-4 h-4" />
                      {project.category}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-sora font-bold mb-3">{project.title}</h3>
                  <p className="mb-4 line-clamp-3 text-[color:var(--text-secondary)]">{project.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech_stack.map((tech) => (
                      <span
                        key={tech}
                        className="chip px-3 py-1 text-sm rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    {project.demo_url && (
                      <a
                        href={project.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg btn-secondary hover:scale-105 transition-transform"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Demo
                      </a>
                    )}
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg btn-secondary hover:scale-105 transition-transform"
                      >
                        <Github className="w-4 h-4" />
                        Code
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
