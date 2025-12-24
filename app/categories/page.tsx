import { createClient } from "@/lib/supabase/server"
import type { Category } from "@/lib/types"
import Link from "next/link"
import Image from "next/image"

export default async function CategoriesPage() {
  const supabase = await createClient()

  const { data: categories } = await supabase.from("categories").select("*").order("name")

  // Development fallback: sample categories when DB is empty locally
  const sampleCategories: Category[] = [
    { id: "sample-toyota", name: "Toyota", slug: "toyota", description: "Reliable and efficient Toyota vehicles for everyday driving.", created_at: new Date().toISOString() },
    { id: "sample-mercedes", name: "Mercedes-Benz", slug: "mercedes-benz", description: "Luxury Mercedes-Benz vehicles with premium features.", created_at: new Date().toISOString() },
    { id: "sample-hyundai", name: "Hyundai", slug: "hyundai", description: "Modern Hyundai vehicles with advanced technology.", created_at: new Date().toISOString() },
    { id: "sample-honda", name: "Honda", slug: "honda", description: "Dependable Honda vehicles known for reliability.", created_at: new Date().toISOString() },
    { id: "sample-ford", name: "Ford", slug: "ford", description: "American-made Ford vehicles for every need.", created_at: new Date().toISOString() },
  ]

  const usingSample = !(categories && categories.length > 0) && process.env.NODE_ENV === "development"
  const displayCategories = usingSample ? sampleCategories : (categories || [])

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h1 className="mb-4 font-display text-4xl font-bold text-foreground md:text-5xl lg:text-6xl">
            Premium Brands
          </h1>
          <p className="text-lg text-muted-foreground">Browse our luxury collection by brand</p>
        </div>

        {usingSample && (
          <div className="mb-6 rounded-md border border-yellow-700/20 bg-yellow-950/30 p-4">
            <p className="text-sm text-yellow-300">
              Showing sample categories because your local database has no categories. Run the seed SQL to populate real data.
            </p>
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayCategories.map((category: Category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group relative overflow-hidden rounded-lg border border-border bg-card/50 backdrop-blur transition-all hover:border-border"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={(category as any).image_url || `https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=60`}
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
      </div>
    </div>
  )
}
