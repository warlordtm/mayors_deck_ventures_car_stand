import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const { data: inquiries, error } = await supabase
      .from("inquiries")
      .select(`
        *,
        car:cars(name),
        customer:customers(name, email)
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching inquiries:", error)
      return NextResponse.json({ error: "Failed to fetch inquiries" }, { status: 500 })
    }

    return NextResponse.json({ inquiries })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}