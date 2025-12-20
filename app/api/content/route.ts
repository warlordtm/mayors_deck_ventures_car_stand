import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: contentBlocks, error } = await supabase
      .from("content_blocks")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })

    if (error) {
      console.error("Error fetching content blocks:", error)
      return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 })
    }

    return NextResponse.json({ contentBlocks })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}