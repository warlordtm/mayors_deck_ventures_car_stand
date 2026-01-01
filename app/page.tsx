import React from "react"
import Hero from "@/components/hero"
import FeaturedVehicles from "@/components/featured-vehicles"
import TrustPillars from "@/components/trust-pillars"
import SectionWrapper from "@/components/section-wrapper"
import { Card, CardContent } from "@/components/ui/card"
import { Phone, Mail, MapPin, MessageCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollReveal, MotionH2, MotionP } from "@/components/motion-wrappers"

export default function HomePage() {
  const whatsappNumber = "+2348144493084"
  const whatsappMessage = encodeURIComponent("Hi, I'd like to inquire about your luxury cars.")

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

      <SectionWrapper id="contact">
        <div className="container mx-auto px-4">
          <ScrollReveal className="mb-12 text-center">
            <MotionH2 className="mb-4 font-display text-4xl font-bold text-foreground md:text-5xl lg:text-6xl">Contact Us</MotionH2>
            <MotionP className="text-lg text-muted-foreground">Get in touch with our luxury car specialists</MotionP>
          </ScrollReveal>

          <ScrollReveal className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2" delay={0.2}>
            <Card className="border-border bg-card/50 backdrop-blur hover:scale-105 transition-transform">
              <CardContent className="p-8">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-card/10">
                  <Phone className="h-6 w-6 text-foreground" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">Phone</h3>
                <p className="mb-4 text-muted-foreground">Call us during business hours</p>
                <a href="tel:+2348144493084" className="text-lg text-foreground hover:underline">
                  +234 814 449 3084
                </a>
              </CardContent>
            </Card>

            <Card className="border-border bg-card/50 backdrop-blur hover:scale-105 transition-transform">
              <CardContent className="p-8">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-card/10">
                  <Mail className="h-6 w-6 text-foreground" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">Email</h3>
                <p className="mb-4 text-muted-foreground">Send us a message anytime</p>
                <a href="mailto:contact@elitemotors.com" className="text-lg text-foreground hover:underline">
                  contact.cojamotors@gmail.com
                </a>
              </CardContent>
            </Card>

            <Card className="border-border bg-card/50 backdrop-blur hover:scale-105 transition-transform">
              <CardContent className="p-8">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-card/10">
                  <MapPin className="h-6 w-6 text-foreground" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">Location</h3>
                <p className="mb-4 text-muted-foreground">Visit our showroom</p>
                <p className="text-lg text-foreground">Opposite Small NNPC Filling Station, Oladipo Diya Street, Abuja</p>
                <p className="text-sm text-muted-foreground mt-2">RC 7369483</p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card/50 backdrop-blur hover:scale-105 transition-transform">
              <CardContent className="p-8">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-card/10">
                  <Clock className="h-6 w-6 text-foreground" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">Hours</h3>
                <p className="mb-4 text-muted-foreground">Monday - Saturday</p>
                <p className="text-lg text-foreground">9:00 AM - 6:00 PM</p>
              </CardContent>
            </Card>
          </ScrollReveal>

          <ScrollReveal className="mx-auto mt-8 max-w-4xl" delay={0.4}>
            <Card className="border-border bg-card/50 backdrop-blur hover:scale-105 transition-transform">
              <CardContent className="p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
                  <MessageCircle className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="mb-4 font-display text-2xl font-bold text-foreground">Prefer WhatsApp?</h3>
                <p className="mb-6 text-muted-foreground">Chat with us directly for instant responses</p>
                <Button asChild size="lg" className="bg-green-500 text-white hover:bg-green-600 hover:scale-105 transition-all">
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Start WhatsApp Chat
                  </a>
                </Button>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      </SectionWrapper>
    </main>
  )
}
