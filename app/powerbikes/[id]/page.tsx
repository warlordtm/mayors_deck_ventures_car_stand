import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Calendar, Gauge, Fuel, Settings, MapPin, Phone, MessageCircle, Shield, Award, ArrowRight, Heart } from "lucide-react"
import { CarImageGallery } from "@/components/car-image-gallery"
import type { PowerbikeImage } from "@/lib/types"
import { FavoriteButton } from "@/components/favorite-button"

export default async function PowerbikeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  // First, try to find by primary id.
  let { data: powerbike } = await supabase
    .from("powerbikes")
    .select(`
      *,
      category:categories(*),
      images:powerbike_images(*)
    `)
    .eq("id", id)
    .single()

  // If not found by id, attempt to find by slug (human-friendly URLs).
  if (!powerbike) {
    const { data: powerbikeBySlug } = await supabase
      .from("powerbikes")
      .select(`
        *,
        category:categories(*),
        images:powerbike_images(*)
      `)
      .eq("slug", id)
      .single()

    powerbike = powerbikeBySlug
  }

  // Fallback to sample powerbikes if not found in database
  if (!powerbike) {
    const samplePowerbikes = [
      {
        id: "powerbike-1",
        name: "Kawasaki Ninja H2",
        model: "Ninja H2",
        year: 2020,
        brand: "Kawasaki",
        price: 80000000,
        show_price: true,
        description: "The Kawasaki Ninja H2 is a supercharged supersport motorcycle. It has a 998 cc inline-four engine with a centrifugal supercharger.",
        engine: "Supercharged 998cc Inline-4",
        mileage: "5,000 km",
        transmission: "Manual",
        fuel_type: "Petrol",
        color: "Green",
        exterior_features: "LED headlights, Carbon fiber bodywork, Premium brakes, Sport suspension",
        condition: "Excellent",
        warranty: "2 years remaining",
        location: "Lagos, Nigeria",
        status: "available",
        is_featured: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        category: { id: "powerbikes", name: "Powerbikes", slug: "powerbikes" },
        images: [
          {
            id: "pb-img-1",
            powerbike_id: "powerbike-1",
            image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1400&q=60",
            is_primary: true,
            display_order: 0,
            created_at: new Date().toISOString(),
          },
        ],
      },
    ]

    powerbike = samplePowerbikes.find(p => p.id === id)
  }

  if (!powerbike) {
    notFound()
  }

  const images = powerbike.images || []

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link href="/powerbikes" className="text-muted-foreground hover:text-foreground">
            Powerbikes
          </Link>
          <span className="mx-2 text-muted-foreground">/</span>
          <span className="text-foreground">{powerbike.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <CarImageGallery images={images as any} />
          </div>

          {/* Powerbike Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold">{powerbike.name}</h1>
                <FavoriteButton itemId={powerbike.id} itemType="powerbike" />
              </div>

              {powerbike.show_price && powerbike.price && (
                <p className="text-3xl font-bold text-primary mb-4">
                  ₦{powerbike.price.toLocaleString('en-NG')}
                </p>
              )}

              <div className="flex flex-wrap gap-2 mb-4">
                {powerbike.is_featured && <Badge>Featured</Badge>}
                {powerbike.status !== "available" && (
                  <Badge variant="destructive" className="capitalize">
                    {powerbike.status}
                  </Badge>
                )}
                {powerbike.condition && <Badge variant="outline">{powerbike.condition}</Badge>}
              </div>
            </div>

            {/* Key Specs */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Key Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  {powerbike.year && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{powerbike.year}</span>
                    </div>
                  )}
                  {powerbike.mileage && (
                    <div className="flex items-center gap-2">
                      <Gauge className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{powerbike.mileage}</span>
                    </div>
                  )}
                  {powerbike.fuel_type && (
                    <div className="flex items-center gap-2">
                      <Fuel className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{powerbike.fuel_type}</span>
                    </div>
                  )}
                  {powerbike.transmission && (
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{powerbike.transmission}</span>
                    </div>
                  )}
                  {powerbike.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{powerbike.location}</span>
                    </div>
                  )}
                  {powerbike.warranty && (
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{powerbike.warranty}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            {powerbike.description && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">{powerbike.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Features */}
            {powerbike.exterior_features && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Features</h3>
                  <p className="text-muted-foreground">{powerbike.exterior_features}</p>
                </CardContent>
              </Card>
            )}

            {/* Contact Buttons */}
            <div className="flex gap-4">
              <Button size="lg" className="flex-1">
                <Phone className="mr-2 h-4 w-4" />
                Call Now
              </Button>
              <Button size="lg" variant="outline" className="flex-1">
                <MessageCircle className="mr-2 h-4 w-4" />
                WhatsApp
              </Button>
            </div>
          </div>
        </div>

        {/* Back to Powerbikes */}
        <div className="text-center">
          <Button asChild variant="outline">
            <Link href="/powerbikes">
              <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
              Back to Powerbikes
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}