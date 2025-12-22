"use client"

import React from "react"
import { ShieldCheck, Users, Eye, Smile, LucideIcon } from "lucide-react"

interface FeatureCardProps {
  title: string
  content: string
  icon: LucideIcon
}

export function FeatureCard({ title, content, icon: Icon }: FeatureCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-8 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-accent/10">
        <Icon className="h-8 w-8 text-accent" />
      </div>
      <h3 className="mb-2 text-xl font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground">{content}</p>
    </div>
  )
}

export default FeatureCard