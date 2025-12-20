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

    const { data: cars, error } = await supabase
      .from("cars")
      .select(`
        *,
        category:categories(*),
        images:car_images(*)
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching cars:", error)
      return NextResponse.json({ error: "Failed to fetch cars" }, { status: 500 })
    }

    return NextResponse.json({ cars })
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

    const payload = await request.json()

    // Basic validation
    if (!payload.name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    // If a slug is provided, ensure it's unique (case-insensitive)
    if (payload.slug) {
      const { data: existing } = await supabase
        .from("cars")
        .select("id")
        .ilike("slug", payload.slug)
        .limit(1)

      if (existing && existing.length > 0) {
        return NextResponse.json({ error: "Slug already in use" }, { status: 409 })
      }
    }

    const insertObj: any = {
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
    }

    const { data, error } = await supabase.from("cars").insert(insertObj).select().single()

    if (error) {
      console.error("Error creating car:", error)
      return NextResponse.json({ error: "Failed to create car" }, { status: 500 })
    }

    return NextResponse.json({ car: data })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
