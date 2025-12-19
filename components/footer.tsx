import Link from "next/link"
import { Phone, Mail, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-bold text-white">Sarkin Mota Autos</h3>
            <p className="text-sm text-zinc-400">Luxury. Confidence. Trust.</p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <Link href="/inventory" className="text-sm text-zinc-400 transition-colors hover:text-white">
                Inventory
              </Link>
              <Link href="/categories" className="text-sm text-zinc-400 transition-colors hover:text-white">
                Categories
              </Link>
              <Link href="/test-drive" className="text-sm text-zinc-400 transition-colors hover:text-white">
                Test Drive
              </Link>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">Categories</h4>
            <div className="flex flex-col gap-2">
              <Link href="/category/supercars" className="text-sm text-zinc-400 transition-colors hover:text-white">
                Supercars
              </Link>
              <Link href="/category/suvs" className="text-sm text-zinc-400 transition-colors hover:text-white">
                SUVs
              </Link>
              <Link href="/category/sedans" className="text-sm text-zinc-400 transition-colors hover:text-white">
                Sedans
              </Link>
              <Link
                href="/category/performance-cars"
                className="text-sm text-zinc-400 transition-colors hover:text-white"
              >
                Performance Cars
              </Link>
              <Link href="/category/electric-cars" className="text-sm text-zinc-400 transition-colors hover:text-white">
                Electric Cars
              </Link>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">Contact</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Phone className="h-4 w-4" />
                <span>+234 800 000 0000</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Mail className="h-4 w-4" />
                <span>hello@sarkimota.autos</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <MapPin className="h-4 w-4" />
                <span>Kano, Nigeria</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-8 text-center text-sm text-zinc-500">
          <p>&copy; {new Date().getFullYear()} Sarkin Mota Autos. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
