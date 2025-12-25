"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [resetMessage, setResetMessage] = useState("")
  const router = useRouter()

  // Handle Supabase auth redirects
  useEffect(() => {
    const handleAuthCallback = async () => {
      const supabase = createClient()
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error('Auth callback error:', error)
        setError('Authentication error. Please try logging in manually.')
      } else if (data.session) {
        // User is authenticated, redirect appropriately
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.session.user.id)
          .single()

        if (profile?.role === 'admin') {
          router.push("/admin/dashboard")
        } else {
          router.push("/favorites")
        }
      }
    }

    // Check for auth callback on page load
    handleAuthCallback()
  }, [router])

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)
    setResetMessage("")

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      })

      if (error) throw error

      setResetMessage("Password reset link sent to your email!")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error

      // Fetch or create user profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", authData.user.id)
        .single()

      if (profileError && profileError.code !== 'PGRST116') { // PGRST116 is "not found"
        throw profileError
      }

      let userRole = 'user' // default

      if (profile) {
        userRole = profile.role
      } else {
        // Create profile if not exists
        const { error: insertError } = await supabase
          .from("profiles")
          .insert({ id: authData.user.id, role: 'user' })
        if (insertError) throw insertError
      }

      // Redirect based on role
      if (userRole === 'admin') {
        router.push("/admin/dashboard")
      } else {
        router.push("/favorites")
      }
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm">
        <Card className="border-border bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl text-foreground text-center">LOGIN</CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {showForgotPassword ? (
              // Forgot Password Form
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-foreground">Reset Password</h3>
                  <p className="text-sm text-muted-foreground">Enter your email to receive a reset link</p>
                </div>

                <form onSubmit={handleForgotPassword}>
                  <div className="flex flex-col gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="resetEmail" className="text-muted-foreground">
                        Email
                      </Label>
                      <Input
                        id="resetEmail"
                        type="email"
                        placeholder="user@example.com"
                        required
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="border-border bg-card text-foreground"
                      />
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    {resetMessage && <p className="text-sm text-green-600">{resetMessage}</p>}
                    <Button type="submit" className="w-full bg-white text-black hover:bg-zinc-200" disabled={isLoading}>
                      {isLoading ? "Sending..." : "Send Reset Link"}
                    </Button>
                  </div>
                </form>

                <div className="text-center">
                  <button
                    onClick={() => setShowForgotPassword(false)}
                    className="text-sm text-primary hover:underline"
                  >
                    Back to Login
                  </button>
                </div>
              </div>
            ) : (
              // Login Form
              <div className="space-y-4">
                <form onSubmit={handleLogin}>
                  <div className="flex flex-col gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="email" className="text-muted-foreground">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="user@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border-border bg-card text-foreground"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password" className="text-muted-foreground">
                        Password
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border-border bg-card text-foreground"
                      />
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <Button type="submit" className="w-full bg-white text-black hover:bg-zinc-200" disabled={isLoading}>
                      {isLoading ? "Logging in..." : "Login"}
                    </Button>
                  </div>
                </form>

                <div className="text-center">
                  <button
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot your password?
                  </button>
                </div>
              </div>
            )}

            <div className="mt-4 text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Link href="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}