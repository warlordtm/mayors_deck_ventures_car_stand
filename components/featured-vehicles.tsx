"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import React from "react"

const CARS = [
  {
    id: "ferrari-roma",
    name: "Ferrari Roma",
    year: 2022,
    price: 245000,
    image:
      "https://images.unsplash.com/photo-1610088257866-6d15d5b2f1b6?auto=format&fit=crop&w=1400&q=60",
  },
  {
    id: "aston-martin-db11",
    name: "Aston Martin DB11",
    year: 2021,
    price: 198000,
    image:
      "https://images.unsplash.com/photo-1523987355523-c7b5b86a1f03?auto=format&fit=crop&w=1400&q=60",
  },
  {
    id: "mercedes-amg-gt",
    name: "Mercedes AMG GT",
    year: 2023,
    price: 165000,
    image: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1400&q=60",
  },
  {
    id: "lamborghini-huracan",
    name: "Lamborghini Huracan",
    year: 2022,
    price: 310000,
    image: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&w=1400&q=60",
  },
  {
    id: "porsche-911",
    name: "Porsche 911 Carrera",
    year: 2023,
    price: 185000,
    image: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1400&q=60",
  },
  {
    id: "rolls-phantom",
    name: "Rolls-Royce Phantom",
    year: 2020,
    price: 450000,
    image: "https://images.unsplash.com/photo-1615874959474-8df1b3be6d6c?auto=format&fit=crop&w=1400&q=60",
  },
]

export function FeaturedVehicles() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-4xl font-bold text-white">Featured Vehicles</h2>
          <p className="text-lg text-zinc-300">A curated selection showcasing the pinnacle of automotive craftsmanship.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CARS.map((car, idx) => (
            <motion.article
              key={car.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06, duration: 0.5 }}
              className="group overflow-hidden rounded-2xl border border-border bg-card"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image src={car.image} alt={car.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white">{car.name}</h3>
                <p className="text-sm text-zinc-400">{car.year} • Premium</p>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-2xl font-bold text-white">${car.price.toLocaleString()}</p>
                  <a
                    href={`/cars/${car.id}`}
                    className="inline-flex items-center gap-2 rounded-md bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
                  >
                    View
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedVehicles
