"use client"

import Link from "next/link"
import { motion } from "motion/react"
import type { ArticleItem } from "@/lib/api"
import { spring } from "@/lib/motion"

interface TodayNewsProps {
  article: ArticleItem
}

export default function TodayNews({ article }: TodayNewsProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring}
      className="mb-6 rounded-xl border border-app-border bg-gradient-to-r from-app-card-hover to-app-card px-4 py-3"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-app-text-muted">今日要闻</h3>
        <div className="flex items-center gap-4">
          <p className="max-w-md truncate text-sm text-app-text-muted">
            {article.title} ...
          </p>
          <motion.div whileHover={{ x: 2 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/articles"
              className="text-sm text-app-accent transition opacity-90 hover:opacity-100"
            >
              查看更多 &gt;
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}
