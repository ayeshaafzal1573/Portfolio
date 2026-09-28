import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ArrowUpRight, Github, Layers } from "lucide-react"
import { caseStudies, findCaseStudyBySlug, slugifyCaseStudy } from "@/lib/content"
import {
  getProjectsByCaseStudyTitle,
  matchProject,
  projectImageAlt,
  isExternalLink,
} from "@/lib/projects"

const SITE_URL = "https://ayeshaafzalqadir.vercel.app"
const PORTRAIT_URL = `${SITE_URL}/ayesha-afzal-qadir.png`

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: slugifyCaseStudy(study.projectTitle) }))
}

export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const study = findCaseStudyBySlug(slug)
  if (!study) return { title: "Case Study Not Found" }

  // Root layout applies the "%s | Ayesha Afzal" template, so no suffix here.
  const title = `${study.projectTitle} Case Study`
  const stack = study.techStack
    .flatMap((group) => group.items)
    .filter((item) => !/^[A-Z/.]/.test(item))
    .slice(0, 4)
  const description = `${study.summary} ${study.role} Built with ${stack.join(", ")}. Case study by Ayesha Afzal, full-stack & mobile engineer in Karachi.`.slice(0, 158)

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/work/${slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/work/${slug}`,
      type: "article",
      images: [{ url: PORTRAIT_URL, alt: title, width: 420, height: 560 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [PORTRAIT_URL],
    },
  }
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const study = findCaseStudyBySlug(slug)
  if (!study) notFound()

  const projects = await getProjectsByCaseStudyTitle()
  const project = matchProject(projects, study.projectTitle)
  const image = isExternalLink(project?.image_url) ? project.image_url : null
  const allTech = Array.from(new Set(study.techStack.flatMap((group) => group.items)))

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: `${study.projectTitle} — Case Study`,
    headline: study.projectTitle,
    description: study.summary,
    url: `${SITE_URL}/work/${slug}`,
    author: { "@type": "Person", name: "Ayesha Afzal", url: SITE_URL },
    creator: { "@type": "Person", name: "Ayesha Afzal", url: SITE_URL },
    about: study.type,
    keywords: allTech.join(", "),
    ...(image ? { image } : {}),
    inLanguage: "en",
  }

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Selected Work", item: `${SITE_URL}/#work` },
      { "@type": "ListItem", position: 3, name: study.projectTitle, item: `${SITE_URL}/work/${slug}` },
    ],
  }

  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <div className="section-shell mx-auto max-w-4xl py-10 md:py-16">
        <Link
          href="/#work"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--text-secondary)] transition-colors hover:text-[color:var(--accent-primary)]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Selected Work
        </Link>

        <header className="mb-10">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-[color:var(--card-border)] bg-[color:var(--accent-soft)]/60 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[color:var(--accent-primary)]">
            <Layers className="h-3.5 w-3.5" aria-hidden="true" />
            {study.type}
          </p>
          <h1 className="font-sora text-3xl font-extrabold leading-tight tracking-tight text-[color:var(--text-primary)] sm:text-4xl md:text-5xl">
            {study.projectTitle} — Full-Stack Case Study
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[color:var(--text-secondary)] md:text-lg">
            {study.summary}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {isExternalLink(project?.demo_url) && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[color:var(--accent-primary)] px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90"
              >
                View Live Project
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            )}
            {isExternalLink(project?.github_url) && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[color:var(--card-border)] px-4 py-2 text-sm font-bold transition-colors hover:border-[color:var(--accent-primary)]"
              >
                <Github className="h-4 w-4" aria-hidden="true" />
                Source Code
              </a>
            )}
          </div>
        </header>

        {image && (
          <figure className="glass-card mb-10 overflow-hidden rounded-3xl">
            <img
              src={image}
              alt={projectImageAlt(
                { ...project!, title: study.projectTitle },
                study.type.split("·")[0]?.trim() || "project"
              )}
              className="h-full w-full object-cover"
            />
          </figure>
        )}

        <section className="mb-10">
          <h2 className="section-title mb-4">My Role</h2>
          <p className="max-w-2xl leading-relaxed text-[color:var(--text-secondary)]">{study.role}</p>
        </section>

        <section className="mb-10">
          <h2 className="section-title mb-4">Tech Stack</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {study.techStack.map((group) => (
              <div key={group.label} className="glass-card rounded-2xl p-5">
                <h3 className="mb-3 font-sora text-base font-extrabold text-[color:var(--text-primary)]">
                  {group.label}
                </h3>
                <ul className="flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <li key={item} className="chip px-2.5 py-1 text-[10px] font-semibold">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="section-title mb-4">Problem, Solution &amp; Outcome</h2>
          <div className="space-y-4">
            <div className="glass-card rounded-2xl p-5">
              <h3 className="mb-2 font-sora text-base font-extrabold text-[color:var(--text-primary)]">
                The Problem
              </h3>
              <p className="text-sm leading-relaxed text-[color:var(--text-secondary)]">{study.problem}</p>
            </div>
            <div className="glass-card rounded-2xl p-5">
              <h3 className="mb-2 font-sora text-base font-extrabold text-[color:var(--text-primary)]">
                The Solution
              </h3>
              <p className="text-sm leading-relaxed text-[color:var(--text-secondary)]">{study.solution}</p>
            </div>
            <div className="glass-card rounded-2xl p-5">
              <h3 className="mb-2 font-sora text-base font-extrabold text-[color:var(--text-primary)]">
                The Outcome
              </h3>
              <p className="text-sm leading-relaxed text-[color:var(--text-secondary)]">{study.outcome}</p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="section-title mb-4">Architecture</h2>
          <ol className="space-y-2">
            {study.architecture.map((layer, index) => (
              <li key={layer.label} className="glass-card flex items-baseline gap-3 rounded-2xl p-4">
                <span className="text-xs font-bold text-[color:var(--accent-primary)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-sora text-sm font-extrabold text-[color:var(--text-primary)]">
                  {layer.label}
                </span>
                <span className="text-sm text-[color:var(--text-secondary)]">{layer.detail}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="mb-12">
          <h2 className="section-title mb-4">Engineering Work</h2>
          <ul className="space-y-2">
            {study.engineering.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-relaxed text-[color:var(--text-secondary)]">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent-primary)]" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="glass-card rounded-3xl p-7 text-center">
          <h2 className="font-sora text-xl font-extrabold text-[color:var(--text-primary)] md:text-2xl">
            Need an engineer who has shipped this?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[color:var(--text-secondary)]">
            I build production web apps, mobile apps, and real-time backends. Available for freelance
            and full-time work from Karachi.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 rounded-full bg-[color:var(--accent-primary)] px-5 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
            >
              Start a Conversation
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--card-border)] px-5 py-2.5 text-sm font-bold transition-colors hover:border-[color:var(--accent-primary)]"
            >
              Hire Me
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
