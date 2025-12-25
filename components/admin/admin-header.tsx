"use client"

import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function AdminHeader() {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    // Sign out the user from Supabase
    await supabase.auth.signOut()

    // Client-side redirect using Next.js router
    router.push("/login")
  }

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </div>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 bg-red-500 text-white rounded cursor-pointer hover:bg-red-600"
        >
          Sign Out
        </button>
      </div>
    </header>
  )
}
