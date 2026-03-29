"use client"

import { Code, Palette, Database, Smartphone, Globe, Zap } from "lucide-react"

const timeline = [
  {
    year: "Present",
    title: "Full-Stack Developer @ Asani.io",
    description:
      "Working as a Full-Stack Developer with a strong focus on backend architecture. Responsibilities include routing and APIs using Fastify, database management with PostgreSQL, implementing unified CI/CD pipelines via Jenkins, and monitoring cloud logs.",
    skills: ["Fastify", "PostgreSQL", "CI/CD", "Jenkins", "Cloud Logs"],
  },
  {
    year: "2025",
    title: "Full-Stack Developer & UI/UX Designer",
    description:
      "Building scalable eCommerce platforms using Next.js, FastAPI, and MongoDB. Focused on luxury jewelry business solutions, integrating admin panels, product management, and user interfaces.",
    skills: ["Next.js", "FastAPI", "MongoDB", "UI/UX Design"],
  },
  {
    year: "2024",
    title: "React Native Developer",
    description:
      "Developed multi-role mobile applications using Expo Router, Supabase, and Zustand for educational and content-based platforms.",
    skills: ["React Native", "Expo Router", "Supabase", "Zustand"],
  },
  {
    year: "2023",
    title: "Full-Stack Developer (MERN Stack)",
    description:
      "Created hotel management and inventory systems using React, Node.js, Express, and MongoDB with custom UI components.",
    skills: ["React", "Node.js", "Express", "MongoDB"],
  },
  {
    year: "2022",
    title: "Frontend Developer & UI/UX Designer",
    description:
      "Designed modern web layouts and interfaces using Figma and Adobe XD while developing frontend projects with React.js and Tailwind CSS.",
    skills: ["React.js", "Tailwind CSS", "Figma", "Adobe XD"],
  },
];

const skills = [
  { icon: Code, name: "Frontend Development", level: 95 },
  { icon: Database, name: "Backend Development", level: 88 },
  { icon: Palette, name: "UI/UX Design", level: 90 },
  { icon: Smartphone, name: "Mobile Development", level: 92 },
  { icon: Globe, name: "eCommerce Systems", level: 90 },
  { icon: Zap, name: "Modern Frameworks", level: 94 },
];

export function AboutSection() {
  return (
    <section id="about" className="section-shell">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-title">About Me</h2>
          <p className="section-subtitle text-xl max-w-3xl mx-auto">
            Full-Stack Developer & UI/UX Designer with 2+ years of experience building modern web and mobile applications. Specialized in scalable eCommerce platforms, admin dashboards, and intuitive user interfaces using MERN, Next.js, React Native, and FastAPI.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h3 className="text-2xl font-sora font-bold mb-8">Professional Journey</h3>
            <div className="space-y-8">
              {timeline.map((item, index) => (
                <div key={item.year} className="relative">
                  <div className="flex items-start gap-6">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full" style={{ background: "var(--accent-primary)" }} />
                      {index < timeline.length - 1 && (
                        <div className="w-0.5 h-16 mt-2" style={{ background: "color-mix(in srgb, var(--accent-primary) 40%, transparent)" }} />
                      )}
                    </div>

                    <div className="glass-card rounded-xl p-6 flex-1 hover:scale-[1.02] transition-transform duration-300">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-bold" style={{ color: "var(--accent-primary)" }}>
                          {item.year}
                        </span>
                      </div>
                      <h4 className="text-lg font-sora font-bold mb-2">{item.title}</h4>
                      <p className="mb-4 text-[color:var(--text-secondary)]">{item.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {item.skills.map((skill) => (
                          <span
                            key={skill}
                            className="chip px-3 py-1 text-xs rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-sora font-bold mb-8">Core Skills</h3>
            <div className="space-y-6">
              {skills.map((skill, index) => (
                <div
                  key={skill.name}
                  className="glass-card rounded-xl p-6 hover:scale-[1.02] transition-transform duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="chip p-3 rounded-lg">
                      <skill.icon className="w-6 h-6" style={{ color: "var(--accent-primary)" }} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-sora font-bold">{skill.name}</h4>
                      <div className="w-full rounded-full h-2 mt-2 bg-slate-300/60 dark:bg-slate-700/70">
                        <div
                          className="h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${skill.level}%`, background: "var(--gradient-main)" }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-bold">{skill.level}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
