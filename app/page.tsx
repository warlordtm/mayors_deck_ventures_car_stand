import React from "react"
import Hero from "@/components/hero"
import FeaturedVehicles from "@/components/featured-vehicles"
import TrustPillars from "@/components/trust-pillars"
import ContactForm from "@/components/contact-form"
import SectionWrapper from "@/components/section-wrapper"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero />

      <SectionWrapper>
        <FeaturedVehicles />
      </SectionWrapper>

      <SectionWrapper>
        <TrustPillars />
      </SectionWrapper>

      <SectionWrapper className="py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-4xl font-bold text-white">About Sarkin Mota Autos</h2>
          <p className="mb-6 text-lg text-zinc-300">
            Sarkin Mota Autos is a premier dealership focused on hand-selected, certified luxury vehicles. We pair
            meticulous curation with transparent pricing and a white-glove customer experience — because your next
            vehicle should be as exceptional as you are.
          </p>
        </div>
      </SectionWrapper>

      <SectionWrapper>
        <div className="mx-auto max-w-3xl">
          <ContactForm />
        </div>
      </SectionWrapper>
    </main>
  )
}
