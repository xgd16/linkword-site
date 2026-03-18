"use client"

import { motion } from "motion/react"
import { spring } from "@/lib/motion"

export default function PageMotion({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring}
      className={className}
    >
      {children}
    </motion.div>
  )
}
