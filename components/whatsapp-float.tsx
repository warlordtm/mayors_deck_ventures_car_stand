"use client"

import { MessageCircle } from "lucide-react"

export function WhatsAppFloat() {
  const handleClick = () => {
    const message = encodeURIComponent("Hi, I'm interested in learning more about your luxury cars.")
    window.open(`https://wa.me/+1234567890?text=${message}`, "_blank")
  }

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-transform hover:scale-110 hover:bg-green-600"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
    </button>
  )
}
