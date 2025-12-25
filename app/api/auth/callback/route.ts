import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  // Handle Supabase auth callbacks
  const supabase = await createClient()

  try {
    // Try to get the session
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error) {
      console.error('Auth callback error:', error)
      // Redirect to login page with error
      return NextResponse.redirect(new URL('/login?error=auth_callback_failed', request.url))
    }

    if (session) {
      // User is authenticated, check their role and redirect appropriately
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single()

      const redirectUrl = profile?.role === 'admin'
        ? '/admin/dashboard'
        : '/favorites'

      return NextResponse.redirect(new URL(redirectUrl, request.url))
    } else {
      // No session, redirect to login
      return NextResponse.redirect(new URL('/login', request.url))
    }
  } catch (error) {
    console.error('Auth callback handling error:', error)
    return NextResponse.redirect(new URL('/login?error=auth_error', request.url))
  }
}

export async function GET(request: Request) {
  // Handle GET requests by checking for auth session
  const supabase = await createClient()

  try {
    const { data: { session } } = await supabase.auth.getSession()

    if (session) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single()

      const redirectUrl = profile?.role === 'admin'
        ? '/admin/dashboard'
        : '/favorites'

      return NextResponse.redirect(new URL(redirectUrl, request.url))
    }

    return NextResponse.redirect(new URL('/login', request.url))
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}