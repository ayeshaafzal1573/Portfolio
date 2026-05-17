"use client"

import type React from "react"
import { useState } from "react"
import { Send, Github, Linkedin, Dribbble, CheckCircle, AlertCircle, Info, Mail, Settings } from "lucide-react"
import { supabase, type ContactSubmission, isSupabaseConfigured } from "@/lib/supabase"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

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
  const [showConfigTips, setShowConfigTips] = useState(false)

  // Scroll reveal animations
  useScrollReveal()

  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || ""
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || ""
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ""

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    // Check if EmailJS environment variables are configured
    if (!serviceId || !templateId || !publicKey) {
      console.warn("EmailJS is not fully configured in your environment variables. Showing instructions.")
      // We will perform a simulated sending but prompt the user with config help
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500))
        
        // Also save to Supabase if configured as a reliable fallback
        if (isSupabaseConfigured()) {
          await supabase.from("contact_submissions").insert([formData])
        }

        setIsSubmitted(true)
        setFormData({ name: "", email: "", subject: "", message: "" })
        setShowConfigTips(true)
        setTimeout(() => setIsSubmitted(false), 8000)
      } catch (err: any) {
        setError("Local transmission completed, but database logging failed.")
      } finally {
        setIsSubmitting(false)
      }
      return
    }

    try {
      // 1. Send via EmailJS REST API
      const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: {
            from_name: formData.name,
            from_email: formData.email,
            subject: formData.subject,
            message: formData.message,
            to_email: "ayeshaafzal1573@gmail.com", // Direct target fallback
          },
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || "EmailJS failed to deliver the message.")
      }

      // 2. Backup: Log submission to Supabase if available
      if (isSupabaseConfigured()) {
        try {
          await supabase.from("contact_submissions").insert([formData])
        } catch (supabaseError) {
          console.warn("Supabase backup logging failed, but email was sent:", supabaseError)
        }
      }

      setIsSubmitted(true)
      setFormData({ name: "", email: "", subject: "", message: "" })
      setTimeout(() => setIsSubmitted(false), 6000)
    } catch (err: any) {
      console.error("EmailJS Error:", err)
      setError(err.message || "Failed to dispatch your email through EmailJS. Please ensure keys are correct.")
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
    <section id="contact" className="section-shell relative overflow-hidden pb-0">
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[color-mix(in_srgb,var(--accent-primary)_10%,transparent)] blur-[100px] pointer-events-none" />
      
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10 reveal">
          <div className="inline-flex items-center gap-2 rounded-full chip px-4 py-1.5 text-xs font-bold uppercase tracking-wider mb-4">
            <Mail className="w-4 h-4 text-[color:var(--accent-primary)]" />
            Get In Touch
          </div>
          <h2 className="section-title">Let&apos;s Work Together</h2>
          <p className="section-subtitle text-xl max-w-2xl mx-auto">
            Ready to bring your ideas to life? Let's discuss your project and create something outstanding together.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Instructions and Social links */}
          <div className="lg:col-span-4 space-y-6 reveal-left">
            <div className="glass-card rounded-2xl p-6 md:p-8 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[color:var(--accent-primary)]" />
              <h3 className="font-sora text-xl font-bold">Contact Info</h3>
              <p className="text-sm text-[color:var(--text-secondary)] leading-relaxed">
                Fill out the form and I will get back to you within 24 hours to schedule a consultation call.
              </p>
              
              <div className="space-y-4">
                <a 
                  href="mailto:ayeshaafzal1573@gmail.com" 
                  className="flex items-center gap-3 text-sm font-semibold hover:text-[color:var(--accent-primary)] transition-colors duration-300"
                >
                  <div className="p-2.5 rounded-xl chip">
                    <Mail className="w-4 h-4 text-[color:var(--accent-primary)]" />
                  </div>
                  <span>ayeshaafzal1573@gmail.com</span>
                </a>
              </div>
            </div>

            {/* Config alert helper for easy developer setup */}
            {(!serviceId || !templateId || !publicKey || showConfigTips) && (
              <div className="glass-card rounded-2xl p-6 border-amber-500/20 bg-amber-500/5 space-y-3.5 relative overflow-hidden transition-all duration-300">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500" />
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
                  <Settings className="w-4 h-4 animate-spin-slow" />
                  <span>EmailJS Integration Guide</span>
                </div>
                <p className="text-xs text-[color:var(--text-secondary)] leading-relaxed">
                  To receive contact form submissions directly in your Gmail, configure these variables in your <code className="font-mono text-[color:var(--accent-primary)] bg-slate-200/50 dark:bg-slate-800/50 px-1 rounded">.env.local</code> file:
                </p>
                <div className="bg-slate-900 text-slate-200 p-3 rounded-lg font-mono text-[10px] space-y-1 select-all overflow-x-auto hide-scrollbar">
                  <div>NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id</div>
                  <div>NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id</div>
                  <div>NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key</div>
                </div>
                <div className="flex items-start gap-1.5 text-[10px] text-[color:var(--text-secondary)] leading-tight">
                  <Info className="w-3.5 h-3.5 shrink-0 text-amber-500 mt-0.5" />
                  <span>Set up a free account on emailjs.com, connect your Gmail service, and paste the IDs here.</span>
                </div>
              </div>
            )}
          </div>

          {/* Form */}
          <div className="lg:col-span-8 reveal-right">
            <div className="glass-card rounded-2xl p-6 md:p-8">
              {isSubmitted && (
                <div className="mb-6 flex items-start gap-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-emerald-800 dark:text-emerald-300">
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-sm">Message Sent Successfully!</p>
                    <p className="text-xs text-[color:var(--text-secondary)] mt-1">
                      {!serviceId ? "Form running in demonstration mode. Connect EmailJS using the guide on the left to receive this in your Gmail!" : "I will receive this in my Gmail inbox and get back to you shortly."}
                    </p>
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
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="peer w-full rounded-2xl px-6 py-4 outline-none transition-all duration-300 input-shell"
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
                      className="peer w-full rounded-2xl px-6 py-4 outline-none transition-all duration-300 input-shell"
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
                    className="peer w-full rounded-2xl px-6 py-4 outline-none transition-all duration-300 input-shell"
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
                    rows={5}
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
                  className="btn-primary flex w-full items-center justify-center gap-3 rounded-full px-8 py-4 font-sora font-extrabold transition-all duration-300 hover:scale-[1.01] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Dispatching Message...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 border-t border-[color:var(--card-border)] pt-8">
                <div className="flex justify-center gap-4">
                  <a
                    href="https://github.com/ayeshaafzal1573/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-full p-3 btn-secondary transition-all duration-300 hover:scale-110"
                    aria-label="GitHub"
                  >
                    <Github className="h-5 w-5 transition-colors group-hover:text-[color:var(--accent-primary)]" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/ayeshaafzalqadir/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-full p-3 btn-secondary transition-all duration-300 hover:scale-110"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-5 w-5 transition-colors group-hover:text-[color:var(--accent-primary)]" />
                  </a>
                  <a
                    href="https://www.behance.net/ayeshaafzal14"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-full p-3 btn-secondary transition-all duration-300 hover:scale-110"
                    aria-label="Behance"
                  >
                    <Dribbble className="h-5 w-5 transition-colors group-hover:text-[color:var(--accent-primary)]" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
