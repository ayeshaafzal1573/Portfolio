export const SESSION_COOKIE = "portfolio_admin_session"
export const SESSION_TTL_MS = 1000 * 60 * 60 * 12

const encoder = new TextEncoder()

export function isAdminAuthConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET)
}

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not set")
  return secret
}

function toBase64Url(bytes: ArrayBuffer): string {
  let binary = ""
  for (const byte of new Uint8Array(bytes)) {
    binary += String.fromCharCode(byte)
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

async function hmac(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  )
  return toBase64Url(await crypto.subtle.sign("HMAC", key, encoder.encode(payload)))
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return diff === 0
}

export async function verifyPassword(candidate: string): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) return false
  return constantTimeEqual(await hmac(candidate), await hmac(expected))
}

export async function createSessionToken(now: number = Date.now()): Promise<string> {
  const expiresAt = now + SESSION_TTL_MS
  return `${expiresAt}.${await hmac(String(expiresAt))}`
}

export async function verifySessionToken(token: string | undefined, now: number = Date.now()): Promise<boolean> {
  if (!token || !process.env.ADMIN_SESSION_SECRET) return false
  const separator = token.lastIndexOf(".")
  if (separator < 1) return false

  const expiresAt = Number(token.slice(0, separator))
  const signature = token.slice(separator + 1)
  if (!Number.isFinite(expiresAt) || expiresAt <= now) return false
  if (!constantTimeEqual(signature, await hmac(String(expiresAt)))) return false
  return true
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  }
}
