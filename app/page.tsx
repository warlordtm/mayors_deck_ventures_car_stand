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

      {/* About section moved to /about */}
      <SectionWrapper className="py-12">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-lg text-muted-foreground">
            Want to learn more about us? Visit our <a href="/about" className="text-accent font-medium">About page</a> to read about
            our curation and customer-first approach.
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
