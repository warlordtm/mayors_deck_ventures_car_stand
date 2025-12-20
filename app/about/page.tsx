import React from "react"
import Image from "next/image"
import SectionWrapper from "@/components/section-wrapper"

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <SectionWrapper className="py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-5xl font-bold font-display text-foreground">About Gaskiya Auto</h1>
            <p className="text-xl text-muted-foreground">Where Trust Meets Luxury</p>
          </div>

          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative aspect-square max-w-md mx-auto lg:mx-0">
                <Image
                  src="/gaskiyauto.jpeg"
                  alt="Gaskiya Auto Team"
                  fill
                  className="rounded-2xl shadow-2xl object-cover"
                />
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-6">
              <h2 className="text-3xl font-bold font-display text-foreground">Our Founder</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Founded by visionary entrepreneur Gaskiya Kasim, Gaskiya Auto was born from a passion for
                exceptional automobiles and a commitment to integrity. With years of experience in the automotive
                industry, Gaskiya envisioned a dealership that prioritizes transparency, quality, and customer
                satisfaction above all else.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                "Gaskiya" means "truth" in Hausa, reflecting our core values of honesty and reliability in every
                transaction and interaction.
              </p>
            </div>
          </div>

          <div className="mt-16 space-y-8">
            <h2 className="text-4xl font-bold font-display text-foreground text-center">What We Offer</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="text-center">
                <h3 className="text-2xl font-bold font-display text-foreground mb-4">Curated Luxury Vehicles</h3>
                <p className="text-muted-foreground">
                  Hand-selected collection of certified pre-owned and new luxury vehicles from top brands like
                  Ferrari, Lamborghini, Rolls-Royce, and more.
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold font-display text-foreground mb-4">Transparent Pricing</h3>
                <p className="text-muted-foreground">
                  No hidden fees or surprises. We provide clear, competitive pricing with full disclosure of
                  vehicle history and condition.
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold font-display text-foreground mb-4">White-Glove Service</h3>
                <p className="text-muted-foreground">
                  Personalized attention from purchase to ownership. Our expert team handles everything from
                  financing to maintenance recommendations.
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold font-display text-foreground mb-4">Certified Quality</h3>
                <p className="text-muted-foreground">
                  Every vehicle undergoes rigorous inspection and comes with comprehensive warranty options
                  for peace of mind.
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold font-display text-foreground mb-4">Test Drive Experience</h3>
                <p className="text-muted-foreground">
                  Schedule exclusive test drives in our premium facilities. Experience the thrill of luxury
                  driving firsthand.
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold font-display text-foreground mb-4">Ongoing Support</h3>
                <p className="text-muted-foreground">
                  Beyond the sale, we're here for you. Access to our network of certified mechanics and
                  continued concierge services.
                </p>
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>
    </main>
  )
}
