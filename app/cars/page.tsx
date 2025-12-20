import { createClient } from "@/lib/supabase/server"
import type { Car } from "@/lib/types"
import { CarCard } from "@/components/car-card"

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

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h1 className="mb-4 font-display text-4xl font-bold text-foreground md:text-5xl lg:text-6xl">Our Collection</h1>
          <p className="text-lg text-muted-foreground">Explore our complete inventory of luxury vehicles</p>
        </div>

        {cars && cars.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cars.map((car: Car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-card/50 p-12 text-center backdrop-blur">
            <p className="text-xl text-muted-foreground">No cars available at the moment. Please check back soon.</p>
          </div>
        )}
      </div>
    </div>
  )
}
