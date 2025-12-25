"use client"

import Image from "next/image"
import Link from "next/link"
import { MotionArticle } from "@/components/motion-wrappers"
import React, { useEffect, useState } from "react"
import {
  getUserSearchHistory,
  findPersonalizedRecommendations,
  shouldShowPersonalizedRecommendations
} from "@/lib/car-recommendations"
import type { Car } from "@/lib/types"

export function FeaturedVehicles() {
  const [cars, setCars] = useState<Car[]>([])
  const [personalizedCars, setPersonalizedCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [showPersonalized, setShowPersonalized] = useState(false)

  useEffect(() => {
    const fetchFeaturedCars = async () => {
      try {
        // Fetch all cars for personalized recommendations
        const allCarsResponse = await fetch('/api/cars?limit=50')
        const allCarsData = await allCarsResponse.json()
        const allCars = allCarsData.cars || []

        // Check for personalized recommendations
        if (shouldShowPersonalizedRecommendations()) {
          const searchHistory = getUserSearchHistory()
          const personalized = findPersonalizedRecommendations(allCars, searchHistory)
          if (personalized.length > 0) {
            setPersonalizedCars(personalized)
            setShowPersonalized(true)
          }
        }

        // Fetch regular featured cars
        const featuredResponse = await fetch('/api/cars?featured=true&limit=6')
        const featuredData = await featuredResponse.json()
        setCars(featuredData.cars || [])
      } catch (error) {
        console.error('Error fetching cars:', error)
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

  // Combine personalized and featured cars
  const displayCars = showPersonalized ? [...personalizedCars, ...cars] : cars

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {showPersonalized && personalizedCars.length > 0 && (
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-4xl font-bold font-display text-foreground">Recommended for You</h2>
            <p className="text-lg text-muted-foreground">Based on your recent car searches</p>
          </div>
        )}

        {!showPersonalized && (
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-4xl font-bold font-display text-foreground">Featured Vehicles</h2>
            <p className="text-lg text-muted-foreground">A curated selection showcasing the pinnacle of automotive craftsmanship.</p>
          </div>
        )}

        {showPersonalized && cars.length > 0 && (
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-4xl font-bold font-display text-foreground">Featured Vehicles</h2>
            <p className="text-lg text-muted-foreground">A curated selection showcasing the pinnacle of automotive craftsmanship.</p>
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayCars.map((car, idx) => {
            const primaryImage = car.images?.find(img => img.is_primary) || car.images?.[0]
            const isPersonalized = showPersonalized && idx < personalizedCars.length

            return (
              <Link key={car.id} href={`/cars/${car.id}`} className="block">
                <MotionArticle
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06, duration: 0.5 }}
                  className={`group overflow-hidden rounded-2xl border bg-card hover:shadow-lg transition-shadow cursor-pointer ${
                    isPersonalized
                      ? 'border-accent/50 shadow-md shadow-accent/20'
                      : 'border-border'
                  }`}
                >
                  {isPersonalized && (
                    <div className="absolute top-3 left-3 z-10">
                      <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-1 text-xs font-semibold text-accent-foreground">
                        ⭐ Recommended
                      </span>
                    </div>
                  )}
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
                      <span className="inline-flex items-center gap-2 rounded-md bg-accent/10 border border-accent/20 px-4 py-2 text-sm font-semibold text-accent hover:bg-accent/20 transition-colors">
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
