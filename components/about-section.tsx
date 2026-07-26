"use client"

import { Code, Palette, Database, Smartphone, Globe, Zap, User, Radio, BarChart2, ShieldCheck, Users } from "lucide-react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { useAbout, useTimelineEntries, useSkills } from "@/lib/useConfig"

const ICON_MAP: Record<string, React.ComponentType<any>> = { Code, Palette, Database, Smartphone, Globe, Zap, Radio, BarChart2, ShieldCheck, Users }

export function AboutSection() {
  useScrollReveal()
  const { data: aboutData } = useAbout()
  const { data: timelineData } = useTimelineEntries()
  const { data: skillsData } = useSkills()

  const timeline = timelineData || []
  const skills = (skillsData || []).map((s) => ({
    ...s,
    IconComponent: ICON_MAP[s.icon] || Code,
  }))

  return (
    <section id="about" className="section-shell relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 reveal">
          <div className="inline-flex items-center gap-2 rounded-full chip px-4 py-1.5 text-xs font-bold uppercase tracking-wider mb-4">
            <User className="w-4 h-4 text-[color:var(--accent-primary)]" />
            About Me
          </div>
          <h2 className="section-title">About Me</h2>
          <p className="section-subtitle text-xl max-w-3xl mx-auto">
            {aboutData?.description || "Full-Stack Developer & UI/UX Designer with 2+ years of experience building modern web and mobile applications."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="reveal-left">
            <h3 className="text-2xl font-sora font-extrabold mb-8 flex items-center gap-2">
              <span className="w-2.5 h-6 rounded-full bg-[color:var(--accent-primary)]" />
              Professional Journey
            </h3>
            <div className="space-y-8">
              {timeline.map((item, index) => (
                <div key={item.id || index} className="relative">
                  <div className="flex items-start gap-6">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full border-2 border-[color:var(--accent-primary)] bg-[color:var(--bg-primary)] z-10 shrink-0" />
                      {index < timeline.length - 1 && (
                        <div className="w-0.5 h-24 mt-2 bg-gradient-to-b from-[color:var(--accent-primary)] to-transparent opacity-30" />
                      )}
                    </div>
                    <div className="glass-card rounded-2xl p-6 flex-1 hover:scale-[1.02] hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-1 h-full bg-[color:var(--accent-primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-extrabold tracking-wider" style={{ color: "var(--accent-primary)" }}>{item.year}</span>
                      </div>
                      <h4 className="text-lg font-sora font-extrabold mb-2">{item.title}</h4>
                      <p className="mb-4 text-sm leading-relaxed text-[color:var(--text-secondary)]">{item.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {(item.skills || []).map((skill) => (
                          <span key={skill} className="chip px-3 py-1 text-[10px] font-semibold rounded-full">{skill}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="reveal-right">
            <h3 className="text-2xl font-sora font-extrabold mb-8 flex items-center gap-2">
              <span className="w-2.5 h-6 rounded-full bg-[color:var(--accent-secondary)]" />
              Core Skills
            </h3>
            <div className="space-y-6">
              {skills.map((skill) => (
                <div key={skill.id} className="glass-card rounded-2xl p-6 hover:scale-[1.02] hover:shadow-lg transition-all duration-300 group">
                  <div className="flex items-center gap-4">
                    <div className="chip p-3.5 rounded-xl transition-colors duration-300 group-hover:bg-[color:var(--accent-soft)]">
                      <skill.IconComponent className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" style={{ color: "var(--accent-primary)" }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-sora font-bold text-sm md:text-base">{skill.name}</h4>
                        <span className="text-xs font-extrabold" style={{ color: "var(--accent-primary)" }}>{skill.level}%</span>
                      </div>
                      <div className="w-full rounded-full h-2 bg-slate-300/40 dark:bg-slate-700/50 overflow-hidden">
                        <div className="h-2 rounded-full transition-all duration-1000 ease-out" style={{ width: `${skill.level}%`, background: "var(--gradient-main)" }} />
                      </div>
                    </div>
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
