"use client"

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download, X } from 'lucide-react'

export function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstall, setShowInstall] = useState(false)

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration)
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError)
          })
      })
    }

    // Check if PWA is supported
    if ('standalone' in window.navigator || window.matchMedia('(display-mode: standalone)').matches) {
      // Already installed
      return
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstall(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Show install banner after 2 seconds
    const timer = setTimeout(() => {
      setShowInstall(true)
    }, 2000)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      clearTimeout(timer)
    }
  }, [])

  const handleInstallClick = async () => {
    // Hide the banner immediately after clicking
    setShowInstall(false)

    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === 'accepted') {
        console.log('User accepted the install prompt')
      } else {
        console.log('User dismissed the install prompt')
      }

      setDeferredPrompt(null)
    } else {
      // Try to trigger installation through browser menu
      // This will work on some browsers that support programmatic triggering
      if ('standalone' in window.navigator) {
        // iOS Safari
        alert('Tap the share button (⬆️) and select "Add to Home Screen"')
      } else {
        // Other browsers
        alert('Look for "Add to Home Screen" or "Install App" in your browser menu')
      }
    }
  }

  if (!showInstall) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
      <div className="bg-card border border-border rounded-lg p-4 shadow-lg">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
              <Download className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Install Gaskiya Auto</h3>
              <p className="text-sm text-muted-foreground">Get the full app experience</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowInstall(false)}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-4 flex gap-2">
          <Button onClick={handleInstallClick} className="flex-1">
            Install App
          </Button>
          <Button variant="outline" onClick={() => setShowInstall(false)}>
            Not Now
          </Button>
        </div>
      </div>
    </div>
  )
}