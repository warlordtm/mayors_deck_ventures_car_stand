"use client"

import { motion, useInView } from "framer-motion"
import React, { useRef } from "react"

// A practical motion props type that accepts common HTML attributes plus
// basic motion props (initial/animate/transition). This keeps typing useful
// while avoiding deep framer-motion generics mismatches across versions.
type SimpleMotionProps = React.HTMLAttributes<HTMLElement> & {
	initial?: any
	animate?: any
	transition?: any
	whileHover?: any
	whileTap?: any
	whileInView?: any
	viewport?: any
	variants?: any
	ref?: React.Ref<HTMLElement>
}

export const MotionArticle = motion.article as unknown as React.ComponentType<SimpleMotionProps>
export const MotionDiv = motion.div as unknown as React.ComponentType<SimpleMotionProps>
export const MotionSection = motion.section as unknown as React.ComponentType<SimpleMotionProps>
export const MotionH1 = motion.h1 as unknown as React.ComponentType<SimpleMotionProps>
export const MotionH2 = motion.h2 as unknown as React.ComponentType<SimpleMotionProps>
export const MotionP = motion.p as unknown as React.ComponentType<SimpleMotionProps>

// Premium animation variants with spring physics
export const fadeInUp = {
	initial: { opacity: 0, y: 30 },
	animate: { opacity: 1, y: 0 },
	transition: {
		duration: 0.8,
		ease: [0.25, 0.46, 0.45, 0.94], // Custom cubic-bezier for premium feel
		type: "spring",
		damping: 25,
		stiffness: 120
	}
}

export const fadeInLeft = {
	initial: { opacity: 0, x: -40 },
	animate: { opacity: 1, x: 0 },
	transition: {
		duration: 0.8,
		ease: [0.25, 0.46, 0.45, 0.94],
		type: "spring",
		damping: 25,
		stiffness: 120
	}
}

export const fadeInRight = {
	initial: { opacity: 0, x: 40 },
	animate: { opacity: 1, x: 0 },
	transition: {
		duration: 0.8,
		ease: [0.25, 0.46, 0.45, 0.94],
		type: "spring",
		damping: 25,
		stiffness: 120
	}
}

export const scaleIn = {
	initial: { opacity: 0, scale: 0.8, y: 20 },
	animate: { opacity: 1, scale: 1, y: 0 },
	transition: {
		duration: 0.6,
		ease: [0.34, 1.56, 0.64, 1], // Bounce-like easing
		type: "spring",
		damping: 20,
		stiffness: 200
	}
}

export const slideInFromBottom = {
	initial: { opacity: 0, y: 60 },
	animate: { opacity: 1, y: 0 },
	transition: {
		duration: 0.7,
		ease: [0.25, 0.46, 0.45, 0.94],
		type: "spring",
		damping: 30,
		stiffness: 100
	}
}

export const rotateIn = {
	initial: { opacity: 0, rotate: -10, scale: 0.9 },
	animate: { opacity: 1, rotate: 0, scale: 1 },
	transition: {
		duration: 0.8,
		ease: [0.25, 0.46, 0.45, 0.94],
		type: "spring",
		damping: 20,
		stiffness: 150
	}
}

export const staggerContainer = {
	animate: {
		transition: {
			staggerChildren: 0.08,
			delayChildren: 0.1
		}
	}
}

export const staggerItem = {
	initial: { opacity: 0, y: 30, scale: 0.95 },
	animate: { opacity: 1, y: 0, scale: 1 },
	transition: {
		duration: 0.6,
		ease: [0.25, 0.46, 0.45, 0.94],
		type: "spring",
		damping: 25,
		stiffness: 150
	}
}

export const fastStaggerContainer = {
	animate: {
		transition: {
			staggerChildren: 0.05,
			delayChildren: 0.05
		}
	}
}

export const bounceStaggerItem = {
	initial: { opacity: 0, y: 40, scale: 0.8 },
	animate: { opacity: 1, y: 0, scale: 1 },
	transition: {
		duration: 0.7,
		ease: [0.68, -0.55, 0.265, 1.55], // Bounce easing
		type: "spring",
		damping: 15,
		stiffness: 200
	}
}

// Page transition variants
export const pageVariants = {
	initial: { opacity: 0, y: 20 },
	in: { opacity: 1, y: 0 },
	out: { opacity: 0, y: -20 }
}

export const pageTransition = {
	type: "tween",
	ease: "anticipate",
	duration: 0.4
}

// Hook for scroll-triggered animations
export function useScrollAnimation(threshold = 0.1) {
	const ref = useRef(null)
	const isInView = useInView(ref, { once: true, amount: threshold })
	return { ref, isInView }
}

// Scroll-triggered animation component
export function ScrollReveal({
	children,
	className = "",
	delay = 0,
	direction = "up",
	duration = 0.6
}: {
	children: React.ReactNode
	className?: string
	delay?: number
	direction?: "up" | "down" | "left" | "right"
	duration?: number
}) {
	const { ref, isInView } = useScrollAnimation()

	const directionVariants = {
		up: { y: 30 },
		down: { y: -30 },
		left: { x: 30 },
		right: { x: -30 }
	}

	return (
		<MotionDiv
			ref={ref}
			initial={{ opacity: 0, ...directionVariants[direction] }}
			animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
			transition={{ duration, delay, ease: "easeOut" }}
			className={className}
		>
			{children}
		</MotionDiv>
	)
}

export default MotionArticle
