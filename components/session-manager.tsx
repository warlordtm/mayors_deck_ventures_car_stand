"use client"

import { useEffect, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

// Inactivity timeout: 30 minutes
const INACTIVITY_TIMEOUT = 30 * 60 * 1000
const CHECK_INTERVAL = 60 * 1000 // Check every minute

export function SessionManager() {
  const router = useRouter()
  const pathname = usePathname()
  const lastActivityRef = useRef(Date.now())
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Only run session checks on protected routes
    if (!pathname.startsWith("/admin") && !pathname.startsWith("/account") && !pathname.startsWith("/user")) {
      return
    }

    const resetActivity = () => {
      lastActivityRef.current = Date.now()
    }

    const checkInactivity = async () => {
      const now = Date.now()
      const timeSinceLastActivity = now - lastActivityRef.current

      if (timeSinceLastActivity >= INACTIVITY_TIMEOUT) {
        console.log("User inactive for 30 minutes, logging out")
        await handleLogout()
        return
      }
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

        // Check for inactivity
        await checkInactivity()

      } catch (error) {
        console.error("Session check failed:", error)
      }
    }

    const handleLogout = async () => {
      const supabase = createClient()
      await supabase.auth.signOut()

      if (pathname.startsWith("/admin")) {
        router.push("/admin/login?message=Session expired due to inactivity")
      } else {
        router.push("/login?message=Session expired due to inactivity")
      }
    }

    // Activity event listeners
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']

    const addActivityListeners = () => {
      events.forEach(event => {
        document.addEventListener(event, resetActivity, true)
      })
    }

    const removeActivityListeners = () => {
      events.forEach(event => {
        document.removeEventListener(event, resetActivity, true)
      })
    }

    // Initialize activity tracking
    resetActivity()
    addActivityListeners()

    // Check session immediately
    checkSession()

    // Set up interval to check session and inactivity periodically
    const interval = setInterval(checkSession, CHECK_INTERVAL)

    return () => {
      clearInterval(interval)
      removeActivityListeners()
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [pathname, router])

  return null // This component doesn't render anything
}

export default SessionManager