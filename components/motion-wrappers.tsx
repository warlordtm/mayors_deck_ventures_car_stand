"use client"

import { motion } from "framer-motion"
import React from "react"

// A practical motion props type that accepts common HTML attributes plus
// basic motion props (initial/animate/transition). This keeps typing useful
// while avoiding deep framer-motion generics mismatches across versions.
type SimpleMotionProps = React.HTMLAttributes<HTMLElement> & {
	initial?: any
	animate?: any
	transition?: any
}

export const MotionArticle = motion.article as unknown as React.ComponentType<SimpleMotionProps>
export const MotionDiv = motion.div as unknown as React.ComponentType<SimpleMotionProps>

export default MotionArticle
