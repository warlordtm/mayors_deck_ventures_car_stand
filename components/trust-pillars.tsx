"use client"

import React, { useEffect, useState } from "react"
import { ShieldCheck, Users, Eye, Smile } from "lucide-react"

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
          block.key.startsWith('trust_pillar_')
        ).sort((a: ContentBlock, b: ContentBlock) => a.display_order - b.display_order) || []
        setPillars(pillarBlocks)
      } catch (error) {
        console.error('Error fetching trust pillars:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPillars()
  }, [])

  const getIcon = (index: number) => {
    const icons = [<ShieldCheck className="h-8 w-8 text-accent" />, <Users className="h-8 w-8 text-accent" />, <Eye className="h-8 w-8 text-accent" />, <Smile className="h-8 w-8 text-accent" />]
    return icons[index] || icons[0]
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
          {pillars.map((p, index) => (
            <div key={p.id} className="rounded-2xl border border-border bg-card p-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-accent/10">
                {getIcon(index)}
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">{p.title}</h3>
              <p className="text-sm text-muted-foreground">{p.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TrustPillars
