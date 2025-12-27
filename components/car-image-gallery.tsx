"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import type { CarImage } from "@/lib/types"
import { ChevronLeft, ChevronRight, Play } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CarImageGalleryProps {
  images: CarImage[]
  carName: string
  videoUrl?: string | null
}

export function CarImageGallery({ images, carName, videoUrl }: CarImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Combine images and video into a single media array
  const mediaItems = [
    ...(videoUrl ? [{ type: 'video' as const, url: videoUrl, id: 'video' }] : []),
    ...images.map((img, index) => ({ type: 'image' as const, url: img.image_url, id: img.id, index }))
  ]

  const currentMedia = mediaItems[selectedIndex]

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1))
  }

  const scrollThumbnails = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 120
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="space-y-4">
      {/* Main Media Display */}
      <div className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-card">
        {currentMedia?.type === 'video' ? (
          <video
            controls
            className="h-full w-full object-contain"
            poster={images[0]?.image_url}
          >
            <source src={currentMedia.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <Image
            src={currentMedia?.url || `/placeholder.svg?height=600&width=800&query=${encodeURIComponent(carName)}`}
            alt={`${carName} - ${currentMedia?.type === 'video' ? 'Video' : 'Image ' + (selectedIndex + 1)}`}
            fill
            className="object-contain"
          />
        )}

        {/* Play icon overlay for video thumbnails */}
        {currentMedia?.type === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <Play className="h-16 w-16 text-white drop-shadow-lg" />
          </div>
        )}

        {mediaItems.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-card/50 text-foreground opacity-0 backdrop-blur transition-opacity hover:bg-card/70 group-hover:opacity-100"
              onClick={handlePrevious}
              aria-label="Previous media"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-card/50 text-foreground opacity-0 backdrop-blur transition-opacity hover:bg-card/70 group-hover:opacity-100"
              onClick={handleNext}
              aria-label="Next media"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>

            {/* Media Counter */}
            <div className="absolute bottom-4 right-4 rounded-full bg-card/50 px-3 py-1 text-sm text-foreground backdrop-blur">
              {selectedIndex + 1} / {mediaItems.length}
            </div>
          </>
        )}
      </div>

      {/* Scrollable Thumbnail Carousel */}
      {mediaItems.length > 1 && (
        <div className="relative">
          {/* Left scroll button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 z-10 -translate-y-1/2 bg-card/80 backdrop-blur hover:bg-card"
            onClick={() => scrollThumbnails('left')}
            aria-label="Scroll thumbnails left"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Thumbnails container */}
          <div
            ref={scrollRef}
            className="flex gap-2 overflow-x-auto scrollbar-hide px-8 py-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {mediaItems.map((media, index) => (
              <button
                key={media.id}
                onClick={() => setSelectedIndex(index)}
                className={`relative flex-shrink-0 aspect-square w-20 overflow-hidden rounded-lg border transition-all ${
                  index === selectedIndex ? "border-border ring-2 ring-border" : "border-border/10 hover:border-border/30"
                }`}
              >
                {media.type === 'video' ? (
                  <div className="relative h-full w-full">
                    <Image
                      src={images[0]?.image_url || "/placeholder.svg"}
                      alt={`${carName} video thumbnail`}
                      fill
                      className="object-contain"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Play className="h-6 w-6 text-white" />
                    </div>
                  </div>
                ) : (
                  <Image
                    src={media.url || "/placeholder.svg"}
                    alt={`${carName} thumbnail ${index + 1}`}
                    fill
                    className="object-contain"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Right scroll button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 z-10 -translate-y-1/2 bg-card/80 backdrop-blur hover:bg-card"
            onClick={() => scrollThumbnails('right')}
            aria-label="Scroll thumbnails right"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
