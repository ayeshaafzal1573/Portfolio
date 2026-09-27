import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { SESSION_COOKIE, isAdminAuthConfigured, verifySessionToken } from "@/lib/admin-auth"

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const authEnabled = isAdminAuthConfigured()

  if (authEnabled) {
    const token = (await cookies()).get(SESSION_COOKIE)?.value
    if (!(await verifySessionToken(token))) redirect("/admin/login")
  }

  if (!authEnabled) {
    return (
      <>
        <div className="sticky top-0 z-50 bg-amber-400 px-4 py-2 text-center text-xs font-semibold text-zinc-900">
          Admin auth is not configured — this panel is publicly reachable. Set{" "}
          <code className="font-mono">ADMIN_PASSWORD</code> and{" "}
          <code className="font-mono">ADMIN_SESSION_SECRET</code> in your environment.
        </div>
        {children}
      </>
    )
  }

  return children
}
