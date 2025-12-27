"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { MotionArticle, staggerContainer, bounceStaggerItem } from "@/components/motion-wrappers"
import { CarCardSkeleton } from "@/components/loading-skeleton"
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
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-4xl font-bold font-display text-foreground">Featured Vehicles</h2>
            <p className="text-lg text-muted-foreground">A curated selection showcasing the pinnacle of automotive craftsmanship.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <CarCardSkeleton key={idx} />
            ))}
          </div>
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

        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {displayCars.map((car, idx) => {
            const primaryImage = car.images?.find(img => img.is_primary) || car.images?.[0]
            const isPersonalized = showPersonalized && idx < personalizedCars.length

            return (
              <Link key={car.id} href={`/cars/${car.id}`} className="block">
                <MotionArticle
                  variants={bounceStaggerItem}
                  whileHover={{
                    y: -12,
                    scale: 1.02,
                    transition: { type: "spring", damping: 20, stiffness: 300 }
                  }}
                  className={`group rounded-2xl border bg-card hover:shadow-2xl hover:shadow-accent/10 transition-all duration-500 cursor-pointer ${
                    isPersonalized
                      ? 'border-accent/50 shadow-md shadow-accent/20'
                      : 'border-border'
                  }`}
                >
                  {isPersonalized && (
                    <motion.div
                      initial={{ scale: 0, rotate: -10 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        delay: idx * 0.1 + 0.5,
                        type: "spring",
                        damping: 15,
                        stiffness: 200
                      }}
                      className="absolute top-3 left-3 z-10"
                    >
                      <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-1 text-xs font-semibold text-accent-foreground shadow-lg">
                        ⭐ Recommended
                      </span>
                    </motion.div>
                  )}
                  <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="w-full h-full"
                    >
                      <Image
                        src={primaryImage?.image_url || "/placeholder.jpg"}
                        alt={car.name}
                        fill
                        className="object-contain"
                      />
                    </motion.div>
                  </div>
                  <div className="p-6">
                    <motion.h3
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.08 + 0.3, duration: 0.6 }}
                      className="text-xl font-bold font-display text-foreground"
                    >
                      {car.name}
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.08 + 0.4, duration: 0.6 }}
                      className="text-sm text-muted-foreground"
                    >
                      {car.year} • Premium
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.08 + 0.5, duration: 0.6 }}
                      className="mt-4 flex items-center justify-between"
                    >
                      {car.show_price && car.price ? (
                        <p className="text-2xl font-bold text-foreground">₦{car.price.toLocaleString('en-NG')}</p>
                      ) : (
                        <p className="text-2xl font-bold text-foreground">Price on Request</p>
                      )}
                      <motion.span
                        whileHover={{ scale: 1.05, x: 3 }}
                        className="inline-flex items-center gap-2 rounded-md bg-accent/10 border border-accent/20 px-4 py-2 text-sm font-semibold text-accent hover:bg-accent/20 transition-all duration-300 cursor-pointer"
                      >
                        View Details →
                      </motion.span>
                    </motion.div>
                  </div>
                </MotionArticle>
              </Link>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

export default FeaturedVehicles
