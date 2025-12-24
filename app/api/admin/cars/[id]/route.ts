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

    let payload: any
    if (request.headers.get('content-type')?.includes('multipart/form-data')) {
      const formData = await request.formData()
      payload = {}
      for (const [key, value] of formData.entries()) {
        if (key === 'images') {
          if (!payload.images) payload.images = []
          payload.images.push(value)
        } else if (key === 'video') {
          payload.video = value
        } else {
          payload[key] = value
        }
      }
    } else {
      payload = await request.json()
    }

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

    // Handle video
    if (payload.video) {
      const videoFile = payload.video as File
      const fileExt = videoFile.name.split('.').pop()
      const fileName = `${crypto.randomUUID()}.${fileExt}`
      const { error: uploadError } = await supabase.storage.from('car-videos').upload(fileName, videoFile)
      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage.from('car-videos').getPublicUrl(fileName)
        updateObj.video_url = publicUrl
      } else {
        console.error("Error uploading video:", uploadError)
      }
    }

    // Handle images: delete existing and insert new
    const { error: deleteError } = await supabase.from("car_images").delete().eq("car_id", params.id)
    if (deleteError) {
      console.error("Error deleting car images:", deleteError)
    }

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
          car_id: params.id,
          image_url: publicUrl,
          is_primary: i === 0,
          display_order: i
        })
      }
      if (imageInserts.length > 0) {
        const { error: imageError } = await supabase.from("car_images").insert(imageInserts)
        if (imageError) {
          console.error("Error updating car images:", imageError)
        }
      }
    }

    // Log activity
    await supabase.from("activity_logs").insert({
      admin_id: user.id,
      action: `Updated car: ${data.name}`,
      details: { car_id: data.id }
    })

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

    // Get car name before deleting
    const { data: car } = await supabase.from("cars").select("name").eq("id", params.id).single()

    const { error } = await supabase.from("cars").delete().eq("id", params.id)

    if (error) {
      console.error("Error deleting car:", error)
      return NextResponse.json({ error: "Failed to delete car" }, { status: 500 })
    }

    // Log activity
    await supabase.from("activity_logs").insert({
      admin_id: user.id,
      action: `Deleted car: ${car?.name || 'Unknown'}`,
      details: { car_id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
