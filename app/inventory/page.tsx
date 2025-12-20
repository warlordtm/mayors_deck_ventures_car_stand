"use client"

import React from "react"
import Image from "next/image"
import { MotionArticle } from "@/components/motion-wrappers"
import SectionWrapper from "@/components/section-wrapper"

const SAMPLE_CARS = Array.from({ length: 8 }).map((_, i) => ({
  id: `car-${i + 1}`,
  name: ["Aston Martin DB11", "Ferrari Roma", "Porsche 911", "Lamborghini Huracan"][i % 4],
  model: ["DB11", "Roma", "911 Carrera", "Huracan"][i % 4],
  year: 2020 + (i % 4),
  brand: ["Aston Martin", "Ferrari", "Porsche", "Lamborghini"][i % 4],
  price: (150000 + i * 25000) * 1600,
  show_price: true,
  image: `https://images.unsplash.com/photo-15${i}371?auto=format&fit=crop&w=1400&q=60`,
}))

export default function InventoryPage() {
  return (
    <main>
      <SectionWrapper>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Inventory</h1>
            <p className="text-muted-foreground">A refined collection of premium vehicles. Filter and explore.</p>
          </div>

          <div className="hidden items-center gap-4 md:flex">
            <select className="rounded-md border border-border bg-transparent px-3 py-2 text-foreground">
              <option>All Brands</option>
              <option>Ferrari</option>
              <option>Lamborghini</option>
              <option>Porsche</option>
            </select>
            <select className="rounded-md border border-border bg-transparent px-3 py-2 text-foreground">
              <option>Any Price</option>
              <option>Under $100k</option>
              <option>$100k - $250k</option>
              <option>Over $250k</option>
            </select>
            <button className="rounded-md border border-border px-4 py-2 text-sm text-foreground">Apply</button>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SAMPLE_CARS.map((car, idx) => (
            <MotionArticle
              key={car.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03, duration: 0.45 }}
              className="group overflow-hidden rounded-2xl border border-border bg-card"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={"https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1400&q=60"}
                  alt={car.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-foreground">{car.name}</h3>
                <p className="text-sm text-muted-foreground">{car.year} • Premium</p>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-xl font-bold text-foreground">₦{car.price.toLocaleString('en-NG')}</p>
                  <a href={`/cars/${car.id}`} className="text-sm font-semibold text-accent">
                    View Details
                  </a>
                </div>
              </div>
            </MotionArticle>
          ))}
        </div>
      </SectionWrapper>
    </main>
  )
}
