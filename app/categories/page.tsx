import { createClient } from "@/lib/supabase/server"
import type { Category } from "@/lib/types"
import Link from "next/link"
import Image from "next/image"

export default async function CategoriesPage() {
  const supabase = await createClient()

  const { data: categories } = await supabase.from("categories").select("*").order("name")

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h1 className="mb-4 font-display text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            Vehicle Categories
          </h1>
          <p className="text-lg text-zinc-400">Browse our luxury collection by category</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories?.map((category: Category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group relative overflow-hidden rounded-lg border border-white/10 bg-zinc-950/50 backdrop-blur transition-all hover:border-white/20"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={`/.jpg?height=300&width=500&query=${encodeURIComponent(category.name)}`}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="mb-2 font-display text-2xl font-bold text-white">{category.name}</h3>
                {category.description && <p className="text-sm text-zinc-300">{category.description}</p>}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
