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

    const { data: adminUser } = await supabase
      .from("admin_users")
      .select("*")
      .eq("id", user.id)
      .single()

    if (!adminUser) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const { data: contentBlocks, error } = await supabase
      .from("content_blocks")
      .select("*")
      .order("display_order", { ascending: true })

    if (error) {
      console.error("Error fetching content blocks:", error)
      return NextResponse.json({ error: "Failed to fetch content blocks" }, { status: 500 })
    }

    return NextResponse.json({ contentBlocks })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: adminUser } = await supabase
      .from("admin_users")
      .select("*")
      .eq("id", user.id)
      .single()

    if (!adminUser) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const { key, title, content, image_url, display_order, is_active } = await request.json()

    if (!key) {
      return NextResponse.json({ error: "Key is required" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("content_blocks")
      .insert({
        key,
        title,
        content,
        image_url,
        display_order: display_order || 0,
        is_active: is_active ?? true,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating content block:", error)
      return NextResponse.json({ error: "Failed to create content block" }, { status: 500 })
    }

    return NextResponse.json({ contentBlock: data })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}