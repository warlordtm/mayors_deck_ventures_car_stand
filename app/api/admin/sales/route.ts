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

    const { data: sales, error } = await supabase
      .from("sales")
      .select(`
        *,
        car:cars(name),
        customer:customers(name)
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching sales:", error)
      return NextResponse.json({ error: "Failed to fetch sales" }, { status: 500 })
    }

    return NextResponse.json({ sales })
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

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const payload = await request.json()

    const insertObj: any = {
      car_id: payload.car_id || null,
      customer_id: payload.customer_id || null,
      sale_price: payload.sale_price,
      payment_method: payload.payment_method || null,
      sale_date: payload.sale_date || new Date().toISOString().split('T')[0],
    }

    const { data, error } = await supabase.from("sales").insert(insertObj).select().single()

    if (error) {
      console.error("Error creating sale:", error)
      return NextResponse.json({ error: "Failed to create sale" }, { status: 500 })
    }

    // Update car status to sold if car_id provided
    if (payload.car_id) {
      await supabase.from("cars").update({ status: "sold" }).eq("id", payload.car_id)
    }

    // Log activity
    await supabase.from("activity_logs").insert({
      admin_id: user.id,
      action: `Recorded sale: ₦${payload.sale_price}`,
      details: { sale_id: data.id, car_id: payload.car_id, customer_id: payload.customer_id }
    })

    return NextResponse.json({ sale: data })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}