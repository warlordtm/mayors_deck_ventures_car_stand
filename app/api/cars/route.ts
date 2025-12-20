import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured') === 'true'
    const limit = parseInt(searchParams.get('limit') || '10')

    const supabase = await createClient()

    let query = supabase
      .from("cars")
      .select(`
        *,
        category:categories(*),
        images:car_images(*)
      `)
      .eq("status", "available")

    if (featured) {
      query = query.eq("is_featured", true)
    }

    const { data: cars, error } = await query
      .order("created_at", { ascending: false })
      .limit(limit)

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