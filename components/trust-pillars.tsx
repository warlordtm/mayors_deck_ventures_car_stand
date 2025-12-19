import React from "react"
import { ShieldCheck, Users, Eye, Smile } from "lucide-react"

export function TrustPillars() {
  const PILLARS = [
    {
      title: "Verified Vehicles",
      desc: "Comprehensive inspection and certification for every car in our collection.",
      icon: <ShieldCheck className="h-8 w-8 text-accent" />,
    },
    {
      title: "Trusted Dealers",
      desc: "Long-standing relationships with factory-trained dealers and partners.",
      icon: <Users className="h-8 w-8 text-accent" />,
    },
    {
      title: "Transparent Pricing",
      desc: "Clear, upfront pricing — no hidden fees, straightforward offers.",
      icon: <Eye className="h-8 w-8 text-accent" />,
    },
    {
      title: "Premium Experience",
      desc: "White-glove service from inquiry to delivery.",
      icon: <Smile className="h-8 w-8 text-accent" />,
    },
  ]

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-4xl font-bold text-white">Why Gaskiya Auto</h2>
          <p className="text-lg text-zinc-300">Trust pillars that define our promise to every customer.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p) => (
            <div key={p.title} className="rounded-2xl border border-border bg-card p-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-accent/10">
                {p.icon}
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">{p.title}</h3>
              <p className="text-sm text-zinc-400">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TrustPillars
