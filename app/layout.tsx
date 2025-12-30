import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import { ThemeProvider } from "@/components/theme-provider"
import { ClientLayout } from "@/components/client-layout"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const _playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  variable: "--font-display",
})

export const metadata: Metadata = {
  title: "Gaskiya Auto - Luxury Car Dealership",
  description: "Gaskiya Auto — where luxury meets performance. Discover our curated collection of premium vehicles.",
  generator: "Godwin Bamisaye",
  manifest: "/manifest.json",
  icons: {
    icon: "/gaskiyaautologo.png",
    apple: "/gaskiyaautologo.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Gaskiya Auto",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Gaskiya Auto",
    title: "Gaskiya Auto - Luxury Car Dealership",
    description: "Where luxury meets performance. Discover our curated collection of premium vehicles.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gaskiya Auto - Luxury Car Dealership",
    description: "Where luxury meets performance. Discover our curated collection of premium vehicles.",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased ${_playfair.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          <ClientLayout>
            {children}
          </ClientLayout>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
