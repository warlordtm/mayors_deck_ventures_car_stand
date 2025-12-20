"use client"

import Image from "next/image"
import Link from "next/link"
import { MotionArticle } from "@/components/motion-wrappers"
import React, { useEffect, useState } from "react"

interface Car {
  id: string
  name: string
  year: number
  price: number | null
  show_price: boolean
  images?: { image_url: string; is_primary: boolean }[]
}

export function FeaturedVehicles() {
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedCars = async () => {
      try {
        const response = await fetch('/api/cars?featured=true&limit=6')
        const data = await response.json()
        setCars(data.cars || [])
      } catch (error) {
        console.error('Error fetching featured cars:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedCars()
  }, [])

  if (loading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">Loading featured vehicles...</div>
        </div>
      </section>
    )
  }

  if (cars.length === 0) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-4xl font-bold font-display text-foreground">Featured Vehicles</h2>
            <p className="text-lg text-muted-foreground">A curated selection showcasing the pinnacle of automotive craftsmanship.</p>
            <p className="text-sm text-muted-foreground mt-4">No featured vehicles available at the moment.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-4xl font-bold font-display text-foreground">Featured Vehicles</h2>
          <p className="text-lg text-muted-foreground">A curated selection showcasing the pinnacle of automotive craftsmanship.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cars.map((car, idx) => {
            const primaryImage = car.images?.find(img => img.is_primary) || car.images?.[0]
            return (
              <Link key={car.id} href={`/cars/${car.id}`} className="block">
                <MotionArticle
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06, duration: 0.5 }}
                  className="group overflow-hidden rounded-2xl border border-border bg-card hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={primaryImage?.image_url || "/placeholder.jpg"}
                      alt={car.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold font-display text-foreground">{car.name}</h3>
                    <p className="text-sm text-muted-foreground">{car.year} • Premium</p>
                    <div className="mt-4 flex items-center justify-between">
                      {car.show_price && car.price ? (
                        <p className="text-2xl font-bold text-foreground">₦{car.price.toLocaleString('en-NG')}</p>
                      ) : (
                        <p className="text-2xl font-bold text-foreground">Price on Request</p>
                      )}
                      <span className="inline-flex items-center gap-2 rounded-md bg-card/5 px-4 py-2 text-sm font-semibold text-foreground">
                        View Details →
                      </span>
                    </div>
                  </div>
                </MotionArticle>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default FeaturedVehicles
