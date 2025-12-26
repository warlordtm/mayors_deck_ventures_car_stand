"use client"

import React from "react"
import { motion } from "framer-motion"
import { ShieldCheck, Users, Eye, Smile, LucideIcon } from "lucide-react"
import { MotionDiv } from "@/components/motion-wrappers"

interface FeatureCardProps {
  title: string
  content: string
  icon: LucideIcon
  index?: number
}

export function FeatureCard({ title, content, icon: Icon, index = 0 }: FeatureCardProps) {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: index * 0.12,
        duration: 0.7,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        damping: 20,
        stiffness: 150
      }}
      whileHover={{
        y: -8,
        scale: 1.03,
        rotateY: 2,
        transition: { type: "spring", damping: 15, stiffness: 300 }
      }}
      className="group rounded-2xl border border-border bg-card p-8 text-center transition-all duration-500 hover:border-accent/50 hover:shadow-2xl hover:shadow-accent/20 cursor-pointer"
    >
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          delay: index * 0.12 + 0.3,
          duration: 0.6,
          type: "spring",
          damping: 15,
          stiffness: 200
        }}
        className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-accent/10 transition-all duration-300 group-hover:scale-115 group-hover:bg-accent/20"
      >
        <Icon className="h-8 w-8 text-accent transition-all duration-300 group-hover:text-accent group-hover:scale-110" />
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.12 + 0.4, duration: 0.6 }}
        className="mb-2 text-xl font-semibold text-foreground"
      >
        {title}
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.12 + 0.5, duration: 0.6 }}
        className="text-sm text-muted-foreground"
      >
        {content}
      </motion.p>
    </MotionDiv>
  )
}

export default FeatureCard