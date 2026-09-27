import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { SESSION_COOKIE, isAdminAuthConfigured, verifySessionToken } from "@/lib/admin-auth"

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  if (isAdminAuthConfigured()) {
    const token = (await cookies()).get(SESSION_COOKIE)?.value
    if (!(await verifySessionToken(token))) redirect("/admin/login")
  }

  return children
}
