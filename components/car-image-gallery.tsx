"use client"

import { useState } from "react"
import Image from "next/image"
import type { CarImage } from "@/lib/types"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CarImageGalleryProps {
  images: CarImage[]
  carName: string
}

export function CarImageGallery({ images, carName }: CarImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const currentImage =
    images.length > 0
      ? images[selectedIndex]?.image_url
      : `/placeholder.svg?height=600&width=800&query=${encodeURIComponent(carName)}`

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-card">
        <Image
          src={currentImage || "/placeholder.svg"}
          alt={`${carName} - Image ${selectedIndex + 1}`}
          fill
          className="object-cover"
        />

        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-card/50 text-foreground opacity-0 backdrop-blur transition-opacity hover:bg-card/70 group-hover:opacity-100"
              onClick={handlePrevious}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-card/50 text-foreground opacity-0 backdrop-blur transition-opacity hover:bg-card/70 group-hover:opacity-100"
              onClick={handleNext}
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>

            {/* Image Counter */}
            <div className="absolute bottom-4 right-4 rounded-full bg-card/50 px-3 py-1 text-sm text-foreground backdrop-blur">
              {selectedIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail Grid */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedIndex(index)}
              className={`relative aspect-square overflow-hidden rounded-lg border transition-all ${
                index === selectedIndex ? "border-border ring-2 ring-border" : "border-border/10 hover:border-border/30"
              }`}
            >
              <Image
                src={image.image_url || "/placeholder.svg"}
                alt={`${carName} thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
