"use client"

import Link from "next/link"
import { motion } from "motion/react"
import type { ArticleItem } from "@/lib/api"
import { spring, staggerContainer, staggerItem } from "@/lib/motion"

interface LatestReleasesProps {
  articles: ArticleItem[]
  total: number
}

export default function LatestReleases({
  articles,
  total,
}: LatestReleasesProps) {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring}
        className="mb-6 flex items-center justify-between"
      >
        <h2 className="text-lg font-semibold text-app-text">最新发布</h2>
      </motion.div>

      <motion.div
        variants={staggerContainer(0.05, 0.05)}
        initial="hidden"
        animate="show"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {articles.map((article, i) => (
          <motion.div key={article.id} variants={staggerItem}>
            <motion.div
              whileHover={{ y: -4, transition: spring }}
              className="h-full"
            >
              <Link
                href={`/articles/${article.id}`}
                className="group relative block overflow-hidden rounded-xl border border-app-border bg-app-card p-4 transition-all duration-300 hover:border-app-border hover:shadow-md hover:bg-app-card-hover"
              >
                {i < 3 && (
                  <span className="absolute right-3 top-3 rounded-full bg-app-tag px-2.5 py-0.5 text-xs font-medium text-app-tag-text">
                    最新
                  </span>
                )}
                <h3 className="pr-12 font-medium text-app-text line-clamp-1 transition-opacity group-hover:opacity-90">
                  {article.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm text-app-text-muted">
                  {article.summary || "暂无摘要"}
                </p>
                <div className="mt-3 text-xs text-app-text-muted">
                  {article.createTime && (
                    <span>
                      {new Date(article.createTime).toLocaleDateString("zh-CN")}
                    </span>
                  )}
                </div>
              </Link>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      {articles.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-dashed border-app-border py-16 text-center text-app-text-muted"
        >
          暂无内容，敬请期待
        </motion.div>
      )}

      {total > articles.length && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-center"
        >
          <motion.span whileHover={{ x: 2 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/articles"
              className="inline-flex items-center gap-1 text-sm text-app-accent transition opacity-90 hover:opacity-100"
            >
              加载更多 →
            </Link>
          </motion.span>
        </motion.div>
      )}
    </div>
  )
}
