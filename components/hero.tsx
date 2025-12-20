"use client"

import Link from "next/link"
import { /* motion */ MotionDiv } from "@/components/motion-wrappers"
import Image from "next/image"
import React from "react"

export function Hero() {
  return (
    <header className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=1800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2Ftcnl8ZW58MHx8MHx8fDA%3D"
          alt="Luxury car showroom"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-transparent to-black/60" />
      </div>

      <MotionDiv
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 mx-auto max-w-5xl px-4 text-center"
      >
        <div className="mb-6 inline-block rounded-full border border-accent/20 bg-accent/5 px-5 py-2 backdrop-blur-sm">
          <span className="text-sm font-semibold uppercase tracking-wider text-accent">Majestic Collection</span>
        </div>
        <h1 className="mb-6 font-display text-5xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl md:text-7xl">
          Driving Excellence. Defining Prestige.
        </h1>

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/inventory"
            className="inline-flex h-14 items-center justify-center rounded-md bg-accent px-8 text-base font-semibold text-black shadow-lg shadow-accent/20 transition-transform hover:scale-[1.02]"
          >
            View Inventory
          </Link>
          <a
            href="#contact"
            className="inline-flex h-14 items-center justify-center text-white rounded-md border border-white bg-transparent px-8 text-base font-semibold transition-colors hover:bg-white hover:text-black"
          >
            Contact Us
          </a>
        </div>
  </MotionDiv>

      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
        <div className="flex h-12 w-8 items-start justify-center rounded-full border-2 border-accent/40 p-2">
          <div className="h-2 w-1 animate-pulse rounded-full bg-accent" />
        </div>
      </div>
    </header>
  )
}

export default Hero
