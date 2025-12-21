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
    console.log("POST /api/admin/cars - Starting car creation")
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    console.log("User authenticated:", user?.id)

    if (!user) {
      console.log("No user found - returning 401")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    console.log("Profile query result:", { profile, profileError })

    if (!profile || profile.role !== "admin") {
      console.log("Profile check failed - profile:", profile, "role:", profile?.role)
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    console.log("Admin access granted")

    let payload: any
    if (request.headers.get('content-type')?.includes('multipart/form-data')) {
      const formData = await request.formData()
      payload = {}
      for (const [key, value] of formData.entries()) {
        if (key === 'images') {
          if (!payload.images) payload.images = []
          payload.images.push(value)
        } else {
          payload[key] = value
        }
      }
    } else {
      payload = await request.json()
    }

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

    // Handle images
    if (payload.images && payload.images.length > 0) {
      const imageInserts = []
      for (let i = 0; i < payload.images.length; i++) {
        const file = payload.images[i] as File
        const fileExt = file.name.split('.').pop()
        const fileName = `${crypto.randomUUID()}.${fileExt}`
        const { error: uploadError } = await supabase.storage.from('car-images').upload(fileName, file)
        if (uploadError) {
          console.error("Error uploading image:", uploadError)
          continue
        }
        const { data: { publicUrl } } = supabase.storage.from('car-images').getPublicUrl(fileName)
        imageInserts.push({
          car_id: data.id,
          image_url: publicUrl,
          is_primary: i === 0,
          display_order: i
        })
      }
      if (imageInserts.length > 0) {
        const { error: imageError } = await supabase.from("car_images").insert(imageInserts)
        if (imageError) {
          console.error("Error creating car images:", imageError)
        }
      }
    }

    // Log activity
    await supabase.from("activity_logs").insert({
      admin_id: user.id,
      action: `Created car: ${data.name}`,
      details: { car_id: data.id }
    })

    return NextResponse.json({ car: data })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
