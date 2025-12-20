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

    // Attempt to atomically reserve the car by changing its status from 'available' -> 'reserved'
    // This prevents concurrent requests from both creating bookings for the same car.
    const { data: updatedCars, error: updateError } = await supabase
      .from("cars")
      .update({ status: "reserved" })
      .eq("id", car_id)
      .eq("status", "available")
      .select()

    if (updateError) {
      console.error("[v0] car reserve error:", updateError)
      return NextResponse.json({ error: "Failed to reserve car" }, { status: 500 })
    }

    if (!updatedCars || updatedCars.length === 0) {
      // No rows updated means car wasn't available
      return NextResponse.json({ error: "Selected car is not available" }, { status: 400 })
    }

    // Get site test drive fee (server-side canonical value)
    const { data: settings } = await supabase.from("site_settings").select("value").eq("key", "test_drive_fee").single()
    const testDriveFee = settings?.value ? Number.parseFloat(settings.value) : 99.99

    // Insert booking server-side to ensure integrity
    try {
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
        // rollback: set car back to available
        await supabase.from("cars").update({ status: "available" }).eq("id", car_id)
        return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
      }

      return NextResponse.json({ booking }, { status: 201 })
    } catch (err) {
      console.error("[v0] create booking exception:", err)
      // rollback: set car back to available
      try {
        await supabase.from("cars").update({ status: "available" }).eq("id", car_id)
      } catch (rbErr) {
        console.error("[v0] rollback error:", rbErr)
      }
      return NextResponse.json({ error: "Server error" }, { status: 500 })
    }
  } catch (err) {
    console.error("[v0] create booking error:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
