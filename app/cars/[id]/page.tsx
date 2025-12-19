import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Calendar, Gauge, Fuel, Settings, MapPin, Phone, MessageCircle, Shield, Award, ArrowRight } from "lucide-react"
import { CarImageGallery } from "@/components/car-image-gallery"

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

  const sortedImages = car.images?.sort((a, b) => {
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
        <div className="mb-8 flex items-center gap-2 text-sm text-zinc-400">
          <Link href="/" className="hover:text-white">
            Home
          </Link>
          <span>/</span>
          <Link href="/cars" className="hover:text-white">
            Cars
          </Link>
          <span>/</span>
          <span className="text-white">{car.name}</span>
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
                  <h1 className="mb-2 font-display text-4xl font-bold text-white md:text-5xl">{car.name}</h1>
                  <p className="text-xl text-zinc-400">
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
                  <Badge variant="outline" className="border-zinc-700 text-zinc-300">
                    {car.category.name}
                  </Badge>
                )}
                <Badge variant="outline" className="border-zinc-700 text-zinc-300">
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
                  <p className="text-4xl font-bold text-white">${car.price.toLocaleString()}</p>
                </div>
              ) : (
                <div className="mb-6">
                  <p className="text-2xl text-zinc-400">Contact seller for best price</p>
                </div>
              )}
            </div>

            {/* Quick Specs */}
            <Card className="mb-6 border-white/10 bg-zinc-950/50 backdrop-blur">
              <CardContent className="grid grid-cols-2 gap-4 p-6">
                {car.year && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-zinc-400" />
                    <div>
                      <p className="text-xs text-zinc-500">Year</p>
                      <p className="font-semibold text-white">{car.year}</p>
                    </div>
                  </div>
                )}
                {car.mileage && (
                  <div className="flex items-center gap-3">
                    <Gauge className="h-5 w-5 text-zinc-400" />
                    <div>
                      <p className="text-xs text-zinc-500">Mileage</p>
                      <p className="font-semibold text-white">{car.mileage}</p>
                    </div>
                  </div>
                )}
                {car.fuel_type && (
                  <div className="flex items-center gap-3">
                    <Fuel className="h-5 w-5 text-zinc-400" />
                    <div>
                      <p className="text-xs text-zinc-500">Fuel</p>
                      <p className="font-semibold text-white">{car.fuel_type}</p>
                    </div>
                  </div>
                )}
                {car.transmission && (
                  <div className="flex items-center gap-3">
                    <Settings className="h-5 w-5 text-zinc-400" />
                    <div>
                      <p className="text-xs text-zinc-500">Transmission</p>
                      <p className="font-semibold text-white">{car.transmission}</p>
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
                  className="flex-1 border-white/20 text-white hover:bg-white/10 bg-transparent"
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
            <Card className="border-white/10 bg-zinc-950/50 backdrop-blur">
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold text-white">Contact Seller</h3>
                <div className="flex flex-col gap-3">
                  <a
                    href={`tel:${whatsappNumber}`}
                    className="flex items-center gap-3 text-zinc-300 transition-colors hover:text-white"
                  >
                    <Phone className="h-5 w-5" />
                    <span>{whatsappNumber}</span>
                  </a>
                  {car.location && (
                    <div className="flex items-center gap-3 text-zinc-300">
                      <MapPin className="h-5 w-5" />
                      <span>{car.location}</span>
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
            <Card className="lg:col-span-2 border-white/10 bg-zinc-950/50 backdrop-blur">
              <CardContent className="p-6">
                <h2 className="mb-4 text-2xl font-bold text-white">Description</h2>
                <p className="leading-relaxed text-zinc-300">{car.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Additional Info */}
          <Card className="border-white/10 bg-zinc-950/50 backdrop-blur">
            <CardContent className="p-6">
              <h3 className="mb-4 text-xl font-bold text-white">Additional Information</h3>
              <div className="flex flex-col gap-3 text-sm">
                {car.condition && (
                  <div>
                    <p className="text-zinc-500">Condition</p>
                    <p className="font-semibold text-white">{car.condition}</p>
                  </div>
                )}
                {car.warranty && (
                  <div>
                    <p className="text-zinc-500">Warranty</p>
                    <p className="font-semibold text-white">{car.warranty}</p>
                  </div>
                )}
                {car.engine && (
                  <div>
                    <p className="text-zinc-500">Engine</p>
                    <p className="font-semibold text-white">{car.engine}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          {(car.interior_features || car.exterior_features) && (
            <Card className="lg:col-span-3 border-white/10 bg-zinc-950/50 backdrop-blur">
              <CardContent className="p-6">
                <h2 className="mb-6 text-2xl font-bold text-white">Features</h2>
                <div className="grid gap-6 md:grid-cols-2">
                  {car.interior_features && (
                    <div>
                      <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-white">
                        <Shield className="h-5 w-5" />
                        Interior Features
                      </h3>
                      <p className="leading-relaxed text-zinc-300">{car.interior_features}</p>
                    </div>
                  )}
                  {car.exterior_features && (
                    <div>
                      <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-white">
                        <Award className="h-5 w-5" />
                        Exterior Features
                      </h3>
                      <p className="leading-relaxed text-zinc-300">{car.exterior_features}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* CTA Section */}
        {car.status === "available" && (
          <Card className="mt-12 border-white/10 bg-zinc-950/50 backdrop-blur">
            <CardContent className="p-8 text-center">
              <h2 className="mb-4 font-display text-3xl font-bold text-white">Ready to Experience This Vehicle?</h2>
              <p className="mb-6 text-lg text-zinc-400">
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
