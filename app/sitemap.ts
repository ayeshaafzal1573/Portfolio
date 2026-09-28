import type { MetadataRoute } from "next"
import { caseStudies, slugifyCaseStudy } from "@/lib/content"

const baseUrl = "https://ayeshaafzalqadir.vercel.app"

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...caseStudies.map((study) => ({
      url: `${baseUrl}/work/${slugifyCaseStudy(study.projectTitle)}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ]
}
