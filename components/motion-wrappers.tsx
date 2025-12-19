"use client"

import { motion } from "framer-motion"
import React from "react"

// Lightweight wrapper to avoid strict HTMLMotionProps typing conflicts in some setups.
// Using `any` here keeps the runtime animation behaviour while avoiding TS errors.
export const MotionArticle: any = motion.article as any

export default MotionArticle
