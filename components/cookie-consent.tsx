"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Cookie } from "lucide-react"

export function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false)
  const [hasConsented, setHasConsented] = useState(false)

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      setShowConsent(true)
    } else {
      setHasConsented(true)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setHasConsented(true)
    setShowConsent(false)

    // Track initial visit
    trackUserVisit()
  }

  const declineCookies = () => {
    localStorage.setItem('cookie-consent', 'declined')
    setShowConsent(false)
  }

  const trackUserVisit = () => {
    // Track referrer and URL parameters for car searches
    const urlParams = new URLSearchParams(window.location.search)
    const referrer = document.referrer

    // Check for car search parameters (this would be customized based on your tracking needs)
    const carSearch = urlParams.get('car') || urlParams.get('model') || urlParams.get('search')

    if (carSearch || referrer.includes('google') || referrer.includes('bing') || referrer.includes('yahoo')) {
      const searchData = {
        car: carSearch,
        referrer: referrer,
        timestamp: Date.now(),
        url: window.location.href
      }

      // Store in localStorage (in production, you'd send to your analytics)
      const existingSearches = JSON.parse(localStorage.getItem('car-searches') || '[]')
      existingSearches.push(searchData)

      // Keep only last 10 searches
      if (existingSearches.length > 10) {
        existingSearches.shift()
      }

      localStorage.setItem('car-searches', JSON.stringify(existingSearches))
    }
  }

  if (!showConsent || hasConsented) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-md">
      <Card className="p-4 shadow-lg border-border bg-card/95 backdrop-blur">
        <div className="flex items-start gap-3">
          <Cookie className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground mb-2">Cookie Preferences</h3>
            <p className="text-sm text-muted-foreground mb-3">
              We use cookies to enhance your experience, remember your car searches, and show you relevant vehicles.
              By accepting, you'll see personalized car recommendations based on your interests.
            </p>
            <div className="flex gap-2">
              <Button onClick={acceptCookies} size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                Accept Cookies
              </Button>
              <Button onClick={declineCookies} variant="outline" size="sm">
                Decline
              </Button>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowConsent(false)}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  )
}