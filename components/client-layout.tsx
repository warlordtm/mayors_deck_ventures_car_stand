"use client"

import { usePathname } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import { SessionManager } from "@/components/session-manager"
import { CookieConsent } from "@/components/cookie-consent"
import { PageTransition } from "@/components/page-transition"

interface ClientLayoutProps {
  children: React.ReactNode
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  return (
    <>
      <SessionManager />
      {!isAdmin && <Header />}
      <PageTransition>
        {children}
      </PageTransition>
      {!isAdmin && <Footer />}
      {!isAdmin && <WhatsAppFloat />}
      {!isAdmin && <CookieConsent />}
    </>
  )
}