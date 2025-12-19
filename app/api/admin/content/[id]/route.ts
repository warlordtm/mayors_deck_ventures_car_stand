import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const { data, error } = await supabase
      .from("content_blocks")
      .select("*")
      .eq("id", params.id)
      .single()

    if (error) {
      console.error("Error fetching content block:", error)
      return NextResponse.json({ error: "Content block not found" }, { status: 404 })
    }

    return NextResponse.json({ contentBlock: data })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const { data, error } = await supabase
      .from("content_blocks")
      .update({
        key,
        title,
        content,
        image_url,
        display_order,
        is_active,
      })
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating content block:", error)
      return NextResponse.json({ error: "Failed to update content block" }, { status: 500 })
    }

    return NextResponse.json({ contentBlock: data })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const { error } = await supabase
      .from("content_blocks")
      .delete()
      .eq("id", params.id)

    if (error) {
      console.error("Error deleting content block:", error)
      return NextResponse.json({ error: "Failed to delete content block" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}