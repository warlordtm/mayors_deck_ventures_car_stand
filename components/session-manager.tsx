"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

// Session timeout: 20 minutes
const SESSION_TIMEOUT = 20 * 60 * 1000
const CHECK_INTERVAL = 60 * 1000 // Check every minute

export function SessionManager() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Only run session checks on protected routes
    if (!pathname.startsWith("/admin") && !pathname.startsWith("/account") && !pathname.startsWith("/user")) {
      return
    }

    const checkSession = async () => {
      try {
        const supabase = createClient()
        const { data: { session }, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Session check error:", error)
          return
        }

        if (!session) {
          // No session, redirect to login
          handleLogout()
          return
        }

        // Check if session is expired based on expires_at
        const now = Date.now()
        const expiresAt = session.expires_at ? session.expires_at * 1000 : 0

        // If session is expired or will expire in next check, force logout
        if (!expiresAt || expiresAt - now < CHECK_INTERVAL) {
          console.log("Session expired or expiring soon, logging out")
          await supabase.auth.signOut()
          handleLogout()
          return
        }

      } catch (error) {
        console.error("Session check failed:", error)
      }
    }

    const handleLogout = () => {
      if (pathname.startsWith("/admin")) {
        router.push("/admin/login?message=Session expired")
      } else {
        router.push("/login?message=Session expired")
      }
    }

    // Check session immediately
    checkSession()

    // Set up interval to check session periodically
    const interval = setInterval(checkSession, CHECK_INTERVAL)

    return () => clearInterval(interval)
  }, [pathname, router])

  return null // This component doesn't render anything
}

export default SessionManager