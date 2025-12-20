import { createClient } from "@/lib/supabase/server"
import type { Car } from "@/lib/types"
import { CarCard } from "@/components/car-card"

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
  interior_features: "Leather upholstery, Premium audio system, Climate control, Navigation",
  exterior_features: "LED headlights, Alloy wheels, Carbon fiber accents, Sport exhaust",
  condition: "Excellent",
  warranty: "2 years remaining",
  location: "Lagos, Nigeria",
  status: "available",
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

  const { data: cars } = await supabase
    .from("cars")
    .select(`
      *,
      category:categories(*),
      images:car_images(*)
    `)
    .eq("status", "available")
    .order("created_at", { ascending: false })

  // Use sample cars if no real data or in development
  const displayCars = (cars && cars.length > 0) ? cars : SAMPLE_CARS

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h1 className="mb-4 font-display text-4xl font-bold text-foreground md:text-5xl lg:text-6xl">Our Collection</h1>
          <p className="text-lg text-muted-foreground">Explore our complete inventory of luxury vehicles</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayCars.map((car: Car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </div>
    </div>
  )
}
