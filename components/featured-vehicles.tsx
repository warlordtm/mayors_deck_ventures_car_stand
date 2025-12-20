"use client"

import Image from "next/image"
import Link from "next/link"
import { MotionArticle } from "@/components/motion-wrappers"
import React from "react"

const CARS = [
  {
    id: "ferrari-roma",
    name: "Ferrari Roma",
    year: 2022,
    price: 392000000,
    image:
      "https://images.unsplash.com/photo-1645028875875-d3611dc96fe0?w=1400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "aston-martin-db11",
    name: "Aston Martin DB11",
    year: 2021,
    price: 316800000,
    image:
      "https://plus.unsplash.com/premium_photo-1737559694560-1227c63d0885?w=1400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YXN0b24lMjBtYXJ0aW4lMjBkYjExfGVufDB8fDB8fHww",
  },
  {
    id: "mercedes-amg-gt",
    name: "Mercedes AMG GT",
    year: 2023,
    price: 264000000,
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWVyY2VkZXMlMjBhbWclMjBndHxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: "lamborghini-huracan",
    name: "Lamborghini Huracan",
    year: 2022,
    price: 496000000,
    image: "https://images.unsplash.com/photo-1657217674164-9cbf85acfc6d?w=1400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGxhbWJvcmdoaW5pJTIwaHVyYWNhbnxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: "porsche-911",
    name: "Porsche 911 Carrera",
    year: 2023,
    price: 296000000,
    image: "https://images.unsplash.com/photo-1601679147136-22d1032399e4?w=1400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHBvcmNoZSUyMDkxMXxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: "rolls-phantom",
    name: "Rolls-Royce Phantom",
    year: 2020,
    price: 720000000,
    image: "https://images.unsplash.com/photo-1728458664292-ac6d6034e78d?w=1400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cm9sbHMtcm95Y2UlMjBwaGFudG9tfGVufDB8fDB8fHww",
  },
]

export function FeaturedVehicles() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-4xl font-bold font-display text-foreground">Featured Vehicles</h2>
          <p className="text-lg text-muted-foreground">A curated selection showcasing the pinnacle of automotive craftsmanship.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CARS.map((car, idx) => (
            <MotionArticle
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
                <h3 className="text-xl font-bold font-display text-foreground">{car.name}</h3>
                <p className="text-sm text-muted-foreground">{car.year} • Premium</p>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-2xl font-bold text-foreground">₦{car.price.toLocaleString('en-NG')}</p>
                  <Link href={`/cars`} className="inline-flex items-center gap-2 rounded-md bg-card/5 px-4 py-2 text-sm font-semibold text-foreground hover:bg-card/10">
                    View Inventory
                  </Link>
                </div>
              </div>
            </MotionArticle>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedVehicles
