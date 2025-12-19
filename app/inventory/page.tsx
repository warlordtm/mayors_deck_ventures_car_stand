import React from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import SectionWrapper from "@/components/section-wrapper"

const SAMPLE_CARS = Array.from({ length: 8 }).map((_, i) => ({
  id: `car-${i + 1}`,
  name: ["Aston Martin DB11", "Ferrari Roma", "Porsche 911", "Lamborghini Huracan"][i % 4],
  year: 2020 + (i % 4),
  price: 150000 + i * 25000,
  image: `https://images.unsplash.com/photo-15${i}371?auto=format&fit=crop&w=1400&q=60`,
}))

export default function InventoryPage() {
  return (
    <main>
      <SectionWrapper>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white">Inventory</h1>
            <p className="text-zinc-400">A refined collection of premium vehicles. Filter and explore.</p>
          </div>

          <div className="hidden items-center gap-4 md:flex">
            <select className="rounded-md border border-border bg-transparent px-3 py-2 text-white">
              <option>All Brands</option>
              <option>Ferrari</option>
              <option>Lamborghini</option>
              <option>Porsche</option>
            </select>
            <select className="rounded-md border border-border bg-transparent px-3 py-2 text-white">
              <option>Any Price</option>
              <option>Under $100k</option>
              <option>$100k - $250k</option>
              <option>Over $250k</option>
            </select>
            <button className="rounded-md border border-white/10 px-4 py-2 text-sm text-white">Apply</button>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SAMPLE_CARS.map((car, idx) => (
            <motion.article
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
                <h3 className="text-lg font-semibold text-white">{car.name}</h3>
                <p className="text-sm text-zinc-400">{car.year} • Premium</p>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-xl font-bold text-white">${car.price.toLocaleString()}</p>
                  <a href={`#/cars/${car.id}`} className="text-sm font-semibold text-accent">
                    View
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </SectionWrapper>
    </main>
  )
}
