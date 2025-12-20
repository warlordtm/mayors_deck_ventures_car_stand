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
  const [carIdMismatch, setCarIdMismatch] = useState<boolean>(false)

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

      let carsData = data || []

      // If no cars in database, use sample cars
      if (carsData.length === 0) {
        carsData = [
          { id: "car-1", name: "Aston Martin DB11", model: "DB11", year: 2020 },
          { id: "car-2", name: "Ferrari Roma", model: "Roma", year: 2021 },
          { id: "car-3", name: "Porsche 911", model: "911 Carrera", year: 2022 },
          { id: "car-4", name: "Lamborghini Huracan", model: "Huracan", year: 2023 },
        ]
      }

      // Data from this query is a narrow projection (id, name, model, year).
      // Map the projection into the full `Car` shape with sensible defaults
      // so the UI can render consistently in the dropdown.
      const mapped = carsData.map((d: any) => ({
        // Ensure id is always a string so comparisons with query params work
        id: String(d.id),
        name: d.name,
        model: d.model || "",
        year: Number(d.year) || new Date().getFullYear(),
        category_id: null,
        brand: "",
        price: null,
        show_price: false,
        description: null,
        engine: null,
        mileage: null,
        transmission: null,
        fuel_type: null,
        interior_features: null,
        exterior_features: null,
        condition: null,
        warranty: null,
        location: null,
        status: "available",
        is_featured: false,
        created_at: "",
        updated_at: "",
      } as Car))

      setCars(mapped)
      // Reconcile selectedCarId with loaded cars:
      // - If a carId query param exists and matches a loaded car, select it.
      // - Else if there's exactly one available car and nothing selected, default to it.
      if (carId) {
        const found = mapped.find((c: Car) => String(c.id) === String(carId))
        if (found) {
          setSelectedCarId(String(carId))
          setCarIdMismatch(false)
        } else {
          // indicate early that the provided carId isn't available
          setCarIdMismatch(true)
        }
      } else if (!selectedCarId && mapped.length === 1) {
        setSelectedCarId(String(mapped[0].id))
        setCarIdMismatch(false)
      } else {
        setCarIdMismatch(false)
      }
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
      // Basic client-side validation: ensure a vehicle is selected and it's in the loaded list
      if (!selectedCarId) {
        setError("Please select a vehicle before continuing.")
        setSubmitting(false)
        return
      }

      const selected = cars.find((c) => String(c.id) === String(selectedCarId))
      if (!selected) {
        setError("The selected vehicle is not available. Please choose another vehicle.")
        setSubmitting(false)
        return
      }

      // Create booking via server API which enforces availability and canonical fee
      const response = await fetch("/api/test-drive/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          car_id: selectedCarId,
          ...formData,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Booking failed")
      }

      const booking = data.booking
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
        <h1 className="mb-4 font-display text-4xl font-bold text-foreground md:text-5xl lg:text-6xl">Book a Test Drive</h1>
        <p className="text-lg text-muted-foreground">Experience luxury with our premium agent-delivered test drive service</p>
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-3">
        {/* Info Cards */}
        <div className="space-y-4 lg:col-span-1">
          <Card className="border-border bg-card/50 backdrop-blur">
            <CardContent className="p-6">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-card/10">
                <Calendar className="h-6 w-6 text-foreground" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">Flexible Scheduling</h3>
              <p className="text-sm text-muted-foreground">Choose your preferred date and time</p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/50 backdrop-blur">
            <CardContent className="p-6">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-card/10">
                <MapPin className="h-6 w-6 text-foreground" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">Your Location</h3>
              <p className="text-sm text-muted-foreground">We bring the car to you</p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/50 backdrop-blur">
            <CardContent className="p-6">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-card/10">
                <DollarSign className="h-6 w-6 text-foreground" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">Test Drive Fee</h3>
              <p className="text-sm text-muted-foreground">₦159,984 booking fee (refundable on purchase)</p>
            </CardContent>
          </Card>
        </div>

        {/* Booking Form */}
        <Card className="lg:col-span-2 border-border bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl text-foreground">Complete Your Booking</CardTitle>
            <CardDescription className="text-muted-foreground">Fill in your details to reserve your test drive</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Select Car */}
              {carIdMismatch && (
                <div className="mb-4 rounded-md border border-yellow-400 bg-yellow-50 p-3 text-yellow-800">
                  <div className="flex items-start justify-between">
                    <div>
                      <strong className="block">Preselected vehicle unavailable</strong>
                      <p className="text-sm">The vehicle referenced in the link isn't available right now. Please choose another vehicle from the list below.</p>
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => setCarIdMismatch(false)}
                        className="ml-4 rounded-md bg-yellow-100 px-2 py-1 text-sm font-medium text-yellow-800"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <div>
                <Label htmlFor="car" className="text-muted-foreground">
                  Select Vehicle
                </Label>
                <select
                  id="car"
                  required
                  value={selectedCarId}
                  onChange={(e) => setSelectedCarId(e.target.value)}
                  className="mt-2 w-full rounded-md border border-border bg-card text-foreground px-3 py-2"
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
                  <Label htmlFor="name" className="text-muted-foreground">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    required
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    className="mt-2 border-border bg-card text-foreground"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-muted-foreground">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={formData.customer_phone}
                    onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                    className="mt-2 border-border bg-card text-foreground"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-muted-foreground">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.customer_email}
                  onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                  className="mt-2 border-border bg-card text-foreground"
                />
              </div>

              {/* Booking Details */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="date" className="text-muted-foreground">
                    Preferred Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    required
                    value={formData.booking_date}
                    onChange={(e) => setFormData({ ...formData, booking_date: e.target.value })}
                    className="mt-2 border-border bg-card text-foreground"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div>
                  <Label htmlFor="time" className="text-muted-foreground">
                    Preferred Time
                  </Label>
                  <Input
                    id="time"
                    type="time"
                    required
                    value={formData.booking_time}
                    onChange={(e) => setFormData({ ...formData, booking_time: e.target.value })}
                    className="mt-2 border-border bg-card text-foreground"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location" className="text-muted-foreground">
                  Test Drive Location
                </Label>
                <Input
                  id="location"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="mt-2 border-border bg-card text-foreground"
                />
              </div>

              <div>
                <Label htmlFor="notes" className="text-muted-foreground">
                  Additional Notes (Optional)
                </Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="mt-2 border-border bg-card text-foreground"
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

              <p className="text-center text-xs text-muted-foreground">
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
