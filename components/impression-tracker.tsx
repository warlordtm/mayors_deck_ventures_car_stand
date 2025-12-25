"use client"

import { useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

interface ImpressionTrackerProps {
  carId: string
  pageSource?: string
}

export function ImpressionTracker({ carId, pageSource = "detail" }: ImpressionTrackerProps) {
  useEffect(() => {
    const trackImpression = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        // Generate a session ID for anonymous users
        const sessionId = user ? null : `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

        await supabase.from("car_impressions").insert({
          car_id: carId,
          user_id: user?.id || null,
          session_id: sessionId,
          page_source: pageSource
        })
      } catch (error) {
        // Silently fail - don't disrupt user experience
        console.error("Failed to track impression:", error)
      }
    }

    // Track impression on component mount
    trackImpression()
  }, [carId, pageSource])

  return null // This component doesn't render anything
}