"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { MotionDiv } from "@/components/motion-wrappers"

export function CarCardSkeleton() {
  return (
    <MotionDiv
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-border bg-card/50 backdrop-blur p-6"
    >
      <Skeleton className="aspect-[4/3] w-full rounded-lg mb-4" />
      <Skeleton className="h-6 w-3/4 mx-auto mb-4" />
      <Skeleton className="h-8 w-1/2 mx-auto mb-4" />
      <Skeleton className="h-10 w-full" />
    </MotionDiv>
  )
}

export function FeatureCardSkeleton() {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-border bg-card p-8 text-center"
    >
      <Skeleton className="h-16 w-16 rounded-lg mx-auto mb-4" />
      <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
      <Skeleton className="h-4 w-full mx-auto" />
    </MotionDiv>
  )
}

export function HeroSkeleton() {
  return (
    <MotionDiv
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 z-0 bg-gray-900" />
      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
        <Skeleton className="h-12 w-64 mx-auto mb-6 rounded-full" />
        <Skeleton className="h-16 w-full max-w-2xl mx-auto mb-6" />
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Skeleton className="h-14 w-40" />
          <Skeleton className="h-14 w-40" />
          <Skeleton className="h-14 w-40" />
        </div>
      </div>
    </MotionDiv>
  )
}