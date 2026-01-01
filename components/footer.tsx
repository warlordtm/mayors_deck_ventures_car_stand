"use client"

import Link from "next/link"
import { Phone, Mail, MapPin } from "lucide-react"
import { SiInstagram, SiTiktok } from "react-icons/si"
import { usePathname } from "next/navigation"

export function Footer() {
  const pathname = usePathname()

  // Hide footer on admin routes
  if (pathname?.startsWith("/admin")) return null

  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        {/* Main grid */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Coja Motors
            </h3>

            <p className="mt-2 max-w-xs text-sm text-muted-foreground">
              Luxury. Confidence. Trust.
            </p>

            <div className="mt-4 flex items-center gap-4">
              <Link
                href="https://tiktok.com/@gaskiyaautos1"
                target="_blank"
                aria-label="TikTok"
                className="text-muted-foreground transition hover:text-accent"
              >
                <SiTiktok className="h-5 w-5" />
              </Link>

              <Link
                href="https://instagram.com/@gaskiya_autos_"
                target="_blank"
                aria-label="Instagram"
                className="text-muted-foreground transition hover:text-accent"
              >
                <SiInstagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-sm font-medium text-foreground">
              Quick Links
            </h4>

            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/inventory"
                  className="text-muted-foreground transition hover:text-accent"
                >
                  Inventory
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-muted-foreground transition hover:text-accent"
                >
                  Categories
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="mb-4 text-sm font-medium text-foreground">
              Categories
            </h4>

            <ul className="space-y-2 text-sm">
              {[
                "Supercars",
                "SUVs",
                "Sedans",
                "Performance Cars",
                "Electric Cars",
              ].map((cat) => (
                <li key={cat}>
                  <Link
                    href="/categories"
                    className="text-muted-foreground transition hover:text-accent"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-sm font-medium text-foreground">
              Contact
            </h4>

            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4" />
                <span>+234 814 449 3084</span>
              </li>

              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4" />
                <span>contact@cojamotors.com</span>
              </li>

              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4" />
                <span>
                  Opposite Small NNPC Filling Station, Oladipo Diya Street, Abuja
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()}{" "}
          Coja Motors. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
