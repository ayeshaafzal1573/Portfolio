"use client"

import { useState, useEffect } from "react"
import { showToast } from "@/components/admin/Toast"
import { Save, Bot, KeyRound } from "lucide-react"
import { Button, Card, Field, TextArea, TextField, SelectField, Toggle, Badge } from "@/components/admin/ui"
import {
  DEFAULT_CONFIG,
  type ChatbotConfig,
  type ThemeConfig,
} from "@/lib/theme"

const MODEL_OPTIONS = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-2.0-flash-lite"]

export default function ChatbotEditor() {
  const [config, setConfig] = useState<ThemeConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/theme-config")
        const data = await res.json()
        setConfig(data.config || DEFAULT_CONFIG)
      } catch {
        setConfig(DEFAULT_CONFIG)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const update = (patch: Partial<ChatbotConfig>) => {
    setConfig((prev) =>
      prev
        ? { ...prev, chatbot: { ...prev.chatbot, ...patch } }
        : prev
    )
  }

  const handleSave = async () => {
    if (!config) return
    setSaving(true)
    try {
      const res = await fetch("/api/theme-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config }),
      })
      if (!res.ok) throw new Error("Save failed")
      window.dispatchEvent(new Event("portfolioConfigUpdated"))
      showToast("Chatbot settings saved", "success")
    } catch {
      showToast("Failed to save chatbot settings", "error")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-48 rounded bg-zinc-200" />
        <div className="h-64 rounded-lg bg-zinc-200/60" />
      </div>
    )
  }

  if (!config) {
    return (
      <div className="rounded-lg border-2 border-dashed border-zinc-200 py-14 text-center">
        <Bot className="mx-auto mb-3 h-10 w-10 text-zinc-300" />
        <p className="text-sm font-semibold text-zinc-900">Couldn't load chatbot config</p>
        <p className="mt-1 text-sm text-zinc-500">Refresh the page to try again.</p>
      </div>
    )
  }

  const chatbot = config.chatbot

  return (
    <div className="space-y-6">
      <Card
        title="AI Chatbot"
        description="Configure the floating portfolio assistant. It answers using Google Gemini, backed by Ayesha's real data."
        actions={<Badge tone="dark">AI Powered</Badge>}
      >
        <div className="space-y-5">
          <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-zinc-900">Enable chatbot</p>
              <p className="text-xs text-zinc-500">Shows the floating assistant button on your site.</p>
            </div>
            <Toggle
              checked={chatbot.enabled !== false}
              onChange={(v) => update({ enabled: v })}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Bot name" hint="The name shown in the chat header.">
              <TextField
                value={chatbot.botName}
                onChange={(e) => update({ botName: e.target.value })}
                placeholder="Ayesha's Copilot"
              />
            </Field>
            <Field label="Model" hint="Which Gemini model powers the answers.">
              <SelectField
                value={chatbot.model}
                onChange={(e) => update({ model: e.target.value })}
              >
                {MODEL_OPTIONS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </SelectField>
            </Field>
          </div>

          <Field label="Welcome message" hint="The first message a visitor sees.">
            <TextArea
              value={chatbot.welcome}
              onChange={(e) => update({ welcome: e.target.value })}
              rows={3}
            />
          </Field>

          <div className="flex items-start gap-3 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3">
            <KeyRound className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" />
            <p className="text-xs leading-relaxed text-zinc-500">
              The Gemini API key is read from the <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-zinc-700">GEMINI_API_KEY</code>{" "}
              environment variable on the server — it is never exposed to visitors. If the key is missing, the
              assistant falls back to its offline rule-based knowledge so the site always stays useful.
            </p>
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} icon={<Save className="h-4 w-4" />}>
          {saving ? "Saving…" : "Save Chatbot Settings"}
        </Button>
      </div>
    </div>
  )
}