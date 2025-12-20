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

    const updateObj: any = {
      name: payload.name,
      slug: payload.slug || null,
      model: payload.model || null,
      year: payload.year || null,
      category_id: payload.category_id || null,
      brand: payload.brand || null,
      price: payload.price || null,
      show_price: payload.show_price ?? true,
      description: payload.description || null,
      status: payload.status || "available",
      is_featured: payload.is_featured ?? false,
      updated_at: new Date().toISOString(),
    }

    // If a slug is provided, ensure it's unique (case-insensitive) excluding current car
    if (payload.slug) {
      const { data: existing } = await supabase
        .from("cars")
        .select("id")
        .ilike("slug", payload.slug)
        .neq("id", params.id)
        .limit(1)

      if (existing && existing.length > 0) {
        return NextResponse.json({ error: "Slug already in use" }, { status: 409 })
      }
    }

    const { data, error } = await supabase.from("cars").update(updateObj).eq("id", params.id).select().single()

    if (error) {
      console.error("Error updating car:", error)
      return NextResponse.json({ error: "Failed to update car" }, { status: 500 })
    }

    return NextResponse.json({ car: data })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, context: any) {
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

    const { error } = await supabase.from("cars").delete().eq("id", params.id)

    if (error) {
      console.error("Error deleting car:", error)
      return NextResponse.json({ error: "Failed to delete car" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
