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