import Link from "next/link"
import Image from "next/image"
import type { Car } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface CarCardProps {
  car: Car & { images?: { image_url: string; is_primary: boolean }[] }
}

export function CarCard({ car }: CarCardProps) {
  const primaryImage = car.images?.find((img) => img.is_primary) || car.images?.[0]
  const imageUrl =
    primaryImage?.image_url || `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(car.name)}`

  return (
    <Card className="group overflow-hidden border-border bg-card/50 backdrop-blur transition-all hover:border-border">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={car.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {car.is_featured && <Badge className="absolute left-3 top-3 bg-white text-black">Featured</Badge>}
        {car.status !== "available" && (
          <Badge className="absolute right-3 top-3 bg-red-500 text-white capitalize">{car.status}</Badge>
        )}
      </div>
      <div className="p-6">
        <div className="mb-2 flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-foreground">{car.name}</h3>
            <p className="text-sm text-muted-foreground">
              {car.model} • {car.year}
            </p>
          </div>
        </div>

        <div className="mb-4 flex items-center gap-2">
          <Badge variant="outline" className="border-border text-muted-foreground">
            {car.brand}
          </Badge>
          {car.fuel_type && (
            <Badge variant="outline" className="border-border text-muted-foreground">
              {car.fuel_type}
            </Badge>
          )}
        </div>

        <div className="mb-4">
          {car.show_price && car.price ? (
            <p className="text-2xl font-bold text-foreground">₦{car.price.toLocaleString('en-NG')}</p>
          ) : (
            <p className="text-lg text-muted-foreground">Contact for best price</p>
          )}
        </div>

        <div className="flex gap-2">
          <Button asChild className="flex-1 bg-white text-black hover:bg-zinc-200">
            <Link href={`/cars/${car.id}`}>View Details</Link>
          </Button>
        </div>
      </div>
    </Card>
  )
}
