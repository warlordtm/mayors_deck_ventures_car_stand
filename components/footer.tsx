import Link from "next/link"
import { Phone, Mail, MapPin } from "lucide-react"

export function Footer() {
  return (
  <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-bold text-foreground">Gaskiya Auto</h3>
            <p className="text-sm text-muted-foreground">Luxury. Confidence. Trust.</p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <Link href="/inventory" className="text-sm text-muted-foreground transition-colors hover:text-accent">
                Inventory
              </Link>
              <Link href="/categories" className="text-sm text-muted-foreground transition-colors hover:text-accent">
                Categories
              </Link>
              <Link href="/test-drive" className="text-sm text-muted-foreground transition-colors hover:text-accent">
                Test Drive
              </Link>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">Categories</h4>
            <div className="flex flex-col gap-2">
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

          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">Contact</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+234 800 000 0000</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>hello@gaskiya.autos</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Kano, Nigeria</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Gaskiya Auto. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
