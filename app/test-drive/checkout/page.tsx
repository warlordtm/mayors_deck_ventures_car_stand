"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import type { TestDriveBooking } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle2 } from "lucide-react"

function CheckoutForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const bookingId = searchParams.get("bookingId")

  const [loading, setLoading] = useState(false)
  const [booking, setBooking] = useState<TestDriveBooking | null>(null)
  const [error, setError] = useState<string | null>(null)

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
      setError("Failed to load booking details")
    }
  }

  const handlePayment = async () => {
    if (!booking) return

    setLoading(true)
    setError(null)

    try {
      // Create payment intent
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: booking.id,
          amount: booking.payment_amount,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Payment failed")
      }

      // Update booking status
      const supabase = createClient()
      await supabase
        .from("test_drive_bookings")
        .update({
          payment_status: "paid",
          status: "confirmed",
          stripe_payment_intent_id: data.paymentIntentId,
        })
        .eq("id", booking.id)

      router.push(`/test-drive/success?bookingId=${booking.id}`)
    } catch (err) {
      console.error("[v0] Payment error:", err)
      setError(err instanceof Error ? err.message : "Payment failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!bookingId) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-xl text-zinc-400">No booking found</p>
      </div>
    )
  }

  if (error && !booking) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-xl text-red-400">{error}</p>
      </div>
    )
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
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="mb-4 font-display text-4xl font-bold text-white md:text-5xl">Complete Payment</h1>
          <p className="text-lg text-zinc-400">Secure your test drive booking</p>
        </div>

        <Card className="border-white/10 bg-zinc-950/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Booking Summary</CardTitle>
            <CardDescription className="text-zinc-400">Review your test drive details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3 border-b border-zinc-800 pb-6">
              <div className="flex justify-between">
                <span className="text-zinc-400">Vehicle</span>
                <span className="font-semibold text-white">
                  {booking.car?.name} ({booking.car?.year})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Customer</span>
                <span className="font-semibold text-white">{booking.customer_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Date & Time</span>
                <span className="font-semibold text-white">
                  {new Date(booking.booking_date).toLocaleDateString()} at {booking.booking_time}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Location</span>
                <span className="font-semibold text-white">{booking.location}</span>
              </div>
            </div>

            <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
              <span className="text-lg font-semibold text-white">Test Drive Fee</span>
              <span className="text-2xl font-bold text-white">${booking.payment_amount?.toFixed(2)}</span>
            </div>

            {error && (
              <div className="rounded-lg border border-red-800 bg-red-950/50 p-4">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <div className="space-y-3">
              <Button
                onClick={handlePayment}
                disabled={loading || booking.payment_status === "paid"}
                className="w-full bg-white text-black hover:bg-zinc-200"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : booking.payment_status === "paid" ? (
                  <>
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    Payment Complete
                  </>
                ) : (
                  `Pay $${booking.payment_amount?.toFixed(2)}`
                )}
              </Button>

              <p className="text-center text-xs text-zinc-500">
                This fee is refundable upon vehicle purchase. Secure payment powered by Stripe.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-20 text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-white" />
        </div>
      }
    >
      <CheckoutForm />
    </Suspense>
  )
}
