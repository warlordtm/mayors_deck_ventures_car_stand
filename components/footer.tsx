"use client"

import Link from "next/link"
import { Phone, Mail, MapPin, Instagram, Music } from "lucide-react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export function Footer() {
  const [user, setUser] = useState<any>(null)
  const [settings, setSettings] = useState<Record<string, string | null>>({})
  const [categories, setCategories] = useState([])
  const pathname = usePathname()

  useEffect(() => {
    const supabase = createClient()
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/site-settings')
        const data = await response.json()
        setSettings(data.settings || {})
      } catch (error) {
        console.error('Error fetching site settings:', error)
      }
    }

    fetchSettings()
  }, [])

  // Hide footer on admin pages
  if (pathname?.startsWith('/admin')) return null
  return (
  <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-5">
          <div>
            <h3 className="mb-4 text-lg font-bold text-foreground">{settings.brand_name || 'Gaskiya Auto'}</h3>
            <p className="text-sm text-muted-foreground">{settings.brand_tagline || 'Luxury. Confidence. Trust.'}</p>
          </div>

          <div className="text-center md:text-left">
            <h4 className="mb-4 text-sm font-semibold text-foreground">Quick Links</h4>
            <div className="flex flex-col gap-2 items-center md:items-start">
              <Link href="/inventory" className="text-sm text-muted-foreground transition-colors hover:text-accent">
                Inventory
              </Link>
              <Link href="/categories" className="text-sm text-muted-foreground transition-colors hover:text-accent">
                Categories
              </Link>
            </div>
          </div>

          <div className="text-center md:text-left">
            <h4 className="mb-4 text-sm font-semibold text-foreground">Categories</h4>
            <div className="flex flex-col gap-2 items-center md:items-start">
              <Link href="/categories" className="text-sm text-muted-foreground transition-colors hover:text-accent">
                Supercars
              </Link>
              <Link href="/categories" className="text-sm text-muted-foreground transition-colors hover:text-accent">
                SUVs
              </Link>
              <Link href="/categories" className="text-sm text-muted-foreground transition-colors hover:text-accent">
                Sedans
              </Link>
              <Link href="/categories" className="text-sm text-muted-foreground transition-colors hover:text-accent">
                Performance Cars
              </Link>
              <Link href="/categories" className="text-sm text-muted-foreground transition-colors hover:text-accent">
                Electric Cars
              </Link>
            </div>
          </div>

          <div className="text-center md:text-left">
            <h4 className="mb-4 text-sm font-semibold text-foreground">Contact</h4>
            <div className="flex flex-col gap-3 items-center md:items-start">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{settings.contact_phone || '+234 814 449 3084'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{settings.contact_email || 'hello.gaskiyaautos@gmail.com'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Opposite Small NNPC Filling Station, Oladipo Diya Street, Abuja</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {settings.brand_name || 'Gaskiya Auto'}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
