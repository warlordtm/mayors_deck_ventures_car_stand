"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, Calendar, MapPin, Car, Loader2 } from "lucide-react"
import Link from "next/link"

function SuccessContent() {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get("bookingId")
  const [booking, setBooking] = useState<any>(null)

  useEffect(() => {
    if (bookingId) {
      loadBooking()
    }
  }, [bookingId])

  const loadBooking = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("test_drive_bookings")
        .select(`
          *,
          car:cars(id, name, model, year)
        `)
        .eq("id", bookingId)
        .single()

      if (error) throw error
      setBooking(data)
    } catch (err) {
      console.error("[v0] Error loading booking:", err)
    }
  }

  if (!booking) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-white" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <Card className="mx-auto max-w-2xl border-white/10 bg-zinc-950/50 backdrop-blur">
        <CardContent className="p-12 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
          </div>

          <h1 className="mb-4 font-display text-4xl font-bold text-white">Booking Confirmed!</h1>
          <p className="mb-8 text-lg text-zinc-400">
            Your test drive has been confirmed and payment processed successfully.
          </p>

          <div className="mb-8 space-y-4 rounded-lg border border-white/10 bg-black/30 p-6 text-left">
            <div className="flex items-start gap-3">
              <Car className="mt-1 h-5 w-5 text-zinc-400" />
              <div>
                <p className="text-sm text-zinc-500">Vehicle</p>
                <p className="font-semibold text-white">
                  {booking.car?.name} ({booking.car?.year})
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="mt-1 h-5 w-5 text-zinc-400" />
              <div>
                <p className="text-sm text-zinc-500">Scheduled For</p>
                <p className="font-semibold text-white">
                  {new Date(booking.booking_date).toLocaleDateString()} at {booking.booking_time}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="mt-1 h-5 w-5 text-zinc-400" />
              <div>
                <p className="text-sm text-zinc-500">Location</p>
                <p className="font-semibold text-white">{booking.location}</p>
              </div>
            </div>
          </div>

          <div className="mb-6 rounded-lg border border-blue-800 bg-blue-950/50 p-4">
            <p className="text-sm text-blue-300">
              A confirmation email has been sent to {booking.customer_email}. Our team will contact you shortly with
              additional details.
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <Button asChild className="bg-white text-black hover:bg-zinc-200">
              <Link href="/">Return Home</Link>
            </Button>
            <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
              <Link href="/cars">Browse More Cars</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-20 text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-white" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  )
}
