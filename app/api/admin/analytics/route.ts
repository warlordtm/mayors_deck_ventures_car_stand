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

    // Get total cars
    const { count: totalCars } = await supabase
      .from("cars")
      .select("*", { count: "exact", head: true })

    // Get available cars
    const { count: availableCars } = await supabase
      .from("cars")
      .select("*", { count: "exact", head: true })
      .eq("status", "available")

    // Get total bookings
    const { count: totalBookings } = await supabase
      .from("test_drive_bookings")
      .select("*", { count: "exact", head: true })

    // Get pending bookings
    const { count: pendingBookings } = await supabase
      .from("test_drive_bookings")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending")

    // Get total revenue
    const { data: revenueData } = await supabase
      .from("test_drive_bookings")
      .select("payment_amount")
      .eq("payment_status", "paid")

    const totalRevenue = revenueData?.reduce((sum, booking) => sum + (booking.payment_amount || 0), 0) || 0

    // Get bookings by month (last 12 months)
    const { data: monthlyBookings } = await supabase
      .from("test_drive_bookings")
      .select("created_at")
      .gte("created_at", new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString())

    const monthlyCount: { [key: string]: number } = {}
    monthlyBookings?.forEach(booking => {
      const month = new Date(booking.created_at).toISOString().slice(0, 7) // YYYY-MM
      monthlyCount[month] = (monthlyCount[month] || 0) + 1
    })

    const monthlyBookingsArray = Object.entries(monthlyCount)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, count]) => ({ month, count }))

    // Get top categories (simplified)
    const { data: categoryData } = await supabase
      .from("categories")
      .select("id, name")

    const categoryStats: { name: string; count: number }[] = []
    for (const category of categoryData || []) {
      const { count } = await supabase
        .from("cars")
        .select("*", { count: "exact", head: true })
        .eq("category_id", category.id)

      categoryStats.push({
        name: category.name,
        count: count || 0
      })
    }
    categoryStats.sort((a, b) => b.count - a.count)

    // Get booking status distribution
    const { data: statusStats } = await supabase
      .from("test_drive_bookings")
      .select("status")

    const statusCount: { [key: string]: number } = {}
    statusStats?.forEach(booking => {
      statusCount[booking.status] = (statusCount[booking.status] || 0) + 1
    })

    return NextResponse.json({
      overview: {
        totalCars: totalCars || 0,
        availableCars: availableCars || 0,
        totalBookings: totalBookings || 0,
        pendingBookings: pendingBookings || 0,
        totalRevenue,
      },
      monthlyBookings: monthlyBookings || [],
      categoryStats: categoryStats || [],
      statusStats: Object.entries(statusCount).map(([status, count]) => ({ status, count })),
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}