"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, User, LogOut, Heart } from "lucide-react"
import ThemeToggle from "@/components/theme-toggle"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        try {
          const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
          setIsAdmin(profile?.role === 'admin')
        } catch (e) {
          setIsAdmin(false)
        }
      }
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        supabase.from("profiles").select("role").eq("id", session.user.id).single().then(({ data }) => {
          setIsAdmin(data?.role === 'admin')
        })
      } else {
        setIsAdmin(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()

      // Redirect to login page with current domain
      const currentDomain = window.location.origin
      window.location.href = `${currentDomain}/login`
    } catch (error) {
      console.error('Logout error:', error)
      // Fallback redirect
      router.push("/login")
    }
  }

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
          <Link href="/about" className="text-sm font-medium text-muted-foreground transition-colors hover:text-accent">
            About
          </Link>
          <Link
            href="/categories"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-accent"
          >
            Categories
          </Link>
          <Link
            href="/#contact"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-accent"
          >
            Contact
          </Link>

          {/* Auth Buttons */}
          <div className="flex items-center gap-2 ml-2">
            {user ? (
              <div className="flex items-center gap-2">
                {!isAdmin && (
                  <Link href="/favorites">
                    <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent dark:hover:text-accent-foreground">
                      <Heart className="mr-2 h-4 w-4" />
                      My Watchlist
                    </Button>
                  </Link>
                )}
                {isAdmin && (
                  <Link href="/admin">
                    <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent dark:hover:text-accent-foreground">
                      Admin
                    </Button>
                  </Link>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="border-border text-muted-foreground hover:bg-red-500 hover:text-white hover:border-red-500"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent dark:hover:text-accent-foreground">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="bg-white text-black hover:bg-zinc-200">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
            <ThemeToggle />
          </div>
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
              href="/#contact"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-accent"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>

            {/* Mobile Auth Buttons */}
            <div className="border-t border-border pt-4 mt-2">
              {user ? (
                <div className="flex flex-col gap-2">
                  {!isAdmin && (
                    <Link href="/favorites" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full justify-start border-border text-muted-foreground hover:bg-card/10">
                        <Heart className="mr-2 h-4 w-4" />
                        My Watchlist
                      </Button>
                    </Link>
                  )}
                  {isAdmin && (
                    <Link href="/admin" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full justify-start border-border text-muted-foreground hover:bg-card/10">
                        <User className="mr-2 h-4 w-4" />
                        Admin Panel
                      </Button>
                    </Link>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className="w-full justify-start border-border text-muted-foreground hover:bg-red-500 hover:text-white hover:border-red-500"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full border-border text-muted-foreground hover:bg-accent dark:hover:bg-muted dark:hover:text-white">
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-white text-black hover:bg-zinc-200">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
              <div className="mt-4">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </nav>
      )}
    </header>
  )
}
