"use client"

import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { ReactNode } from "react"

interface PageTransitionProps {
	children: ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
	const pathname = usePathname()

	return (
		<AnimatePresence mode="wait" initial={false}>
			<motion.div
				key={pathname}
				initial={{
					opacity: 0,
					y: 30,
					scale: 0.98,
					filter: "blur(4px)"
				}}
				animate={{
					opacity: 1,
					y: 0,
					scale: 1,
					filter: "blur(0px)"
				}}
				exit={{
					opacity: 0,
					y: -30,
					scale: 1.02,
					filter: "blur(2px)"
				}}
				transition={{
					duration: 0.6,
					ease: [0.25, 0.46, 0.45, 0.94],
					type: "spring",
					damping: 25,
					stiffness: 120
				}}
			>
				{children}
			</motion.div>
		</AnimatePresence>
	)
}