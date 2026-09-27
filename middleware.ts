import { NextResponse, type NextRequest } from "next/server"
import { SESSION_COOKIE, verifySessionToken } from "@/lib/admin-auth"

const PUBLIC_API_ROUTES = new Set(["/api/contact", "/api/chat", "/api/admin-auth"])

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (PUBLIC_API_ROUTES.has(pathname)) return NextResponse.next()

  const isRead = request.method === "GET" || request.method === "HEAD"
  if (isRead) return NextResponse.next()

  const session = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value)
  if (session) return NextResponse.next()

  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}

export const config = {
  matcher: "/api/:path*",
}
