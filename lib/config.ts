// lib/config.ts - Types and API helper functions for the portfolio admin

// ============================================================
// API Helper Functions
// ============================================================

export async function fetchAPI<T>(url: string): Promise<T> {
  const resp = await fetch(url)
  if (!resp.ok) throw new Error(`Failed to fetch: ${resp.status}`)
  return resp.json()
}

export async function postAPI<T>(url: string, data: any): Promise<T> {
  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!resp.ok) throw new Error(`Failed to save: ${resp.status}`)
  return resp.json()
}

export async function putAPI<T>(url: string, data: any): Promise<T> {
  const resp = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!resp.ok) throw new Error(`Failed to update: ${resp.status}`)
  return resp.json()
}

export async function deleteAPI<T>(url: string): Promise<T> {
  const resp = await fetch(url, { method: "DELETE" })
  if (!resp.ok) throw new Error(`Failed to delete: ${resp.status}`)
  return resp.json()
}

// ============================================================
// Dispatch event for reactive updates
// ============================================================

export function dispatchConfigUpdate() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("portfolioConfigUpdated"))
  }
}
