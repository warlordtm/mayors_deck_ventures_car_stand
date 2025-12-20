import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: siteSettings, error } = await supabase
      .from("site_settings")
      .select("*")

    if (error) {
      console.error("Error fetching site settings:", error)
      return NextResponse.json({ error: "Failed to fetch site settings" }, { status: 500 })
    }

    // Convert to key-value object
    const settings: Record<string, string | null> = {}
    siteSettings.forEach(setting => {
      settings[setting.key] = setting.value
    })

    return NextResponse.json({ settings })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient()

    // Check admin authentication
    const { data: { user } } = await supabase.auth.getUser()
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

    const updates = await request.json()

    // Update each setting
    for (const [key, value] of Object.entries(updates)) {
      const { error } = await supabase
        .from("site_settings")
        .upsert({ key, value: value as string }, { onConflict: "key" })

      if (error) {
        console.error(`Error updating setting ${key}:`, error)
        return NextResponse.json({ error: `Failed to update ${key}` }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}