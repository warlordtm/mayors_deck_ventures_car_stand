import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { headers } from "next/headers"

export async function POST(request: Request) {
  const supabase = await createClient()
  await supabase.auth.signOut()

  // Get headers to determine the correct domain
  const headersList = await headers()
  const host = headersList.get('host') || 'localhost:3000'
  const protocol = headersList.get('x-forwarded-proto') || 'http'

  // For Vercel, use the production URL
  const baseUrl = host.includes('vercel.app') ? `https://${host}` : `${protocol}://${host}`

  // Redirect to login page after sign out
  return NextResponse.redirect(new URL("/login", baseUrl))
}
