import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Calendar, Gauge, Fuel, Settings, MapPin, Phone, MessageCircle, Shield, Award, ArrowRight } from "lucide-react"
import { CarImageGallery } from "@/components/car-image-gallery"
import type { CarImage } from "@/lib/types"

export default async function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: car } = await supabase
    .from("cars")
    .select(`
      *,
      category:categories(*),
      images:car_images(*)
    `)
    .eq("id", id)
    .single()

  if (!car) {
    notFound()
  }

  const sortedImages = car.images?.sort((a: CarImage, b: CarImage) => {
    if (a.is_primary) return -1
    if (b.is_primary) return 1
    return a.display_order - b.display_order
  })

  const whatsappNumber = "+1234567890"
  const whatsappMessage = encodeURIComponent(`Hi, I'm interested in the ${car.name} (${car.year})`)

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-accent">
            Home
          </Link>
          <span>/</span>
          <Link href="/cars" className="hover:text-accent">
            Cars
          </Link>
          <span>/</span>
          <span className="text-foreground">{car.name}</span>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Image Gallery */}
          <div>
            <CarImageGallery images={sortedImages || []} carName={car.name} />
          </div>

          {/* Car Details */}
          <div>
            <div className="mb-6">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h1 className="mb-2 font-display text-4xl font-bold text-foreground md:text-5xl">{car.name}</h1>
                  <p className="text-xl text-muted-foreground">
                    {car.model} • {car.year}
                  </p>
                </div>
                {car.is_featured && (
                  <Badge className="bg-white text-black">
                    <Award className="mr-1 h-3 w-3" />
                    Featured
                  </Badge>
                )}
              </div>

              <div className="mb-4 flex flex-wrap gap-2">
                {car.category && (
                  <Badge variant="outline" className="border-border text-muted-foreground">
                    {car.category.name}
                  </Badge>
                )}
                <Badge variant="outline" className="border-border text-muted-foreground">
                  {car.brand}
                </Badge>
                {car.status !== "available" && (
                  <Badge variant="destructive" className="capitalize">
                    {car.status}
                  </Badge>
                )}
              </div>

              {car.show_price && car.price ? (
                <div className="mb-6">
                  <p className="text-4xl font-bold text-foreground">${car.price.toLocaleString()}</p>
                </div>
              ) : (
                <div className="mb-6">
                  <p className="text-2xl text-zinc-400">Contact seller for best price</p>
                </div>
              )}
            </div>

            {/* Quick Specs */}
            <Card className="mb-6 border-border bg-card/50 backdrop-blur">
              <CardContent className="grid grid-cols-2 gap-4 p-6">
                {car.year && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Year</p>
                      <p className="font-semibold text-foreground">{car.year}</p>
                    </div>
                  </div>
                )}
                {car.mileage && (
                  <div className="flex items-center gap-3">
                    <Gauge className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Mileage</p>
                      <p className="font-semibold text-foreground">{car.mileage}</p>
                    </div>
                  </div>
                )}
                {car.fuel_type && (
                  <div className="flex items-center gap-3">
                    <Fuel className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Fuel</p>
                      <p className="font-semibold text-foreground">{car.fuel_type}</p>
                    </div>
                  </div>
                )}
                {car.transmission && (
                  <div className="flex items-center gap-3">
                    <Settings className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Transmission</p>
                      <p className="font-semibold text-foreground">{car.transmission}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            {car.status === "available" && (
              <div className="mb-6 flex flex-col gap-3 sm:flex-row">
                <Button asChild className="flex-1 bg-white text-black hover:bg-zinc-200" size="lg">
                  <Link href={`/test-drive?carId=${car.id}`}>
                    <Calendar className="mr-2 h-5 w-5" />
                    Book Test Drive
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="flex-1 border-border text-foreground hover:bg-card/10 bg-transparent"
                  size="lg"
                >
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    WhatsApp
                  </a>
                </Button>
              </div>
            )}

            {/* Contact Card */}
            <Card className="border-border bg-card/50 backdrop-blur">
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold text-foreground">Contact Seller</h3>
                <div className="flex flex-col gap-3">
                  <a
                    href={`tel:${whatsappNumber}`}
                    className="flex items-center gap-3 text-muted-foreground transition-colors hover:text-accent"
                  >
                    <Phone className="h-5 w-5 text-foreground" />
                    <span className="text-foreground">{whatsappNumber}</span>
                  </a>
                  {car.location && (
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <MapPin className="h-5 w-5 text-foreground" />
                      <span className="text-foreground">{car.location}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Full Details Section */}
        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {/* Description */}
          {car.description && (
            <Card className="lg:col-span-2 border-border bg-card/50 backdrop-blur">
              <CardContent className="p-6">
                <h2 className="mb-4 text-2xl font-bold text-foreground">Description</h2>
                <p className="leading-relaxed text-muted-foreground">{car.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Additional Info */}
          <Card className="border-border bg-card/50 backdrop-blur">
            <CardContent className="p-6">
              <h3 className="mb-4 text-xl font-bold text-foreground">Additional Information</h3>
              <div className="flex flex-col gap-3 text-sm">
                {car.condition && (
                  <div>
                    <p className="text-muted-foreground">Condition</p>
                    <p className="font-semibold text-foreground">{car.condition}</p>
                  </div>
                )}
                {car.warranty && (
                  <div>
                    <p className="text-muted-foreground">Warranty</p>
                    <p className="font-semibold text-foreground">{car.warranty}</p>
                  </div>
                )}
                {car.engine && (
                  <div>
                    <p className="text-muted-foreground">Engine</p>
                    <p className="font-semibold text-foreground">{car.engine}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          {(car.interior_features || car.exterior_features) && (
            <Card className="lg:col-span-3 border-border bg-card/50 backdrop-blur">
              <CardContent className="p-6">
                <h2 className="mb-6 text-2xl font-bold text-foreground">Features</h2>
                <div className="grid gap-6 md:grid-cols-2">
                  {car.interior_features && (
                    <div>
                      <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
                        <Shield className="h-5 w-5 text-foreground" />
                        Interior Features
                      </h3>
                      <p className="leading-relaxed text-muted-foreground">{car.interior_features}</p>
                    </div>
                  )}
                  {car.exterior_features && (
                    <div>
                      <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
                        <Award className="h-5 w-5 text-foreground" />
                        Exterior Features
                      </h3>
                      <p className="leading-relaxed text-muted-foreground">{car.exterior_features}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* CTA Section */}
        {car.status === "available" && (
          <Card className="mt-12 border-border bg-card/50 backdrop-blur">
            <CardContent className="p-8 text-center">
              <h2 className="mb-4 font-display text-3xl font-bold text-foreground">Ready to Experience This Vehicle?</h2>
              <p className="mb-6 text-lg text-muted-foreground">
                Book a premium test drive with agent-delivered service at your location
              </p>
              <Button asChild size="lg" className="bg-white text-black hover:bg-zinc-200">
                <Link href={`/test-drive?carId=${car.id}`}>
                  Book Test Drive <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
