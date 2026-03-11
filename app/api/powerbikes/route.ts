import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured') === 'true'
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : null
    const category = searchParams.get('category')

    const supabase = await createClient()

    let query = supabase
      .from("powerbikes")
      .select(`
        *,
        category:categories(*),
        images:powerbike_images(*)
      `)
      .eq("status", "available")

    if (featured) {
      query = query.eq("is_featured", true)
    }

    if (category) {
      query = query.eq("category_id", category)
    }

    query = query.order("created_at", { ascending: false })

    if (limit) {
      query = query.limit(limit)
    }

    const { data: powerbikes, error } = await query

    if (error) {
      console.error("Error fetching powerbikes:", error)
      return NextResponse.json({ error: "Failed to fetch powerbikes" }, { status: 500 })
    }

    return NextResponse.json({ powerbikes })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
