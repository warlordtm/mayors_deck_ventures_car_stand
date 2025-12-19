"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import type { TestDriveBooking } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, Calendar, MapPin, Car, Loader2 } from "lucide-react"
import Link from "next/link"

function SuccessContent() {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get("bookingId")
  const [booking, setBooking] = useState<TestDriveBooking | null>(null)

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
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <Card className="mx-auto max-w-2xl border-border bg-card/50 backdrop-blur">
        <CardContent className="p-12 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
          </div>

          <h1 className="mb-4 font-display text-4xl font-bold text-foreground">Booking Confirmed!</h1>
          <p className="mb-8 text-lg text-muted-foreground">
            Your test drive has been confirmed and payment processed successfully.
          </p>

          <div className="mb-8 space-y-4 rounded-lg border border-border bg-card/30 p-6 text-left">
            <div className="flex items-start gap-3">
              <Car className="mt-1 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Vehicle</p>
                <p className="font-semibold text-foreground">
                  {booking.car?.name} ({booking.car?.year})
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="mt-1 h-5 w-5 text-zinc-400" />
              <div>
                <p className="text-sm text-muted-foreground">Scheduled For</p>
                <p className="font-semibold text-foreground">
                  {new Date(booking.booking_date).toLocaleDateString()} at {booking.booking_time}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="mt-1 h-5 w-5 text-zinc-400" />
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-semibold text-foreground">{booking.location}</p>
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
            <Button asChild variant="outline" className="border-border text-foreground hover:bg-white/10 bg-transparent">
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
