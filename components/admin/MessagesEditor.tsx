"use client"

import { useState, useEffect } from "react"
import { showToast } from "@/components/admin/Toast"
import { Inbox, Trash2, Mail, RefreshCw } from "lucide-react"
import {
  Button,
  EmptyState,
  Badge,
  ConfirmDialog,
} from "@/components/admin/ui"

interface Submission {
  id: string
  name: string
  email: string
  subject: string
  message: string
  created_at: string
}

export default function MessagesEditor() {
  const [items, setItems] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<Submission | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/contact")
      const data = await res.json()
      setItems(Array.isArray(data) ? data : [])
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const confirmDelete = async () => {
    if (!deleting) return
    try {
      const res = await fetch(`/api/contact?id=${encodeURIComponent(deleting.id)}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Delete failed")
      setItems((prev) => prev.filter((i) => i.id !== deleting.id))
      setDeleting(null)
      showToast("Message deleted", "success")
    } catch {
      showToast("Failed to delete message", "error")
    }
  }

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    } catch {
      return iso
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

  return (
    <div className="space-y-6">
      {items.length === 0 ? (
        <EmptyState
          icon={<Inbox className="h-5 w-5" />}
          title="No messages yet"
          description="Messages submitted through the contact form on your site will appear here."
        />
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge tone="gray">{items.length} message{items.length === 1 ? "" : "s"}</Badge>
            <Button variant="secondary" onClick={load} icon={<RefreshCw className="h-4 w-4" />}>
              Refresh
            </Button>
          </div>
          {items.map((item) => (
            <div key={item.id} className="rounded-lg border border-zinc-200 bg-white shadow-sm">
              <div className="flex flex-wrap items-center gap-2 border-b border-zinc-100 px-4 py-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-900">
                  <Mail className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-zinc-900">
                    {item.name} <span className="font-normal text-zinc-500">· {item.subject}</span>
                  </p>
                  <p className="truncate text-xs text-zinc-500">
                    {item.email} · {formatDate(item.created_at)}
                  </p>
                </div>
                <button
                  onClick={() => setDeleting(item)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                  aria-label={`Delete message from ${item.name}`}
                  title="Delete message"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <p className="whitespace-pre-wrap px-4 py-3 text-sm leading-relaxed text-zinc-700">
                {item.message}
              </p>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={deleting !== null}
        title="Delete this message?"
        message={`This will permanently remove the message from ${deleting?.name ?? "this sender"}. You can't undo this.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  )
}