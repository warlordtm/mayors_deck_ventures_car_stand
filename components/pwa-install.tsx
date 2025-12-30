"use client"

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download, X, Share } from 'lucide-react'

export function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstall, setShowInstall] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // Only enable PWA on mobile devices
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent)
    setIsIOS(isIOSDevice)

    if (!isMobile) return

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

    // Listen for the beforeinstallprompt event (Android/Chrome)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstall(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // For iOS, show install instructions after a delay
    if (isIOSDevice) {
      const timer = setTimeout(() => {
        setShowInstall(true)
      }, 3000) // Show after 3 seconds of interaction

      return () => {
        clearTimeout(timer)
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === 'accepted') {
        console.log('User accepted the install prompt')
      } else {
        console.log('User dismissed the install prompt')
      }

      setDeferredPrompt(null)
      setShowInstall(false)
    }
  }

  if (!showInstall) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
      <div className="bg-card border border-border rounded-lg p-4 shadow-lg">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
              {isIOS ? <Share className="h-5 w-5 text-primary-foreground" /> : <Download className="h-5 w-5 text-primary-foreground" />}
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Install Gaskiya Auto</h3>
              <p className="text-sm text-muted-foreground">
                {isIOS ? 'Add to Home Screen for the best experience' : 'Get the full app experience'}
              </p>
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
          {isIOS ? (
            <div className="w-full text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Tap the share button <Share className="inline h-4 w-4" /> and select "Add to Home Screen"
              </p>
              <Button variant="outline" onClick={() => setShowInstall(false)} className="w-full">
                Got it
              </Button>
            </div>
          ) : (
            <>
              <Button onClick={handleInstallClick} className="flex-1">
                Install App
              </Button>
              <Button variant="outline" onClick={() => setShowInstall(false)}>
                Not Now
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}











