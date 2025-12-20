import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const {
      car_id,
      customer_name,
      customer_email,
      customer_phone,
      booking_date,
      booking_time,
      location,
      notes,
    } = body || {}

    if (!car_id || !customer_name || !customer_phone || !booking_date || !booking_time || !location) {
      return NextResponse.json({ error: "Missing required booking fields" }, { status: 400 })
    }

    const supabase = await createClient()

    // Check car exists and is available
    const { data: car, error: carError } = await supabase.from("cars").select("id, status").eq("id", car_id).single()
    if (carError || !car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 })
    }
    if (car.status !== "available") {
      return NextResponse.json({ error: "Selected car is not available" }, { status: 400 })
    }

    // Get site test drive fee (server-side canonical value)
    const { data: settings } = await supabase.from("site_settings").select("value").eq("key", "test_drive_fee").single()
    const testDriveFee = settings?.value ? Number.parseFloat(settings.value) : 99.99

    // Insert booking server-side to ensure integrity
    const { data: booking, error: insertError } = await supabase
      .from("test_drive_bookings")
      .insert({
        car_id,
        customer_name,
        customer_email,
        customer_phone,
        booking_date,
        booking_time,
        location,
        notes,
        payment_amount: testDriveFee,
        payment_status: "pending",
        status: "pending",
      })
      .select()
      .single()

    if (insertError || !booking) {
      console.error("[v0] booking insert error:", insertError)
      return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
    }

    return NextResponse.json({ booking }, { status: 201 })
  } catch (err) {
    console.error("[v0] create booking error:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
