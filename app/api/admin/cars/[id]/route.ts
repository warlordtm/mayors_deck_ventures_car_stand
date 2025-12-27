import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
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
      model: payload.model || null,
      year: payload.year || null,
      category_id: payload.category_id || null,
      brand: payload.brand || null,
      price: payload.price || null,
      show_price: payload.show_price ?? true,
      description: payload.description || null,
      status: payload.status || "available",
      is_featured: payload.is_featured ?? false,
      transmission: payload.transmission || null,
      fuel_type: payload.fuel_type || null,
      mileage: payload.mileage || null,
      condition: payload.condition || null,
      warranty: payload.warranty || null,
      location: payload.location || null,
      interior_features: payload.interior_features || null,
      exterior_features: payload.exterior_features || null,
      updated_at: new Date().toISOString(),
    }

    console.log("Updating car with data:", updateObj)
    const { data, error } = await supabase.from("cars").update(updateObj).eq("id", id).select().single()

    if (error) {
      console.error("Error updating car:", error)
      return NextResponse.json({ error: `Failed to update car: ${error.message}` }, { status: 500 })
    }

    console.log("Car updated successfully")

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
    const { error: deleteError } = await supabase.from("car_images").delete().eq("car_id", id)
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
          car_id: id,
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

    // Revalidate the collection page to reflect changes
    revalidatePath('/cars')
    revalidatePath('/')

    return NextResponse.json({ car: data })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    console.log("DELETE request for car ID:", id)
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    console.log("Auth user:", user?.id)
    if (!user) {
      console.log("No user found - returning 401")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    console.log("Profile lookup result:", { profile, profileError })
    if (!profile || profile.role !== "admin") {
      console.log("Profile check failed - profile:", profile, "role:", profile?.role)
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    console.log("Admin access granted")

    // Get car name before deleting
    const { data: car, error: carError } = await supabase.from("cars").select("name").eq("id", id).single()

    if (carError) {
      console.error("Error fetching car for deletion:", carError)
      return NextResponse.json({ error: "Car not found" }, { status: 404 })
    }

    console.log("Attempting to delete car:", car?.name)
    const { error } = await supabase.from("cars").delete().eq("id", id)

    if (error) {
      console.error("Error deleting car:", error)
      return NextResponse.json({ error: `Failed to delete car: ${error.message}` }, { status: 500 })
    }

    console.log("Car deleted successfully:", car?.name)

    // Log activity
    await supabase.from("activity_logs").insert({
      admin_id: user.id,
      action: `Deleted car: ${car?.name || 'Unknown'}`,
      details: { car_id: id }
    })

    // Revalidate the collection page to reflect changes
    revalidatePath('/cars')
    revalidatePath('/')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
