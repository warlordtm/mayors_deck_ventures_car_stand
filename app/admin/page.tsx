import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, Calendar, DollarSign, Users } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  // Check if user is admin
  const { data: adminUser } = await supabase.from("admin_users").select("*").eq("id", user.id).single()

  if (!adminUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black p-6">
        <Card className="border-zinc-800 bg-zinc-950/50 backdrop-blur">
          <CardContent className="p-8 text-center">
            <h2 className="mb-4 text-2xl font-bold text-white">Access Denied</h2>
            <p className="text-zinc-400">You do not have admin permissions.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Get statistics
  const { count: totalCars } = await supabase.from("cars").select("*", { count: "exact", head: true })

  const { count: availableCars } = await supabase
    .from("cars")
    .select("*", { count: "exact", head: true })
    .eq("status", "available")

  const { count: pendingBookings } = await supabase
    .from("test_drive_bookings")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending")

  const { count: totalBookings } = await supabase
    .from("test_drive_bookings")
    .select("*", { count: "exact", head: true })

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-zinc-400">Welcome back, {adminUser.full_name || adminUser.email}</p>
          </div>
          <form action="/api/auth/signout" method="POST">
            <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 bg-transparent">
              Sign Out
            </Button>
          </form>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-zinc-800 bg-zinc-950/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">Total Cars</CardTitle>
              <Car className="h-4 w-4 text-zinc-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{totalCars || 0}</div>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-950/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">Available Cars</CardTitle>
              <DollarSign className="h-4 w-4 text-zinc-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{availableCars || 0}</div>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-950/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">Pending Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-zinc-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{pendingBookings || 0}</div>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-950/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">Total Bookings</CardTitle>
              <Users className="h-4 w-4 text-zinc-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{totalBookings || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-bold text-white">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Link href="/admin/cars">
              <Card className="border-zinc-800 bg-zinc-950/50 backdrop-blur transition-colors hover:bg-zinc-900/50">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                    <Car className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Manage Cars</h3>
                    <p className="text-sm text-zinc-400">Add, edit, or remove vehicles</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/bookings">
              <Card className="border-zinc-800 bg-zinc-950/50 backdrop-blur transition-colors hover:bg-zinc-900/50">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Test Drive Bookings</h3>
                    <p className="text-sm text-zinc-400">View and manage bookings</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/settings">
              <Card className="border-zinc-800 bg-zinc-950/50 backdrop-blur transition-colors hover:bg-zinc-900/50">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Settings</h3>
                    <p className="text-sm text-zinc-400">Configure site settings</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
