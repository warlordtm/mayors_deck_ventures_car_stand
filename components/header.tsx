"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur-xl shadow-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link href="/" className="font-display text-2xl font-bold tracking-tight text-primary">
          Gaskiya Auto
        </Link>
        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-10 md:flex">
          <Link href="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-accent">
            Home
          </Link>
          <Link href="/cars" className="text-sm font-medium text-muted-foreground transition-colors hover:text-accent">
            Collection
          </Link>
          <Link
            href="/categories"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-accent"
          >
            Categories
          </Link>
          <Link
            href="/test-drive"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-accent"
          >
            Test Drive
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-accent"
          >
            Contact
          </Link>
        </nav>
        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="border-t border-border bg-card/95 backdrop-blur-xl md:hidden">
          <div className="container mx-auto flex flex-col gap-4 p-6">
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-accent"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/cars"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-accent"
              onClick={() => setIsMenuOpen(false)}
            >
              Collection
            </Link>
            <Link
              href="/categories"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-accent"
              onClick={() => setIsMenuOpen(false)}
            >
              Categories
            </Link>
            <Link
              href="/test-drive"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-accent"
              onClick={() => setIsMenuOpen(false)}
            >
              Test Drive
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-accent"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}
