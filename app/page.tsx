import { createClient } from "@/lib/supabase/server"
import type { Car, Category } from "@/lib/types"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { CarCard } from "@/components/car-card"
import { ArrowRight, Zap, Shield, Award } from "lucide-react"

export default async function HomePage() {
  const supabase = await createClient()

  // Fetch featured cars
  const { data: featuredCars } = await supabase
    .from("cars")
    .select(`
      *,
      category:categories(*),
      images:car_images(*)
    `)
    .eq("is_featured", true)
    .eq("status", "available")
    .order("created_at", { ascending: false })
    .limit(3)

  // Fetch categories
  const { data: categories } = await supabase.from("categories").select("*").order("name")

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/luxury-sports-car-dynamic-angle-showroom.jpg"
            alt="Luxury sports car"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-background/60 to-background" />
        </div>

        <div className="container relative z-10 px-4">
          <div className="max-w-5xl">
            <div className="mb-4 inline-block rounded-full border border-accent/40 bg-accent/5 px-6 py-2 backdrop-blur-sm">
              <span className="text-sm font-semibold uppercase tracking-wider text-accent">Performance Redefined</span>
            </div>
            <h1 className="mb-8 font-display text-6xl font-bold leading-[1.1] tracking-tight text-foreground md:text-8xl lg:text-7xl">
              <span className="text-balance block bg-gradient-to-r from-primary via-accent to-accent bg-clip-text text-transparent">
                Sarkin Mota Autos
              </span>
            </h1>
            <p className="mb-12 max-w-2xl text-balance text-xl leading-relaxed text-muted-foreground md:text-2xl">
              Experience automotive excellence where cutting-edge engineering meets uncompromising luxury. Your journey
              to perfection starts here.
            </p>
            <div className="flex flex-col items-start gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-14 px-8 text-base font-semibold shadow-xl shadow-accent/20 bg-accent hover:bg-accent/90"
              >
                <Link href="/cars">
                  Explore Collection <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-14 border-2 px-8 text-base font-semibold bg-transparent"
              >
                <Link href="/test-drive">Book Test Drive</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce">
          <div className="flex h-12 w-8 items-start justify-center rounded-full border-2 border-accent/40 p-2">
            <div className="h-2 w-1 animate-pulse rounded-full bg-accent" />
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="border-y border-border bg-secondary/30 py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-display text-4xl font-bold text-foreground md:text-5xl">Why Elite Motors</h2>
            <p className="text-lg text-muted-foreground">Excellence in every detail</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 text-center transition-all hover:border-accent hover:shadow-lg hover:shadow-accent/10">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-accent/10 transition-transform group-hover:scale-110">
                <Zap className="h-10 w-10 text-accent" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-foreground">Premium Selection</h3>
              <p className="text-muted-foreground">
                Hand-picked luxury vehicles from world-renowned brands, curated for perfection
              </p>
            </div>
            <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 text-center transition-all hover:border-accent hover:shadow-lg hover:shadow-accent/10">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-accent/10 transition-transform group-hover:scale-110">
                <Shield className="h-10 w-10 text-accent" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-foreground">Certified Quality</h3>
              <p className="text-muted-foreground">
                Every vehicle undergoes rigorous inspection and certification for your peace of mind
              </p>
            </div>
            <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 text-center transition-all hover:border-accent hover:shadow-lg hover:shadow-accent/10">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-accent/10 transition-transform group-hover:scale-110">
                <Award className="h-10 w-10 text-accent" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-foreground">Expert Service</h3>
              <p className="text-muted-foreground">
                Dedicated specialists to guide your luxury car journey every step of the way
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-display text-5xl font-bold text-foreground md:text-6xl">Browse Collections</h2>
            <p className="text-xl text-muted-foreground">Find your perfect match in our curated categories</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories?.map((category: Category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-lg transition-all hover:shadow-2xl hover:shadow-accent/20"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={`/.jpg?key=zxgnf&height=400&width=600&query=${encodeURIComponent(category.name + " luxury cars")}`}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-90" />
                  <div className="absolute inset-0 bg-accent/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="mb-3 font-display text-3xl font-bold text-foreground">{category.name}</h3>
                  {category.description && <p className="text-sm text-muted-foreground">{category.description}</p>}
                  <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent">
                    Explore <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cars Section */}
      {featuredCars && featuredCars.length > 0 && (
        <section className="border-t border-border bg-secondary/20 py-24">
          <div className="container mx-auto px-4">
            <div className="mb-16 flex flex-col items-center justify-between gap-6 md:flex-row md:items-end">
              <div>
                <h2 className="mb-4 font-display text-5xl font-bold text-foreground md:text-6xl">
                  Featured Collection
                </h2>
                <p className="text-xl text-muted-foreground">Exceptional vehicles for discerning enthusiasts</p>
              </div>
              <Button asChild variant="outline" className="hidden border-2 md:flex bg-transparent">
                <Link href="/cars">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featuredCars.map((car: Car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>

            <div className="mt-12 text-center md:hidden">
              <Button asChild variant="outline" className="border-2 bg-transparent">
                <Link href="/cars">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Test Drive CTA Section */}
      <section className="relative overflow-hidden border-y border-border py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-secondary/20 to-accent/10" />
        <div className="container relative mx-auto px-4 text-center">
          <h2 className="mb-6 font-display text-5xl font-bold text-foreground md:text-6xl">Experience Excellence</h2>
          <p className="mx-auto mb-10 max-w-3xl text-balance text-xl leading-relaxed text-muted-foreground">
            Book a premium test drive experience with white-glove service at your preferred location. Feel the power,
            embrace the luxury.
          </p>
          <Button
            asChild
            size="lg"
            className="h-14 px-10 text-base font-semibold shadow-2xl shadow-accent/30 bg-accent hover:bg-accent/90"
          >
            <Link href="/test-drive">
              Book Your Test Drive <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
