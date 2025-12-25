"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CarImageGallery } from "@/components/car-image-gallery"
import { Heart, ArrowRight } from "lucide-react"
import type { UserFavorite } from "@/lib/types"

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<UserFavorite[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadFavorites = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }

      const { data, error } = await supabase
        .from("user_favorites")
        .select(`
          *,
          car:cars(*, images:car_images(*))
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error loading favorites:", error)
      } else {
        setFavorites(data || [])
      }

      setLoading(false)
    }

    loadFavorites()
  }, [router])

  const removeFavorite = async (carId: string) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return

    const { error } = await supabase
      .from("user_favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("car_id", carId)

    if (!error) {
      setFavorites(favorites.filter(fav => fav.car_id !== carId))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">Loading your favorites...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-foreground">My Watchlist</h1>
          <p className="text-muted-foreground">Your saved cars for later</p>
        </div>

        {favorites.length === 0 ? (
          <Card className="border-border bg-card/50 backdrop-blur">
            <CardContent className="p-12 text-center">
              <Heart className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
              <h3 className="mb-2 text-xl font-semibold text-foreground">No favorites yet</h3>
              <p className="mb-6 text-muted-foreground">
                Start browsing cars and add them to your watchlist by clicking the heart icon.
              </p>
              <Button asChild>
                <Link href="/cars">
                  Browse Cars <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {favorites.map((favorite) => {
              const car = favorite.car
              if (!car) return null

              const sortedImages = car.images?.sort((a: any, b: any) => {
                if (a.is_primary) return -1
                if (b.is_primary) return 1
                return a.display_order - b.display_order
              })

              return (
                <Card key={favorite.id} className="border-border bg-card/50 backdrop-blur overflow-hidden">
                  <div className="aspect-video relative">
                    <CarImageGallery
                      images={sortedImages || []}
                      carName={car.name}
                      videoUrl={car.video_url}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeFavorite(car.id)}
                      className="absolute top-2 right-2 bg-white/90 hover:bg-white border-border"
                    >
                      <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                    </Button>
                  </div>

                  <CardContent className="p-6">
                    <div className="mb-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">{car.name}</h3>
                          <p className="text-sm text-muted-foreground">{car.model} • {car.year}</p>
                        </div>
                        {car.is_featured && (
                          <Badge className="bg-white text-black">
                            Featured
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {car.category && (
                          <Badge variant="outline" className="text-xs border-border text-muted-foreground">
                            {car.category.name}
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs border-border text-muted-foreground">
                          {car.brand}
                        </Badge>
                        {car.status !== "available" && (
                          <Badge variant="destructive" className="text-xs capitalize">
                            {car.status}
                          </Badge>
                        )}
                      </div>

                      {car.show_price && car.price ? (
                        <p className="text-xl font-bold text-foreground">₦{(car.price * 1600).toLocaleString('en-NG')}</p>
                      ) : (
                        <p className="text-sm text-muted-foreground">Contact seller for best price</p>
                      )}
                    </div>

                    <Button asChild className="w-full">
                      <Link href={`/cars/${car.slug || car.id}`}>
                        View Details <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}