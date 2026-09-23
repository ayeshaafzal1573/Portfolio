"use client"

import { useMemo, useState } from "react"
import { ExternalLink, Github, Layers, ArrowDown, FolderOpen, ArrowUpRight } from "lucide-react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { useCategorizedProjects } from "@/lib/useConfig"
import { SectionHeading } from "@/components/section-heading"
import { HoverVideo } from "@/components/hover-video"
import { selectedProjects, caseStudies, type CaseStudy } from "@/lib/content"
import { scrollToId } from "@/lib/utils"

const videoExtensions = [".mp4", ".webm", ".ogg"]

function isValidUrl(value?: string | null): value is string {
  if (!value || value === "#") return false
  return /^https?:\/\//.test(value)
}

function isVideoUrl(value?: string | null): boolean {
  if (!value) return false
  return videoExtensions.some((ext) => value.toLowerCase().includes(ext))
}

interface SelectedProjectItem {
  title: string
  description: string
  category: string
  tech_stack: string[]
  demo_url: string
  github_url: string
  image_url: string
  video_url: string
}

function CaseStudyPanel({
  study,
  isOpen,
  onOpen,
}: {
  study: CaseStudy
  isOpen: boolean
  onOpen: () => void
}) {
  const id = `case-study-${study.projectTitle.toLowerCase().replace(/\s+/g, "-")}`

  return (
    <div id={id} className="scroll-mt-24">
      <div className="glass-card rounded-2xl overflow-hidden">
        <button
          type="button"
          onClick={onOpen}
          aria-expanded={isOpen}
          aria-controls={`${id}-content`}
          className="flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-[color:var(--accent-soft)]"
        >
          <div className="flex items-center gap-4">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl chip">
              <FolderOpen className="h-4 w-4 text-[color:var(--accent-primary)]" />
            </span>
            <div>
              <h4 className="font-sora text-base font-extrabold">{study.projectTitle}</h4>
              <p className="text-xs font-medium text-[color:var(--text-secondary)]">{study.type}</p>
            </div>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-[color:var(--accent-primary)]">
            {isOpen ? "Close" : "View Case Study"}
          </span>
        </button>

        {isOpen && (
          <div id={`${id}-content`} className="border-t border-[color:var(--card-border)] px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-5">
                <div>
                  <h5 className="mb-1 text-xs font-bold uppercase tracking-wider text-[color:var(--accent-secondary)]">Overview</h5>
                  <p className="text-sm leading-relaxed text-[color:var(--text-secondary)]">{study.summary}</p>
                </div>
                <div>
                  <h5 className="mb-1 text-xs font-bold uppercase tracking-wider text-[color:var(--accent-secondary)]">Problem</h5>
                  <p className="text-sm leading-relaxed text-[color:var(--text-secondary)]">{study.problem}</p>
                </div>
                <div>
                  <h5 className="mb-1 text-xs font-bold uppercase tracking-wider text-[color:var(--accent-secondary)]">Solution</h5>
                  <p className="text-sm leading-relaxed text-[color:var(--text-secondary)]">{study.solution}</p>
                </div>
                <div>
                  <h5 className="mb-1 text-xs font-bold uppercase tracking-wider text-[color:var(--accent-secondary)]">My Role</h5>
                  <p className="text-sm leading-relaxed text-[color:var(--text-secondary)]">{study.role}</p>
                </div>
                <div>
                  <h5 className="mb-1 text-xs font-bold uppercase tracking-wider text-[color:var(--accent-secondary)]">Outcome</h5>
                  <p className="text-sm leading-relaxed text-[color:var(--text-secondary)]">{study.outcome}</p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <h5 className="mb-2 text-xs font-bold uppercase tracking-wider text-[color:var(--accent-secondary)]">Tech stack</h5>
                  <div className="space-y-2">
                    {study.techStack.map((group) => (
                      <div key={group.label} className="flex flex-wrap items-center gap-1.5">
                        <span className="w-24 shrink-0 text-xs font-bold text-[color:var(--text-primary)]">{group.label}</span>
                        {group.items.map((item) => (
                          <span key={item} className="chip px-2 py-0.5 text-[10px] font-semibold">{item}</span>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                {study.architecture.length > 0 && (
                  <div>
                    <h5 className="mb-2 text-xs font-bold uppercase tracking-wider text-[color:var(--accent-secondary)]">Architecture</h5>
                    <ol className="space-y-1">
                      {study.architecture.map((layer, i) => (
                        <li key={layer.label} className="flex items-center gap-3 text-sm">
                          <span className="inline-flex h-5 w-9 shrink-0 items-center justify-center rounded-md bg-[color:var(--accent-soft)] text-[10px] font-extrabold text-[color:var(--accent-primary)]">
                            {i + 1}
                          </span>
                          <span className="font-bold">{layer.label}</span>
                          <span className="text-xs text-[color:var(--text-secondary)]">· {layer.detail}</span>
                          {i < study.architecture.length - 1 && (
                            <span aria-hidden="true" className="ml-auto text-[color:var(--accent-secondary)]">↓</span>
                          )}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                <div>
                  <h5 className="mb-2 text-xs font-bold uppercase tracking-wider text-[color:var(--accent-secondary)]">
                    Key engineering work
                  </h5>
                  <ul className="space-y-1.5">
                    {study.engineering.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm leading-relaxed text-[color:var(--text-secondary)]">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent-primary)]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function SelectedWork() {
  useScrollReveal()
  const { data: projectsData } = useCategorizedProjects()
  const [openStudy, setOpenStudy] = useState<string | null>(null)

  const selected: SelectedProjectItem[] = useMemo(() => {
    const dbByTitle = new Map<string, SelectedProjectItem>()
    for (const p of projectsData || []) dbByTitle.set(p.title, p)
    return selectedProjects.map((meta) => {
      const db = dbByTitle.get(meta.title)
      return {
        title: meta.title,
        description: db?.description || "",
        category: db?.category || "",
        tech_stack: db?.tech_stack || [],
        demo_url: db && isValidUrl(db.demo_url) ? db.demo_url : meta.demo_url,
        github_url: db?.github_url || meta.github_url || "",
        image_url: db?.image_url || meta.image_url || "",
        video_url: db?.video_url || meta.video_url || "",
      }
    })
  }, [projectsData])

  const visibleStudies = useMemo(
    () => caseStudies.filter((s) => selected.some((p) => p.title === s.projectTitle)),
    [selected]
  )

  const openCaseStudy = (title: string) => {
    setOpenStudy((prev) => (prev === title ? null : title))
    scrollToId(`case-study-${title.toLowerCase().replace(/\s+/g, "-")}`)
  }

  const [featured, ...rest] = selected
  const featuredStudy = featured ? caseStudies.find((s) => s.projectTitle === featured.title) : undefined

  return (
    <section id="work" className="section-shell relative overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          icon={Layers}
          chip="Selected Work"
          title="Selected Production Work"
          subtitle="Real products I have worked on — from utility apps and real-time dashboards to mobile ERP and web platforms."
        />

        {featured && (
          <article className="group glass-card reveal-scale mb-6 grid grid-cols-1 overflow-hidden rounded-3xl lg:grid-cols-2">
            <div className="relative min-h-[16rem] overflow-hidden lg:min-h-[22rem]">
              {featured.image_url ? (
                <img
                  src={featured.image_url}
                  alt={featured.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : isVideoUrl(featured.video_url) ? (
                <HoverVideo src={featured.video_url} poster="/placeholder.svg" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[color:var(--accent-soft)]">
                  <Layers className="h-16 w-16 text-[color:var(--accent-primary)] opacity-40" />
                </div>
              )}
              <div className="absolute left-4 top-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
                  {featured.category || "Full-Stack"}
                </span>
              </div>
            </div>

            <div className="flex flex-col justify-center p-7 md:p-10">
              <span className="mb-3 text-xs font-bold uppercase tracking-widest text-[color:var(--accent-primary)]">
                Featured · {featuredStudy?.type?.split("·")[0]?.trim() || "Full-Stack"}
              </span>
              <h3 className="mb-3 font-sora text-2xl font-extrabold md:text-3xl">{featured.title}</h3>
              <p className="mb-5 max-w-xl text-sm leading-relaxed text-[color:var(--text-secondary)]">
                {featuredStudy?.summary || featured.description}
              </p>
              <div className="mb-6 flex flex-wrap gap-1.5">
                {(featured.tech_stack || []).map((tech) => (
                  <span key={tech} className="chip px-2.5 py-1 text-[10px] font-semibold">{tech}</span>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {isValidUrl(featured.demo_url) && (
                  <a
                    href={featured.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold btn-primary hover:shadow-lg transition-all duration-300"
                  >
                    Visit Project <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                {featuredStudy && (
                  <button
                    type="button"
                    onClick={() => openCaseStudy(featured.title)}
                    className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold btn-secondary transition-all duration-300 cursor-pointer"
                  >
                    View Case Study <ArrowDown className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </article>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 reveal-scale">
          {rest.map((project) => {
            const study = caseStudies.find((s) => s.projectTitle === project.title)
            return (
              <article key={project.title} className="group glass-card relative flex flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="relative h-44 shrink-0 overflow-hidden">
                  {project.image_url ? (
                    <img
                      src={project.image_url}
                      alt={project.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : isVideoUrl(project.video_url) ? (
                    <HoverVideo src={project.video_url} poster="/placeholder.svg" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[color:var(--accent-soft)]">
                      <Layers className="h-12 w-12 text-[color:var(--accent-primary)] opacity-40" />
                    </div>
                  )}
                  {study && (
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                      <FolderOpen className="h-3 w-3" /> Case study
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <h3 className="font-sora text-lg font-extrabold">{project.title}</h3>
                    <span className="chip px-2 py-0.5 text-[10px] font-bold">{project.category || "Project"}</span>
                  </div>
                  <p className="mb-4 text-sm leading-relaxed text-[color:var(--text-secondary)] line-clamp-2">
                    {study?.summary || project.description}
                  </p>
                  <div className="mb-5 flex flex-wrap gap-1.5">
                    {(project.tech_stack || []).slice(0, 4).map((tech) => (
                      <span key={tech} className="chip px-2.5 py-1 text-[10px] font-semibold">{tech}</span>
                    ))}
                  </div>
                  <div className="mt-auto flex flex-wrap gap-2">
                    {isValidUrl(project.demo_url) && (
                      <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold btn-primary transition-all duration-300">
                        <ArrowUpRight className="h-3.5 w-3.5" /> Live / Demo
                      </a>
                    )}
                    {study && (
                      <button
                        type="button"
                        onClick={() => openCaseStudy(project.title)}
                        className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold btn-secondary transition-all duration-300 cursor-pointer"
                      >
                        View Case Study
                      </button>
                    )}
                    {isValidUrl(project.github_url) && (
                      <a href={project.github_url} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} source code`} className="inline-flex items-center justify-center rounded-full p-2 btn-secondary transition-all duration-300">
                        <Github className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>

      {visibleStudies.length > 0 && (
        <div className="mx-auto mt-14 max-w-7xl">
          <div className="mb-6 text-center reveal">
            <h3 className="font-sora text-xl font-extrabold md:text-2xl">Project Case Studies</h3>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-[color:var(--text-secondary)]">
              Problem → Solution → My contribution → Architecture → Result.
            </p>
          </div>
          <div className="space-y-4 reveal-scale">
            {visibleStudies.map((study) => (
              <CaseStudyPanel
                key={study.projectTitle}
                study={study}
                isOpen={openStudy === study.projectTitle}
                onOpen={() => openCaseStudy(study.projectTitle)}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}