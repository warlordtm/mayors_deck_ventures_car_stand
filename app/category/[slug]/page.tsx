import { createClient } from "@/lib/supabase/server"
import type { Car } from "@/lib/types"
import { CarCard } from "@/components/car-card"
import { PowerbikeCard } from "@/components/powerbike-card"
import { notFound } from "next/navigation"
import React from "react"

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  // Fetch category
  const { data: category } = await supabase.from("categories").select("*").eq("slug", slug).single()

  if (!category) {
    notFound()
  }

  // Fetch cars in this category
  const { data: cars } = await supabase
    .from("cars")
    .select(`
      *,
      category:categories(*),
      images:car_images(*)
    `)
    .eq("category_id", category.id)
    .eq("status", "available")
    .order("created_at", { ascending: false })

  // Fetch powerbikes in this category
  const { data: powerbikes } = await supabase
    .from("powerbikes")
    .select(`
      *,
      category:categories(*),
      images:powerbike_images(*)
    `)
    .eq("category_id", category.id)
    .eq("status", "available")
    .order("created_at", { ascending: false })

  // Local development fallback: show sample cars if none are returned so the page
  // isn't empty while developing without a seeded DB.
  const sampleCars: Car[] = [
    {
      id: "sample-1",
      name: "Ferrari Roma",
      model: "Roma",
      year: 2022,
      category_id: category.id,
      brand: "Ferrari",
      price: 245000,
      show_price: true,
      description: "Sample Ferrari Roma",
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
      is_featured: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      category: category,
      images: [
        {
          id: "img-s1",
          car_id: "sample-1",
          image_url: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1400&q=60",
          is_primary: true,
          display_order: 0,
          created_at: new Date().toISOString(),
        },
      ],
    },
  ]

  const hasVehicles = (cars && cars.length > 0) || (powerbikes && powerbikes.length > 0)

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h1 className="mb-4 font-display text-4xl font-bold text-foreground md:text-5xl lg:text-6xl">{category.name}</h1>
          {category.description && <p className="text-lg text-muted-foreground">{category.description}</p>}
        </div>

        {hasVehicles || process.env.NODE_ENV === "development" ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cars && cars.length > 0 ? (
              cars.map((car: Car) => (
                <CarCard key={`car-${car.id}`} car={car} />
              ))
            ) : null}
            {powerbikes && powerbikes.length > 0 ? (
              powerbikes.map((powerbike: any) => (
                <PowerbikeCard key={`powerbike-${powerbike.id}`} powerbike={powerbike} />
              ))
            ) : null}
            {(!cars || cars.length === 0) && (!powerbikes || powerbikes.length === 0) && process.env.NODE_ENV === "development" && (
              sampleCars.map((car: Car) => (
                <CarCard key={car.id} car={car} />
              ))
            )}
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-card/50 p-12 text-center backdrop-blur">
            <p className="text-xl text-muted-foreground">No vehicles available in this category at the moment.</p>
          </div>
        )}
      </div>
    </div>
  )
}
