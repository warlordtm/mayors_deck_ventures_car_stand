import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function PUT(request: Request, context: any) {
  const { params } = context as { params: { id: string } }
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

    const payload = await request.json()

    const { data, error } = await supabase
      .from("inquiries")
      .update({ status: payload.status })
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating inquiry:", error)
      return NextResponse.json({ error: "Failed to update inquiry" }, { status: 500 })
    }

    // Log activity
    await supabase.from("activity_logs").insert({
      admin_id: user.id,
      action: `Updated inquiry status to ${payload.status}`,
      details: { inquiry_id: params.id }
    })

    return NextResponse.json({ inquiry: data })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}