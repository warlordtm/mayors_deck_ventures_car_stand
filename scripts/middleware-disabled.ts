import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Protect /admin routes by ensuring the user is signed in.
// This middleware checks for the Supabase access token cookie (sb-access-token).
// It does not validate admin role (the server pages/APIs still perform that check).

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Only handle admin paths
  if (!pathname.startsWith("/admin")) return NextResponse.next()

  // Allow the admin login page to be visited without redirect loop
  if (pathname === "/admin/login") return NextResponse.next()

  // If there is no Supabase access token cookie, redirect to admin login
  const token = req.cookies.get("sb-access-token")?.value
  if (!token) {
    const url = req.nextUrl.clone()
    url.pathname = "/admin/login"
    // preserve where the user wanted to go
    url.searchParams.set("from", pathname)
    return NextResponse.redirect(url)
  }

  // If a token exists, allow the request through. The server-side page will still
  // verify that the signed-in user is an admin in the `admin_users` table.
  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
