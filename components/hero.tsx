"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { MotionDiv } from "@/components/motion-wrappers"
import { HeroSkeleton } from "@/components/loading-skeleton"
import Image from "next/image"
import React, { useEffect, useState } from "react"

interface ContentBlock {
  id: string
  key: string
  title: string | null
  content: string | null
  image_url: string | null
  display_order: number
  is_active: boolean
}

export function Hero() {
  const [heroContent, setHeroContent] = useState<ContentBlock | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHeroContent = async () => {
      try {
        const response = await fetch('/api/content')
        const data = await response.json()
        const hero = data.contentBlocks?.find((block: ContentBlock) => block.key === 'hero')
        setHeroContent(hero || null)
      } catch (error) {
        console.error('Error fetching hero content:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHeroContent()
  }, [])

  if (loading) {
    return <HeroSkeleton />
  }

  return (
    <header className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src={heroContent?.image_url || "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=1800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2Ftcnl8ZW58MHx8MHx8fDA%3D"}
          alt="Luxury car showroom"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-transparent to-black/60" />
      </div>

      <MotionDiv
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 1,
          ease: [0.25, 0.46, 0.45, 0.94],
          type: "spring",
          damping: 20,
          stiffness: 100
        }}
        className="relative z-10 mx-auto max-w-5xl px-4 text-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{
            delay: 0.2,
            duration: 0.8,
            ease: [0.34, 1.56, 0.64, 1],
            type: "spring",
            damping: 15,
            stiffness: 200
          }}
          className="mb-6 inline-block rounded-full border border-accent/20 bg-accent/5 px-5 py-2 backdrop-blur-sm"
        >
          <span className="text-sm font-semibold uppercase tracking-wider text-accent">{heroContent?.title || "Majestic Collection"}</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            delay: 0.4,
            duration: 0.9,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
          className="mb-6 font-display text-5xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl md:text-7xl"
        >
          {heroContent?.content || "Driving Excellence. Defining Prestige."}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.6,
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94],
            type: "spring",
            damping: 25,
            stiffness: 120
          }}
          className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            <Link
              href="/cars"
              className="inline-flex h-14 items-center justify-center rounded-md bg-accent px-8 text-base font-semibold text-black shadow-lg shadow-accent/20 transition-all duration-300 hover:shadow-xl hover:shadow-accent/30 cursor-pointer"
            >
              View Inventory
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            <Link
              href="/cars"
              className="inline-flex h-14 items-center justify-center text-white rounded-md border border-white bg-transparent px-8 text-base font-semibold transition-all duration-300 hover:bg-white hover:text-black hover:shadow-lg cursor-pointer"
            >
              🔍 Search Cars
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            <a
              href="#contact"
              className="inline-flex h-14 items-center justify-center text-white rounded-md border border-white bg-transparent px-8 text-base font-semibold transition-all duration-300 hover:bg-white hover:text-black hover:shadow-lg cursor-pointer"
            >
              Contact Us
            </a>
          </motion.div>
        </motion.div>
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
