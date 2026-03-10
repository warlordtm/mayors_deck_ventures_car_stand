import { createClient } from "@/lib/supabase/server"
import type { Powerbike, Category } from "@/lib/types"
import PowerbikesClient from "./client"

const SAMPLE_POWERBIKES: Powerbike[] = Array.from({ length: 8 }).map((_, i) => ({
  id: `powerbike-${i + 1}`,
  name: ["Kawasaki Ninja H2", "Ducati Panigale V4", "BMW S1000RR", "Yamaha R1"][i % 4],
  model: ["Ninja H2", "Panigale V4", "S1000RR", "R1"][i % 4],
  year: 2020 + (i % 4),
  category_id: null,
  brand: ["Kawasaki", "Ducati", "BMW", "Yamaha"][i % 4],
  price: (50000 + i * 10000) * 1600, // Convert to Naira
  show_price: true,
  description: `Experience the thrill of high-performance motorcycling with this ${2020 + (i % 4)} ${["Kawasaki Ninja H2", "Ducati Panigale V4", "BMW S1000RR", "Yamaha R1"][i % 4]}. This superbike delivers unmatched speed, precision handling, and cutting-edge technology for the ultimate riding experience.`,
  engine: ["Supercharged 998cc Inline-4", "1103cc V4", "999cc Inline-4", "998cc Inline-4"][i % 4],
  mileage: (5000 + i * 2000).toString(),
  transmission: "Manual",
  fuel_type: "Petrol",
  color: ["Green", "Red", "Blue", "Black"][i % 4],
  interior_features: "",
  exterior_features: "LED headlights, Carbon fiber bodywork, Premium brakes, Sport suspension",
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
      id: `pb-img-${i + 1}`,
      powerbike_id: `powerbike-${i + 1}`,
      image_url: `https://images.unsplash.com/photo-15${i}372?auto=format&fit=crop&w=1400&q=60`,
      is_primary: true,
      display_order: 0,
      created_at: new Date().toISOString(),
    },
  ],
}))

export default async function PowerbikesPage() {
  const supabase = await createClient()

  const { data: powerbikes, error: powerbikesError } = await supabase
    .from("powerbikes")
    .select(`
      *,
      category:categories(*),
      images:powerbike_images(*)
    `)
    .eq("status", "available")
    .order("created_at", { ascending: false })

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name")

  // Use sample powerbikes if no real data or in development
  const displayPowerbikes = (powerbikes && powerbikes.length > 0) ? powerbikes : SAMPLE_POWERBIKES
  const displayCategories = categories || []

  return (
    <PowerbikesClient initialPowerbikes={displayPowerbikes} initialCategories={displayCategories} />
  )
}