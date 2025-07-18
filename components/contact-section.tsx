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
    <section id="contact" className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-sora font-bold mb-6">Let's Work Together</h2>
          <p className="text-xl text-opacity-80 max-w-2xl mx-auto">
            Ready to bring your ideas to life? Let's discuss your project and create something amazing together.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-8 md:p-12">
          {isSubmitted && (
            <div className="mb-8 p-4 rounded-lg pastel:bg-green-100 dark:bg-green-900 girly-blue:bg-green-100 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-700 dark:text-green-300">
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
                  className="w-full px-6 py-4 glass-card rounded-full border-2 border-transparent focus:border-purple-400 dark:focus:border-blue-400 girly-blue:focus:border-blue-400 outline-none transition-all duration-300 peer bg-transparent"
                  placeholder=" "
                />
                <label className="absolute left-6 top-4 text-opacity-60 transition-all duration-300 peer-focus:-translate-y-8 peer-focus:scale-75 peer-[:not(:placeholder-shown)]:-translate-y-8 peer-[:not(:placeholder-shown)]:scale-75 pointer-events-none">
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
                  className="w-full px-6 py-4 glass-card rounded-full border-2 border-transparent focus:border-purple-400 dark:focus:border-blue-400 girly-blue:focus:border-blue-400 outline-none transition-all duration-300 peer bg-transparent"
                  placeholder=" "
                />
                <label className="absolute left-6 top-4 text-opacity-60 transition-all duration-300 peer-focus:-translate-y-8 peer-focus:scale-75 peer-[:not(:placeholder-shown)]:-translate-y-8 peer-[:not(:placeholder-shown)]:scale-75 pointer-events-none">
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
                className="w-full px-6 py-4 glass-card rounded-full border-2 border-transparent focus:border-purple-400 dark:focus:border-blue-400 girly-blue:focus:border-blue-400 outline-none transition-all duration-300 peer bg-transparent"
                placeholder=" "
              />
              <label className="absolute left-6 top-4 text-opacity-60 transition-all duration-300 peer-focus:-translate-y-8 peer-focus:scale-75 peer-[:not(:placeholder-shown)]:-translate-y-8 peer-[:not(:placeholder-shown)]:scale-75 pointer-events-none">
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
                className="w-full px-6 py-4 glass-card rounded-2xl border-2 border-transparent focus:border-purple-400 dark:focus:border-blue-400 girly-blue:focus:border-blue-400 outline-none transition-all duration-300 peer resize-none bg-transparent"
                placeholder=" "
              />
              <label className="absolute left-6 top-4 text-opacity-60 transition-all duration-300 peer-focus:-translate-y-8 peer-focus:scale-75 peer-[:not(:placeholder-shown)]:-translate-y-8 peer-[:not(:placeholder-shown)]:scale-75 pointer-events-none">
                Your Message
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-8 pastel:bg-gradient-to-r pastel:from-purple-500 pastel:to-pink-500 dark:bg-gradient-to-r dark:from-blue-500 dark:to-purple-500 girly-blue:bg-gradient-to-r girly-blue:from-blue-500 girly-blue:to-indigo-500 text-white rounded-full font-sora font-bold hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
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

          <div className="mt-12 pt-8 border-t border-opacity-20">
            <div className="flex justify-center gap-6">
              <a
                href="https://github.com"
                className="p-4 glass-card rounded-full hover:scale-110 transition-all duration-300 group"
                aria-label="GitHub"
              >
                <Github className="w-6 h-6 group-hover:text-purple-500 dark:group-hover:text-blue-400 girly-blue:group-hover:text-blue-500 transition-colors" />
              </a>
              <a
                href="https://linkedin.com"
                className="p-4 glass-card rounded-full hover:scale-110 transition-all duration-300 group"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-6 h-6 group-hover:text-purple-500 dark:group-hover:text-blue-400 girly-blue:group-hover:text-blue-500 transition-colors" />
              </a>
              <a
                href="https://dribbble.com"
                className="p-4 glass-card rounded-full hover:scale-110 transition-all duration-300 group"
                aria-label="Dribbble"
              >
                <Dribbble className="w-6 h-6 group-hover:text-purple-500 dark:group-hover:text-blue-400 girly-blue:group-hover:text-blue-500 transition-colors" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
