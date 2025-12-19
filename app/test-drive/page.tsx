"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { Car } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, MapPin, DollarSign } from "lucide-react"

function TestDriveForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const carId = searchParams.get("carId")

  const [cars, setCars] = useState<Car[]>([])
  const [selectedCarId, setSelectedCarId] = useState<string>(carId || "")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    booking_date: "",
    booking_time: "",
    location: "",
    notes: "",
  })

  useEffect(() => {
    loadCars()
  }, [])

  const loadCars = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from("cars").select("id, name, model, year").eq("status", "available")

      if (error) throw error
      setCars(data || [])
    } catch (err) {
      console.error("[v0] Error loading cars:", err)
      setError("Failed to load available cars")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const supabase = createClient()

      // Get test drive fee from settings
      const { data: settings } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "test_drive_fee")
        .single()

      const testDriveFee = settings?.value ? Number.parseFloat(settings.value) : 99.99

      const { data: booking, error: insertError } = await supabase
        .from("test_drive_bookings")
        .insert({
          car_id: selectedCarId,
          ...formData,
          payment_amount: testDriveFee,
          payment_status: "pending",
          status: "pending",
        })
        .select()
        .single()

      if (insertError) throw insertError

      router.push(`/test-drive/checkout?bookingId=${booking.id}`)
    } catch (err) {
      console.error("[v0] Error submitting booking:", err)
      setError("Failed to submit booking. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="mb-12 text-center">
        <h1 className="mb-4 font-display text-4xl font-bold text-white md:text-5xl lg:text-6xl">Book a Test Drive</h1>
        <p className="text-lg text-zinc-400">Experience luxury with our premium agent-delivered test drive service</p>
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-3">
        {/* Info Cards */}
        <div className="space-y-4 lg:col-span-1">
          <Card className="border-white/10 bg-zinc-950/50 backdrop-blur">
            <CardContent className="p-6">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">Flexible Scheduling</h3>
              <p className="text-sm text-zinc-400">Choose your preferred date and time</p>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-zinc-950/50 backdrop-blur">
            <CardContent className="p-6">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">Your Location</h3>
              <p className="text-sm text-zinc-400">We bring the car to you</p>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-zinc-950/50 backdrop-blur">
            <CardContent className="p-6">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">Test Drive Fee</h3>
              <p className="text-sm text-zinc-400">$99.99 booking fee (refundable on purchase)</p>
            </CardContent>
          </Card>
        </div>

        {/* Booking Form */}
        <Card className="lg:col-span-2 border-white/10 bg-zinc-950/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Complete Your Booking</CardTitle>
            <CardDescription className="text-zinc-400">Fill in your details to reserve your test drive</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Select Car */}
              <div>
                <Label htmlFor="car" className="text-zinc-200">
                  Select Vehicle
                </Label>
                <select
                  id="car"
                  required
                  value={selectedCarId}
                  onChange={(e) => setSelectedCarId(e.target.value)}
                  className="mt-2 w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-white"
                  disabled={loading}
                >
                  <option value="">Choose a vehicle...</option>
                  {cars.map((car) => (
                    <option key={car.id} value={car.id}>
                      {car.name} ({car.year})
                    </option>
                  ))}
                </select>
              </div>

              {/* Personal Info */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="name" className="text-zinc-200">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    required
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    className="mt-2 border-zinc-800 bg-zinc-900 text-white"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-zinc-200">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={formData.customer_phone}
                    onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                    className="mt-2 border-zinc-800 bg-zinc-900 text-white"
                    placeholder="+1 (234) 567-8900"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-zinc-200">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.customer_email}
                  onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                  className="mt-2 border-zinc-800 bg-zinc-900 text-white"
                  placeholder="john@example.com"
                />
              </div>

              {/* Booking Details */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="date" className="text-zinc-200">
                    Preferred Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    required
                    value={formData.booking_date}
                    onChange={(e) => setFormData({ ...formData, booking_date: e.target.value })}
                    className="mt-2 border-zinc-800 bg-zinc-900 text-white"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div>
                  <Label htmlFor="time" className="text-zinc-200">
                    Preferred Time
                  </Label>
                  <Input
                    id="time"
                    type="time"
                    required
                    value={formData.booking_time}
                    onChange={(e) => setFormData({ ...formData, booking_time: e.target.value })}
                    className="mt-2 border-zinc-800 bg-zinc-900 text-white"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location" className="text-zinc-200">
                  Test Drive Location
                </Label>
                <Input
                  id="location"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="mt-2 border-zinc-800 bg-zinc-900 text-white"
                  placeholder="123 Main St, Beverly Hills, CA 90210"
                />
              </div>

              <div>
                <Label htmlFor="notes" className="text-zinc-200">
                  Additional Notes (Optional)
                </Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="mt-2 border-zinc-800 bg-zinc-900 text-white"
                  placeholder="Any special requests or preferences..."
                  rows={3}
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button
                type="submit"
                className="w-full bg-white text-black hover:bg-zinc-200"
                size="lg"
                disabled={submitting || !selectedCarId}
              >
                {submitting ? "Processing..." : "Continue to Payment"}
              </Button>

              <p className="text-center text-xs text-zinc-500">
                You will be redirected to secure payment after submitting
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function TestDrivePage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-20 text-center text-white">Loading...</div>}>
      <TestDriveForm />
    </Suspense>
  )
}
