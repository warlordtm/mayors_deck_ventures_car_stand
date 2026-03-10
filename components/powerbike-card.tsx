import Link from "next/link"
import Image from "next/image"
import type { Powerbike } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MotionDiv } from "@/components/motion-wrappers"

interface PowerbikeCardProps {
  powerbike: Powerbike & { images?: { image_url: string; is_primary: boolean }[] }
}

export function PowerbikeCard({ powerbike }: PowerbikeCardProps) {
  const primaryImage = powerbike.images?.find((img) => img.is_primary) || powerbike.images?.[0]
  const imageUrl =
    primaryImage?.image_url || `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(powerbike.name)}`

  return (
    <MotionDiv
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card className="group overflow-hidden border-border bg-card/50 backdrop-blur transition-all hover:border-accent/50 hover:shadow-xl hover:shadow-accent/10">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={powerbike.name}
            fill
            className="object-contain transition-transform duration-700 group-hover:scale-110"
          />
          {powerbike.is_featured && <Badge className="absolute left-3 top-3 bg-white text-black">Featured</Badge>}
          {powerbike.status !== "available" && (
            <Badge className="absolute right-3 top-3 bg-red-500 text-white capitalize">{powerbike.status}</Badge>
          )}
        </div>
        <div className="p-6">
          <h3 className="mb-4 text-xl font-bold text-foreground text-center">{powerbike.name}</h3>

          <div className="mb-4">
            {powerbike.show_price && powerbike.price ? (
              <p className="text-2xl font-bold text-foreground text-center">₦{powerbike.price.toLocaleString('en-NG')}</p>
            ) : (
              <p className="text-lg text-muted-foreground text-center">Contact for best price</p>
            )}
          </div>

          <div className="flex gap-2">
            <Button asChild className="flex-1 bg-white text-black hover:bg-zinc-200 hover:scale-105 transition-all">
              <Link href={`/powerbikes/${powerbike.id}`}>View Details</Link>
            </Button>
          </div>
        </div>
      </Card>
    </MotionDiv>
  )
}