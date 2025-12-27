import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Calendar, Gauge, Fuel, Settings, MapPin, Phone, MessageCircle, Shield, Award, ArrowRight, Heart } from "lucide-react"
import { CarImageGallery } from "@/components/car-image-gallery"
import type { CarImage } from "@/lib/types"
import { FavoriteButton } from "@/components/favorite-button"
import { ImpressionTracker } from "@/components/impression-tracker"

export default async function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  // First, try to find by primary id.
  let { data: car } = await supabase
    .from("cars")
    .select(`
      *,
      category:categories(*),
      images:car_images(*)
    `)
    .eq("id", id)
    .single()

  // If not found by id, attempt to find by slug (human-friendly URLs).
  if (!car) {
    const { data: carBySlug } = await supabase
      .from("cars")
      .select(`
        *,
        category:categories(*),
        images:car_images(*)
      `)
      .eq("slug", id)
      .single()

    car = carBySlug
  }

  // Fallback to sample cars if not found in database
  if (!car) {
    const sampleCars = [
      {
        id: "car-1",
        name: "Aston Martin DB11",
        model: "DB11",
        year: 2020,
        brand: "Aston Martin",
        price: 150000 * 1600,
        show_price: true,
        description: "Experience the pinnacle of automotive excellence with this 2020 Aston Martin DB11. This masterpiece combines breathtaking performance with unparalleled luxury, featuring cutting-edge technology and premium materials throughout.",
        engine: "V12 5.2L",
        mileage: "10000",
        transmission: "Automatic",
        fuel_type: "Petrol",
        interior_features: "Leather upholstery, Premium audio system, Climate control, Navigation",
        exterior_features: "LED headlights, Alloy wheels, Carbon fiber accents, Sport exhaust",
        condition: "Excellent",
        warranty: "2 years remaining",
        location: "Lagos, Nigeria",
        status: "available",
        is_featured: true,
        images: [{ image_url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=60", is_primary: true }],
      },
      {
        id: "car-2",
        name: "Ferrari Roma",
        model: "Roma",
        year: 2021,
        brand: "Ferrari",
        price: 175000 * 1600,
        show_price: true,
        description: "Experience the pinnacle of automotive excellence with this 2021 Ferrari Roma. This masterpiece combines breathtaking performance with unparalleled luxury, featuring cutting-edge technology and premium materials throughout.",
        engine: "V8 3.9L Twin-Turbo",
        mileage: "15000",
        transmission: "Automatic",
        fuel_type: "Petrol",
        interior_features: "Leather upholstery, Premium audio system, Climate control, Navigation",
        exterior_features: "LED headlights, Alloy wheels, Carbon fiber accents, Sport exhaust",
        condition: "Excellent",
        warranty: "2 years remaining",
        location: "Lagos, Nigeria",
        status: "available",
        is_featured: true,
        images: [{ image_url: "https://images.unsplash.com/photo-1544829099-b9a0e3421ec4?auto=format&fit=crop&w=1400&q=60", is_primary: true }],
      },
      {
        id: "car-3",
        name: "Porsche 911",
        model: "911 Carrera",
        year: 2022,
        brand: "Porsche",
        price: 200000 * 1600,
        show_price: true,
        description: "Experience the pinnacle of automotive excellence with this 2022 Porsche 911 Carrera. This masterpiece combines breathtaking performance with unparalleled luxury, featuring cutting-edge technology and premium materials throughout.",
        engine: "Flat-6 3.0L Twin-Turbo",
        mileage: "20000",
        transmission: "Automatic",
        fuel_type: "Petrol",
        interior_features: "Leather upholstery, Premium audio system, Climate control, Navigation",
        exterior_features: "LED headlights, Alloy wheels, Carbon fiber accents, Sport exhaust",
        condition: "Excellent",
        warranty: "2 years remaining",
        location: "Lagos, Nigeria",
        status: "available",
        is_featured: true,
        images: [{ image_url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=60", is_primary: true }],
      },
      {
        id: "car-4",
        name: "Lamborghini Huracan",
        model: "Huracan",
        year: 2023,
        brand: "Lamborghini",
        price: 225000 * 1600,
        show_price: true,
        description: "Experience the pinnacle of automotive excellence with this 2023 Lamborghini Huracan. This masterpiece combines breathtaking performance with unparalleled luxury, featuring cutting-edge technology and premium materials throughout.",
        engine: "V10 5.2L",
        mileage: "25000",
        transmission: "Automatic",
        fuel_type: "Petrol",
        interior_features: "Leather upholstery, Premium audio system, Climate control, Navigation",
        exterior_features: "LED headlights, Alloy wheels, Carbon fiber accents, Sport exhaust",
        condition: "Excellent",
        warranty: "2 years remaining",
        location: "Lagos, Nigeria",
        status: "available",
        is_featured: true,
        images: [{ image_url: "https://images.unsplash.com/photo-1544829099-b9a0e3421ec4?auto=format&fit=crop&w=1400&q=60", is_primary: true }],
      },
    ]

    const sampleCar = sampleCars.find(c => c.id === id)
    if (!sampleCar) {
      notFound()
    }

    car = sampleCar as any // Type assertion for sample data
  }

  const sortedImages = car.images?.sort((a: CarImage, b: CarImage) => {
    if (a.is_primary) return -1
    if (b.is_primary) return 1
    return a.display_order - b.display_order
  })

  const whatsappNumber = "+2348144493084"
  const whatsappMessage = encodeURIComponent(`Hi, I'm interested in the ${car.name} (${car.year})`)

  return (
    <div className="min-h-screen py-20">
      <ImpressionTracker carId={car.id} />
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
          {/* Media Gallery */}
          <div>
            <CarImageGallery
              images={sortedImages || []}
              carName={car.name}
              videoUrl={car.video_url}
            />
          </div>

          {/* Car Details */}
          <div>
            <div className="mb-6">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h1 className="mb-2 font-display text-4xl font-bold text-foreground md:text-5xl">{car.name}</h1>
                  <p className="text-xl text-muted-foreground">
                    {car.model} • {car.year} • {car.engine}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <FavoriteButton carId={car.id} />
                  {car.is_featured && (
                    <Badge className="bg-white text-black">
                      <Award className="mr-1 h-3 w-3" />
                      Featured
                    </Badge>
                  )}
                </div>
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
                  <p className="text-4xl font-bold text-foreground">₦{(car.price * 1600).toLocaleString('en-NG')}</p>
                </div>
              ) : (
                <div className="mb-6">
                  <p className="text-2xl text-muted-foreground">Contact seller for best price</p>
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
                <Button
                  asChild
                  className="flex-1 bg-white text-black hover:bg-zinc-200"
                  size="lg"
                >
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hi, I'm interested in purchasing the ${car.name} (${car.year})`)}`}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Buy Now
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
          {car.description ? (
            <Card className="lg:col-span-2 border-border bg-card/50 backdrop-blur">
              <CardContent className="p-6">
                <h2 className="mb-4 text-2xl font-bold text-foreground">Description</h2>
                <p className="leading-relaxed text-muted-foreground">{car.description}</p>
              </CardContent>
            </Card>
          ) : (
            <Card className="lg:col-span-2 border-border bg-card/50 backdrop-blur">
              <CardContent className="p-6">
                <h2 className="mb-4 text-2xl font-bold text-foreground">About This Vehicle</h2>
                <div className="space-y-4">
                  <p className="leading-relaxed text-muted-foreground">
                    The {car.name} is a masterpiece of automotive engineering, combining breathtaking performance with
                    unparalleled luxury. This {car.year} model represents the pinnacle of {car.brand}'s craftsmanship,
                    featuring cutting-edge technology and premium materials throughout.
                  </p>
                  <p className="leading-relaxed text-muted-foreground">
                    With its distinctive design and powerful {car.engine || 'engine'}, this vehicle delivers an
                    exhilarating driving experience that turns every journey into an adventure. The sophisticated
                    interior provides comfort and refinement, making it perfect for both daily commutes and special occasions.
                  </p>
                  <p className="leading-relaxed text-muted-foreground">
                    Every detail has been meticulously crafted to ensure exceptional quality and reliability.
                    This vehicle comes with comprehensive documentation and is ready for immediate delivery.
                  </p>
                </div>
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
              <h2 className="mb-4 font-display text-3xl font-bold text-foreground">Ready to Own This Vehicle?</h2>
              <p className="mb-6 text-lg text-muted-foreground">
                Contact us to start the purchase process
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button asChild size="lg" className="bg-white text-black hover:bg-zinc-200">
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hi, I'm interested in purchasing the ${car.name} (${car.year})`)}`}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Buy Now <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
