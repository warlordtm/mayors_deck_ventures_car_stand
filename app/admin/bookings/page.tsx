import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { TestDriveBooking } from "@/lib/types"
import { Calendar, MapPin, Phone, Mail, Car } from "lucide-react"

export default async function AdminBookingsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const { data: adminUser } = await supabase.from("admin_users").select("*").eq("id", user.id).single()

  if (!adminUser) {
    redirect("/admin/login")
  }

  const { data: bookings } = await supabase
    .from("test_drive_bookings")
    .select(`
      *,
      car:cars(id, name, model, year)
    `)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-white">Test Drive Bookings</h1>
            <p className="text-zinc-400">View and manage customer test drive requests</p>
          </div>
          <Button asChild variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 bg-transparent">
            <Link href="/admin">Back to Dashboard</Link>
          </Button>
        </div>

        {bookings && bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking: TestDriveBooking) => (
              <Card key={booking.id} className="border-zinc-800 bg-zinc-950/50 backdrop-blur">
                <CardContent className="p-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <div className="mb-4 flex items-start justify-between">
                        <div>
                          <h3 className="mb-1 text-lg font-bold text-white">{booking.customer_name}</h3>
                          <div className="flex gap-2">
                            <Badge
                              className={`capitalize ${
                                booking.status === "pending"
                                  ? "bg-yellow-500"
                                  : booking.status === "confirmed"
                                    ? "bg-blue-500"
                                    : booking.status === "completed"
                                      ? "bg-green-500"
                                      : "bg-red-500"
                              }`}
                            >
                              {booking.status}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={`capitalize ${
                                booking.payment_status === "paid"
                                  ? "border-green-500 text-green-400"
                                  : "border-zinc-700 text-zinc-400"
                              }`}
                            >
                              {booking.payment_status}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-zinc-300">
                          <Phone className="h-4 w-4 text-zinc-500" />
                          <a href={`tel:${booking.customer_phone}`} className="hover:text-white">
                            {booking.customer_phone}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-300">
                          <Mail className="h-4 w-4 text-zinc-500" />
                          <a href={`mailto:${booking.customer_email}`} className="hover:text-white">
                            {booking.customer_email}
                          </a>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="space-y-3 text-sm">
                        {booking.car && (
                          <div className="flex items-start gap-2">
                            <Car className="mt-0.5 h-4 w-4 text-zinc-500" />
                            <div>
                              <p className="text-zinc-500">Vehicle</p>
                              <p className="font-semibold text-white">
                                {booking.car.name} ({booking.car.year})
                              </p>
                            </div>
                          </div>
                        )}
                        <div className="flex items-start gap-2">
                          <Calendar className="mt-0.5 h-4 w-4 text-zinc-500" />
                          <div>
                            <p className="text-zinc-500">Date & Time</p>
                            <p className="font-semibold text-white">
                              {new Date(booking.booking_date).toLocaleDateString()} at {booking.booking_time}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="mt-0.5 h-4 w-4 text-zinc-500" />
                          <div>
                            <p className="text-zinc-500">Location</p>
                            <p className="font-semibold text-white">{booking.location}</p>
                          </div>
                        </div>
                        {booking.payment_amount && (
                          <div>
                            <p className="text-zinc-500">Booking Fee</p>
                            <p className="font-semibold text-white">${booking.payment_amount.toFixed(2)}</p>
                          </div>
                        )}
                        {booking.notes && (
                          <div>
                            <p className="text-zinc-500">Notes</p>
                            <p className="text-white">{booking.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2 border-t border-zinc-800 pt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-zinc-700 text-zinc-300 bg-transparent"
                      asChild
                    >
                      <Link href={`/admin/bookings/${booking.id}`}>View Details</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-zinc-800 bg-zinc-950/50 backdrop-blur">
            <CardContent className="p-12 text-center">
              <p className="text-xl text-zinc-400">No bookings yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
