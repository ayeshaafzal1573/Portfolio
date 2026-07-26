"use client"

import type React from "react"
import { useState } from "react"
import { Send, Github, Linkedin, Dribbble, CheckCircle, AlertCircle, Mail } from "lucide-react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { useContactInfo, useSocialLinks } from "@/lib/useConfig"

const PLATFORM_ICONS: Record<string, React.ComponentType<any>> = { github: Github, linkedin: Linkedin, dribbble: Dribbble }

export function ContactSection() {
  const { data: contactData } = useContactInfo()
  const { data: linksData } = useSocialLinks()
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  useScrollReveal()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const resp = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!resp.ok) throw new Error("Failed to send message")

      setIsSubmitted(true)
      setFormData({ name: "", email: "", subject: "", message: "" })
      setTimeout(() => setIsSubmitted(false), 6000)
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const socialLinks = linksData || []
  const heading = contactData?.heading || "Let's Work Together"
  const subtitle = contactData?.subtitle || "Ready to bring your ideas to life?"
  const email = contactData?.email || "ayeshaafzal1573@gmail.com"

  return (
    <section id="contact" className="section-shell relative overflow-hidden pb-0">
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[color-mix(in_srgb,var(--accent-primary)_10%,transparent)] blur-[100px] pointer-events-none" />
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10 reveal">
          <div className="inline-flex items-center gap-2 rounded-full chip px-4 py-1.5 text-xs font-bold uppercase tracking-wider mb-4">
            <Mail className="w-4 h-4 text-[color:var(--accent-primary)]" />
            Get In Touch
          </div>
          <h2 className="section-title">{heading}</h2>
          <p className="section-subtitle text-xl max-w-2xl mx-auto">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 space-y-6 reveal-left">
            <div className="glass-card rounded-2xl p-6 md:p-8 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[color:var(--accent-primary)]" />
              <h3 className="font-sora text-xl font-bold">Contact Info</h3>
              <p className="text-sm text-[color:var(--text-secondary)] leading-relaxed">Fill out the form and I will get back to you within 24 hours.</p>
              <div className="space-y-4">
                <a href={`mailto:${email}`} className="flex items-center gap-3 text-sm font-semibold hover:text-[color:var(--accent-primary)] transition-colors duration-300">
                  <div className="p-2.5 rounded-xl chip"><Mail className="w-4 h-4 text-[color:var(--accent-primary)]" /></div>
                  <span>{email}</span>
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 reveal-right">
            <div className="glass-card rounded-2xl p-6 md:p-8">
              {isSubmitted && (
                <div className="mb-6 flex items-start gap-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-emerald-800 dark:text-emerald-300">
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-sm">Message Sent Successfully!</p>
                    <p className="text-xs text-[color:var(--text-secondary)] mt-1">I will get back to you shortly.</p>
                  </div>
                </div>
              )}
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-800 dark:text-red-300">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                  <span className="text-sm font-semibold">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="peer w-full rounded-2xl px-6 py-4 outline-none transition-all duration-300 input-shell" placeholder=" " />
                    <label className="pointer-events-none absolute left-6 top-4 text-sm text-[color:var(--text-secondary)] transition-all duration-300 peer-focus:-translate-y-7 peer-focus:scale-90 peer-[:not(:placeholder-shown)]:-translate-y-7 peer-[:not(:placeholder-shown)]:scale-90">Your Name</label>
                  </div>
                  <div className="relative">
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className="peer w-full rounded-2xl px-6 py-4 outline-none transition-all duration-300 input-shell" placeholder=" " />
                    <label className="pointer-events-none absolute left-6 top-4 text-sm text-[color:var(--text-secondary)] transition-all duration-300 peer-focus:-translate-y-7 peer-focus:scale-90 peer-[:not(:placeholder-shown)]:-translate-y-7 peer-[:not(:placeholder-shown)]:scale-90">Email Address</label>
                  </div>
                </div>
                <div className="relative">
                  <input type="text" name="subject" value={formData.subject} onChange={handleChange} required className="peer w-full rounded-2xl px-6 py-4 outline-none transition-all duration-300 input-shell" placeholder=" " />
                  <label className="pointer-events-none absolute left-6 top-4 text-sm text-[color:var(--text-secondary)] transition-all duration-300 peer-focus:-translate-y-7 peer-focus:scale-90 peer-[:not(:placeholder-shown)]:-translate-y-7 peer-[:not(:placeholder-shown)]:scale-90">Subject</label>
                </div>
                <div className="relative">
                  <textarea name="message" value={formData.message} onChange={handleChange} required rows={5} className="peer w-full resize-none rounded-2xl px-6 py-4 outline-none transition-all duration-300 input-shell" placeholder=" " />
                  <label className="pointer-events-none absolute left-6 top-4 text-sm text-[color:var(--text-secondary)] transition-all duration-300 peer-focus:-translate-y-7 peer-focus:scale-90 peer-[:not(:placeholder-shown)]:-translate-y-7 peer-[:not(:placeholder-shown)]:scale-90">Your Message</label>
                </div>
                <button type="submit" disabled={isSubmitting} className="btn-primary flex w-full items-center justify-center gap-3 rounded-full px-8 py-4 font-sora font-extrabold transition-all duration-300 hover:scale-[1.01] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer">
                  {isSubmitting ? (<><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Sending...</>) : (<>Send Message <Send className="w-4 h-4" /></>)}
                </button>
              </form>

              <div className="mt-8 border-t border-[color:var(--card-border)] pt-8">
                <div className="flex justify-center gap-4">
                  {socialLinks.map((link) => {
                    const Icon = PLATFORM_ICONS[link.platform] || Dribbble
                    return (
                      <a key={link.platform} href={link.url} target="_blank" rel="noopener noreferrer" className="group rounded-full p-3 btn-secondary transition-all duration-300 hover:scale-110" aria-label={link.label || link.platform}>
                        <Icon className="h-5 w-5 transition-colors group-hover:text-[color:var(--accent-primary)]" />
                      </a>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
