"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export default function AdminHeader() {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)

  const handleSignOut = async () => {
    setLoading(true)
    try {
      // Sign out from Supabase
      await supabase.auth.signOut()

      // Double-check the session is cleared
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        // Full page reload to /login avoids Vercel 405
        window.location.assign("/login")
      }
    } catch (error) {
      console.error("Error signing out:", error)
      setLoading(false)
    }
  }

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </div>
        <button
          onClick={handleSignOut}
          disabled={loading}
          className="px-4 py-2 bg-red-500 text-white cursor-pointer rounded hover:bg-red-600 disabled:opacity-50"
        >
          {loading ? "Signing Out..." : "Sign Out"}
        </button>
      </div>
    </header>
  )
}
