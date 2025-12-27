import { createClient } from "@/lib/supabase/server"
import type { Category } from "@/lib/types"
import Link from "next/link"
import Image from "next/image"

export default async function CategoriesPage() {
  const supabase = await createClient()

  const { data: categories } = await supabase.from("categories").select("*").order("name")

  // Fetch latest car images for each category
  const { data: carsWithImages } = await supabase
    .from("cars")
    .select("category_id, created_at, car_images!inner(image_url, is_primary)")
    .eq("status", "available")
    .eq("car_images.is_primary", true)
    .order("created_at", { ascending: false })

  // Create map of category_id to latest car image
  const categoryImages = new Map<string, string>()
  carsWithImages?.forEach((car: any) => {
    if (!categoryImages.has(car.category_id)) {
      categoryImages.set(car.category_id, car.car_images[0]?.image_url)
    }
  })

  // Only show categories that have cars
  const displayCategories = categories?.filter(cat => categoryImages.has(cat.id)) || []

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h1 className="mb-4 font-display text-4xl font-bold text-foreground md:text-5xl lg:text-6xl">
            Premium Brands
          </h1>
          <p className="text-lg text-muted-foreground">Browse our luxury collection by brand</p>
        </div>

        {displayCategories.length === 0 ? (
          <div className="rounded-lg border border-border bg-card/50 p-12 text-center backdrop-blur">
            <p className="text-xl text-muted-foreground">No categories available at the moment.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayCategories.map((category: Category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="group relative overflow-hidden rounded-lg border border-border bg-card/50 backdrop-blur transition-all hover:border-border"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={categoryImages.get(category.id) || `https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=60`}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="mb-2 font-display text-2xl font-bold text-foreground">{category.name}</h3>
                  {category.description && <p className="text-sm text-muted-foreground">{category.description}</p>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
