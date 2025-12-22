"use client"

import React, { useEffect, useState } from "react"
import { ShieldCheck, Users, Eye, Smile } from "lucide-react"
import FeatureCard from "./feature-card"

interface ContentBlock {
  id: string
  key: string
  title: string | null
  content: string | null
  image_url: string | null
  display_order: number
  is_active: boolean
}

export function TrustPillars() {
  const [pillars, setPillars] = useState<ContentBlock[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPillars = async () => {
      try {
        const response = await fetch('/api/content')
        const data = await response.json()
        const pillarBlocks = data.contentBlocks?.filter((block: ContentBlock) =>
          block.key.startsWith('trust_')
        ).sort((a: ContentBlock, b: ContentBlock) => a.display_order - b.display_order) || []
        setPillars(pillarBlocks.length > 0 ? pillarBlocks : [
          { id: '1', key: 'trust_verified_vehicles', title: 'Verified Vehicles', content: 'Comprehensive inspection and certification for every car in our collection.', image_url: null, display_order: 1, is_active: true },
          { id: '2', key: 'trust_trusted_dealers', title: 'Trusted Dealers', content: 'Long-standing relationships with factory-trained dealers and partners.', image_url: null, display_order: 2, is_active: true },
          { id: '3', key: 'trust_transparent_pricing', title: 'Transparent Pricing', content: 'Clear, upfront pricing — no hidden fees, straightforward offers.', image_url: null, display_order: 3, is_active: true },
          { id: '4', key: 'trust_premium_experience', title: 'Premium Experience', content: 'White-glove service from inquiry to delivery.', image_url: null, display_order: 4, is_active: true },
        ])
      } catch (error) {
        console.error('Error fetching trust pillars:', error)
        setPillars([
          { id: '1', key: 'trust_verified_vehicles', title: 'Verified Vehicles', content: 'Comprehensive inspection and certification for every car in our collection.', image_url: null, display_order: 1, is_active: true },
          { id: '2', key: 'trust_trusted_dealers', title: 'Trusted Dealers', content: 'Long-standing relationships with factory-trained dealers and partners.', image_url: null, display_order: 2, is_active: true },
          { id: '3', key: 'trust_transparent_pricing', title: 'Transparent Pricing', content: 'Clear, upfront pricing — no hidden fees, straightforward offers.', image_url: null, display_order: 3, is_active: true },
          { id: '4', key: 'trust_premium_experience', title: 'Premium Experience', content: 'White-glove service from inquiry to delivery.', image_url: null, display_order: 4, is_active: true },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchPillars()
  }, [])

  const getIcon = (title: string) => {
    const iconMap: Record<string, typeof ShieldCheck> = {
      "Verified Vehicles": ShieldCheck,
      "Trusted Dealers": Users,
      "Transparent Pricing": Eye,
      "Premium Experience": Smile,
    }
    return iconMap[title] || ShieldCheck
  }

  if (loading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">Loading...</div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-4xl font-bold text-foreground">Why Gaskiya Auto?</h2>
          <p className="text-lg text-muted-foreground">Trust pillars that define our promise to every customer.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p) => (
            <FeatureCard
              key={p.id}
              title={p.title || ""}
              content={p.content || ""}
              icon={getIcon(p.title || "")}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default TrustPillars
