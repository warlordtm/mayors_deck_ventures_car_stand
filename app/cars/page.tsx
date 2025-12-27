import { createClient } from "@/lib/supabase/server"
import type { Car, Category } from "@/lib/types"
import CarsClient from "./client"

const SAMPLE_CARS: Car[] = Array.from({ length: 8 }).map((_, i) => ({
  id: `car-${i + 1}`,
  name: ["Aston Martin DB11", "Ferrari Roma", "Porsche 911", "Lamborghini Huracan"][i % 4],
  model: ["DB11", "Roma", "911 Carrera", "Huracan"][i % 4],
  year: 2020 + (i % 4),
  category_id: null,
  brand: ["Aston Martin", "Ferrari", "Porsche", "Lamborghini"][i % 4],
  price: (150000 + i * 25000) * 1600, // Convert to Naira
  show_price: true,
  description: `Experience the pinnacle of automotive excellence with this ${2020 + (i % 4)} ${["Aston Martin DB11", "Ferrari Roma", "Porsche 911", "Lamborghini Huracan"][i % 4]}. This masterpiece combines breathtaking performance with unparalleled luxury, featuring cutting-edge technology and premium materials throughout.`,
  engine: ["V12 5.2L", "V8 3.9L Twin-Turbo", "Flat-6 3.0L Twin-Turbo", "V10 5.2L"][i % 4],
  mileage: (10000 + i * 5000).toString(),
  transmission: "Automatic",
  fuel_type: "Petrol",
  color: ["Black", "Red", "White", "Blue"][i % 4],
  interior_features: "Leather upholstery, Premium audio system, Climate control, Navigation",
  exterior_features: "LED headlights, Alloy wheels, Carbon fiber accents, Sport exhaust",
  condition: "Excellent",
  warranty: "2 years remaining",
  location: "Lagos, Nigeria",
  status: "available" as const,
  is_featured: i < 2,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  category: undefined,
  images: [
    {
      id: `img-${i + 1}`,
      car_id: `car-${i + 1}`,
      image_url: `https://images.unsplash.com/photo-15${i}371?auto=format&fit=crop&w=1400&q=60`,
      is_primary: true,
      display_order: 0,
      created_at: new Date().toISOString(),
    },
  ],
}))

export default async function CarsPage() {
  const supabase = await createClient()

  const { data: cars, error: carsError } = await supabase
    .from("cars")
    .select(`
      *,
      category:categories(*),
      images:car_images(*)
    `)
    .eq("status", "available")
    .order("created_at", { ascending: false })

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name")

  // Use sample cars if no real data or in development
  const displayCars = (cars && cars.length > 0) ? cars : SAMPLE_CARS
  const displayCategories = categories || []

  return (
    <CarsClient initialCars={displayCars} initialCategories={displayCategories} />
  )
}
