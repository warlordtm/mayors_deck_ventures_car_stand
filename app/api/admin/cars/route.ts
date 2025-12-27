import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

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

    console.log("Admin access granted")

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

    // Basic validation
    if (!payload.name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    if (!payload.category_id) {
      return NextResponse.json({ error: "Category is required" }, { status: 400 })
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
      return NextResponse.json({ error: `Failed to create car: ${error.message}` }, { status: 500 })
    }

    // Handle video
    if (payload.video && payload.video.name) {
      try {
        const videoFile = payload.video as File
        console.log("Uploading video:", videoFile.name, videoFile.size)
        const fileExt = videoFile.name.split('.').pop()
        const fileName = `${crypto.randomUUID()}.${fileExt}`
        const { error: uploadError } = await supabase.storage.from('car-videos').upload(fileName, videoFile)
        if (uploadError) {
          console.error("Video upload error:", uploadError)
        } else {
          const { data: { publicUrl } } = supabase.storage.from('car-videos').getPublicUrl(fileName)
          console.log("Video uploaded successfully:", publicUrl)
          await supabase.from("cars").update({ video_url: publicUrl }).eq("id", data.id)
        }
      } catch (videoErr) {
        console.error("Video processing error:", videoErr)
      }
    }

    // Handle images
    if (payload.images && payload.images.length > 0) {
      console.log("Processing", payload.images.length, "images")
      const imageInserts = []
      for (let i = 0; i < payload.images.length; i++) {
        try {
          const file = payload.images[i] as File
          console.log(`Uploading image ${i + 1}:`, file.name, file.size)
          const fileExt = file.name.split('.').pop()
          const fileName = `${crypto.randomUUID()}.${fileExt}`
          const { error: uploadError } = await supabase.storage.from('car-images').upload(fileName, file)
          if (uploadError) {
            console.error(`Image ${i + 1} upload error:`, uploadError)
            continue
          }
          const { data: { publicUrl } } = supabase.storage.from('car-images').getPublicUrl(fileName)
          console.log(`Image ${i + 1} uploaded:`, publicUrl)
          imageInserts.push({
            car_id: data.id,
            image_url: publicUrl,
            is_primary: i === 0,
            display_order: i
          })
        } catch (imgErr) {
          console.error(`Image ${i + 1} processing error:`, imgErr)
        }
      }
      if (imageInserts.length > 0) {
        console.log("Inserting", imageInserts.length, "image records")
        const { error: imageError } = await supabase.from("car_images").insert(imageInserts)
        if (imageError) {
          console.error("Error creating car images:", imageError)
        } else {
          console.log("Images inserted successfully")
        }
      }
    }

    // Log activity (temporarily disabled for testing)
    // await supabase.from("activity_logs").insert({
    //   admin_id: user.id,
    //   action: `Created car: ${data.name}`,
    //   details: { car_id: data.id }
    // })

    // Revalidate the collection page to reflect new car
    revalidatePath('/cars')
    revalidatePath('/')

    return NextResponse.json({ car: data })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
