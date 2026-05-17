"use client"

import { GraduationCap, Calendar, Award, BookOpen, MapPin } from "lucide-react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

export function EducationSection() {
  useScrollReveal()

  const educationList = [
    {
      degree: "Bachelors in Computer Science",
      institution: "Virtual University of Pakistan",
      duration: "2026 - Present",
      grade: "Pursuing",
      description: "Focusing on advanced algorithms, software engineering principles, database management systems, and discrete mathematics.",
      icon: GraduationCap,
      color: "var(--accent-primary)",
      badges: ["Computer Science", "Software Architecture", "AI Foundations"]
    },
    {
      degree: "Diploma in Software Engineering",
      institution: "Aptech Computer Education",
      duration: "2022 - 2025",
      grade: "A+ Grade",
      description: "Rigorous curriculum encompassing full-stack web architectures, enterprise application design, API development, and object-oriented programming.",
      icon: Award,
      color: "var(--accent-secondary)",
      badges: ["MERN Stack", "C# .NET", "SQL Server", "Web APIs"]
    },
    {
      degree: "Intermediate",
      institution: "Technical Board (Through Aptech)",
      duration: "2022 - 2024",
      grade: "Completed",
      description: "Acquired critical foundations in computer sciences, mathematics, and logic through specialized vocational board tracks.",
      icon: BookOpen,
      color: "var(--accent-primary)",
      badges: ["Technical Sciences", "Applied Mathematics"]
    },
    {
      degree: "Matriculation (Computer Science)",
      institution: "The Educators School",
      duration: "2008 - 2022",
      grade: "Grade A",
      description: "Primary and secondary education laying down core foundations in science, physics, mathematics, and introduction to computer programming.",
      icon: MapPin,
      color: "var(--accent-secondary)",
      badges: ["General Science", "Elementary Programming"]
    }
  ]

  return (
    <section id="education" className="section-shell relative overflow-hidden bg-gradient-to-b from-transparent to-[color-mix(in_srgb,var(--bg-secondary)_40%,transparent)]">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 h-72 rounded-full bg-[color-mix(in_srgb,var(--accent-primary)_15%,transparent)] blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-80 h-80 rounded-full bg-[color-mix(in_srgb,var(--accent-secondary)_15%,transparent)] blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12 reveal">
          <div className="inline-flex items-center gap-2 rounded-full chip px-4 py-1.5 text-xs font-bold uppercase tracking-wider mb-4">
            <GraduationCap className="w-4 h-4 text-[color:var(--accent-primary)]" />
            Academic Path
          </div>
          <h2 className="section-title">Education & Credentials</h2>
          <p className="section-subtitle text-xl max-w-2xl mx-auto">
            A comprehensive overview of my academic background and professional technical certifications.
          </p>
        </div>

        <div className="relative border-l-2 border-slate-300/40 dark:border-slate-700/60 ml-4 md:ml-32 pl-8 md:pl-12 space-y-12">
          {educationList.map((edu, index) => {
            const IconComponent = edu.icon
            return (
              <div 
                key={index} 
                className={`relative reveal ${index % 2 === 0 ? 'reveal-left' : 'reveal-right'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Timeline node */}
                <div 
                  className="absolute -left-[50px] md:-left-[66px] top-1.5 w-10 h-10 rounded-full flex items-center justify-center border-4 border-[color:var(--bg-primary)] shadow-md transition-transform duration-300 hover:scale-110"
                  style={{ background: edu.color }}
                >
                  <IconComponent className="w-5 h-5 text-white" />
                </div>

                {/* Left Year Badge (Desktop only) */}
                <div className="absolute -left-[190px] top-3 hidden md:flex flex-col items-end w-32">
                  <div className="flex items-center gap-1.5 text-sm font-bold tracking-wider" style={{ color: edu.color }}>
                    <Calendar className="w-4 h-4" />
                    <span>{edu.duration}</span>
                  </div>
                  <span className="text-xs text-[color:var(--text-secondary)] font-medium mt-1">
                    {edu.grade}
                  </span>
                </div>

                {/* Glassmorphic Content Card */}
                <div className="glass-card rounded-2xl p-6 md:p-8 hover:scale-[1.01] transition-all duration-300 group shadow-lg hover:shadow-xl relative overflow-hidden">
                  {/* Subtle top border color */}
                  <div 
                    className="absolute top-0 left-0 right-0 h-1" 
                    style={{ background: `linear-gradient(90deg, ${edu.color}, transparent)` }}
                  />

                  {/* Year & Grade (Mobile view only) */}
                  <div className="flex md:hidden items-center justify-between gap-2 mb-4 flex-wrap">
                    <div className="flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full chip">
                      <Calendar className="w-3.5 h-3.5 text-[color:var(--accent-primary)]" />
                      <span>{edu.duration}</span>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-200/50 dark:bg-slate-800/50" style={{ color: edu.color }}>
                      {edu.grade}
                    </span>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-xl md:text-2xl font-sora font-extrabold text-[color:var(--text-primary)] group-hover:text-[color:var(--accent-primary)] transition-colors duration-300">
                        {edu.degree}
                      </h3>
                      <p className="text-md font-bold mt-1" style={{ color: edu.color }}>
                        {edu.institution}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm md:text-base leading-relaxed text-[color:var(--text-secondary)] mb-6">
                    {edu.description}
                  </p>

                  {/* Academic badges */}
                  <div className="flex flex-wrap gap-2">
                    {edu.badges.map((badge, idx) => (
                      <span 
                        key={idx} 
                        className="px-3.5 py-1 text-xs font-semibold rounded-full border border-slate-300/30 dark:border-slate-700/30 bg-slate-200/30 dark:bg-slate-800/30 text-[color:var(--text-secondary)] group-hover:border-[color:var(--accent-primary)]/30 transition-colors duration-300"
                      >
                        {badge}
                      </span>
                    ))}
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
