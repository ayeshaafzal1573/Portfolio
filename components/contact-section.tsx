"use client"

import type React from "react"
import { useState } from "react"
import { Send, Github, Linkedin, Dribbble, CheckCircle, AlertCircle } from "lucide-react"
import { supabase, type ContactSubmission, isSupabaseConfigured } from "@/lib/supabase"

export function ContactSection() {
  const [formData, setFormData] = useState<ContactSubmission>({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      if (!isSupabaseConfigured()) {
        // Simulate form submission for demo purposes
        await new Promise((resolve) => setTimeout(resolve, 2000))
        console.log("Demo mode: Form data would be submitted:", formData)
        setIsSubmitted(true)
        setFormData({ name: "", email: "", subject: "", message: "" })
        setTimeout(() => setIsSubmitted(false), 5000)
        return
      }

      // Insert contact submission into Supabase
      const { error: insertError } = await supabase.from("contact_submissions").insert([formData])

      if (insertError) throw insertError

      // Call edge function to send email notification
      const { error: emailError } = await supabase.functions.invoke("send-contact-email", {
        body: formData,
      })

      if (emailError) {
        console.warn("Email notification failed:", emailError)
      }

      setIsSubmitted(true)
      setFormData({ name: "", email: "", subject: "", message: "" })
      setTimeout(() => setIsSubmitted(false), 5000)
    } catch (error: any) {
      console.error("Error submitting form:", error)
      setError(error.message || "Failed to submit form. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <section id="contact" className="section-shell">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-title">Let&apos;s Work Together</h2>
          <p className="section-subtitle text-xl max-w-2xl mx-auto">
            Ready to bring your ideas to life? Let's discuss your project and create something amazing together.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-8 md:p-12">
          {isSubmitted && (
            <div className="mb-8 flex items-center gap-3 rounded-lg bg-emerald-100/80 p-4 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>
                Thank you! Your message has been sent successfully. I'll get back to you soon!
              </span>
            </div>
          )}

          {error && (
            <div className="mb-8 p-4 rounded-lg bg-red-100 dark:bg-red-900 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-700 dark:text-red-300">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="peer w-full rounded-full px-6 py-4 outline-none transition-all duration-300 input-shell"
                  placeholder=" "
                />
                <label className="pointer-events-none absolute left-6 top-4 text-sm text-[color:var(--text-secondary)] transition-all duration-300 peer-focus:-translate-y-7 peer-focus:scale-90 peer-[:not(:placeholder-shown)]:-translate-y-7 peer-[:not(:placeholder-shown)]:scale-90">
                  Your Name
                </label>
              </div>

              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="peer w-full rounded-full px-6 py-4 outline-none transition-all duration-300 input-shell"
                  placeholder=" "
                />
                <label className="pointer-events-none absolute left-6 top-4 text-sm text-[color:var(--text-secondary)] transition-all duration-300 peer-focus:-translate-y-7 peer-focus:scale-90 peer-[:not(:placeholder-shown)]:-translate-y-7 peer-[:not(:placeholder-shown)]:scale-90">
                  Email Address
                </label>
              </div>
            </div>

            <div className="relative">
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="peer w-full rounded-full px-6 py-4 outline-none transition-all duration-300 input-shell"
                placeholder=" "
              />
              <label className="pointer-events-none absolute left-6 top-4 text-sm text-[color:var(--text-secondary)] transition-all duration-300 peer-focus:-translate-y-7 peer-focus:scale-90 peer-[:not(:placeholder-shown)]:-translate-y-7 peer-[:not(:placeholder-shown)]:scale-90">
                Subject
              </label>
            </div>

            <div className="relative">
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="peer w-full resize-none rounded-2xl px-6 py-4 outline-none transition-all duration-300 input-shell"
                placeholder=" "
              />
              <label className="pointer-events-none absolute left-6 top-4 text-sm text-[color:var(--text-secondary)] transition-all duration-300 peer-focus:-translate-y-7 peer-focus:scale-90 peer-[:not(:placeholder-shown)]:-translate-y-7 peer-[:not(:placeholder-shown)]:scale-90">
                Your Message
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex w-full items-center justify-center gap-3 rounded-full px-8 py-4 font-sora font-bold transition-all duration-300 hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  Send Message
                  <Send className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 border-t border-[color:var(--card-border)] pt-8">
            <div className="flex justify-center gap-6">
              <a
                href="https://github.com/ayeshaafzal1573/"
                className="group rounded-full p-4 btn-secondary transition-all duration-300 hover:scale-110"
                aria-label="GitHub"
              >
                <Github className="h-6 w-6 transition-colors group-hover:text-[color:var(--accent-primary)]" />
              </a>
              <a
                href="https://www.linkedin.com/in/ayeshaafzalqadir/"
                className="group rounded-full p-4 btn-secondary transition-all duration-300 hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-6 w-6 transition-colors group-hover:text-[color:var(--accent-primary)]" />
              </a>
              <a
                href="https://www.behance.net/ayeshaafzal14"
                className="group rounded-full p-4 btn-secondary transition-all duration-300 hover:scale-110"
                aria-label="Dribbble"
              >
                <Dribbble className="h-6 w-6 transition-colors group-hover:text-[color:var(--accent-primary)]" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
