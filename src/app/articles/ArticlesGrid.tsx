"use client"

import { motion } from "motion/react"
import ArticleCard from "./ArticleCard"
import type { ArticleItem } from "@/lib/api"
import { staggerContainer, staggerItem } from "@/lib/motion"

interface ArticlesGridProps {
  list: ArticleItem[]
}

export default function ArticlesGrid({ list }: ArticlesGridProps) {
  return (
    <motion.div
      variants={staggerContainer(0.02, 0.04)}
      initial="hidden"
      animate="show"
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {list.map((item, i) => (
        <motion.div key={item.id} variants={staggerItem}>
          <ArticleCard item={item} />
        </motion.div>
      ))}
    </motion.div>
  )
}
