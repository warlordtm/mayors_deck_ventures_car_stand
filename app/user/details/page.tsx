"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function UserDetailsPage() {
  const [driverLicense, setDriverLicense] = useState("")
  const [preferredCarType, setPreferredCarType] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role, driver_license, preferred_car_type")
        .eq("id", user.id)
        .single()

      if (!profile || profile.role !== 'user') {
        router.push("/login")
        return
      }

      setDriverLicense(profile.driver_license || "")
      setPreferredCarType(profile.preferred_car_type || "")
      setIsInitialLoading(false)
    }

    fetchProfile()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { error } = await supabase
        .from("profiles")
        .update({
          driver_license: driverLicense,
          preferred_car_type: preferredCarType,
          updated_at: new Date().toISOString()
        })
        .eq("id", user.id)

      if (error) throw error

      // Redirect to account page after saving
      router.push("/account")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (isInitialLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-6">
      <div className="w-full max-w-md">
        <Card className="border-border bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl text-foreground">Complete Your Profile</CardTitle>
            <CardDescription className="text-muted-foreground">
              Please fill in your car-related details to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="driverLicense" className="text-muted-foreground">
                    Driver License Number
                  </Label>
                  <Input
                    id="driverLicense"
                    type="text"
                    placeholder="Enter your driver license number"
                    required
                    value={driverLicense}
                    onChange={(e) => setDriverLicense(e.target.value)}
                    className="border-border bg-card text-foreground"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="preferredCarType" className="text-muted-foreground">
                    Preferred Car Type
                  </Label>
                  <Select value={preferredCarType} onValueChange={setPreferredCarType} required>
                    <SelectTrigger className="border-border bg-card text-foreground">
                      <SelectValue placeholder="Select your preferred car type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedan">Sedan</SelectItem>
                      <SelectItem value="suv">SUV</SelectItem>
                      <SelectItem value="truck">Truck</SelectItem>
                      <SelectItem value="coupe">Coupe</SelectItem>
                      <SelectItem value="convertible">Convertible</SelectItem>
                      <SelectItem value="hatchback">Hatchback</SelectItem>
                      <SelectItem value="wagon">Wagon</SelectItem>
                      <SelectItem value="sports">Sports Car</SelectItem>
                      <SelectItem value="luxury">Luxury</SelectItem>
                      <SelectItem value="electric">Electric</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button type="submit" className="w-full bg-white text-black hover:bg-zinc-200" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Details"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}