"use client"

import Link from "next/link"
import { motion } from "motion/react"
import type { NavTreeCategory, ArticleItem } from "@/lib/api"
import { spring, staggerContainer, staggerItem } from "@/lib/motion"

interface FeaturedBannerProps {
  navTree: NavTreeCategory[]
  articles: ArticleItem[]
}

export default function FeaturedBanner({
  navTree,
  articles,
}: FeaturedBannerProps) {
  const firstArticle = articles[0]
  const firstCategory = navTree[0]
  const links = firstCategory?.links?.slice(0, 4) ?? []

  return (
    <motion.div
      variants={staggerContainer(0, 0.08)}
      initial="hidden"
      animate="show"
      className="grid gap-4 md:grid-cols-3"
    >
      {/* 左侧大卡片 - 推荐文章/Banner */}
      <motion.div variants={staggerItem} className="md:col-span-2">
        <motion.div whileHover={{ y: -2 }} transition={spring}>
          <Link
            href={firstArticle ? `/articles/${firstArticle.id}` : "/articles"}
            className="group relative block overflow-hidden rounded-2xl border border-app-border bg-gradient-to-br from-app-gradient-from to-app-card p-6 transition-all duration-300 hover:border-app-border hover:shadow-md"
          >
            <div className="relative flex h-full min-h-[200px] flex-col justify-between">
              <div>
                <motion.span
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.15, ...spring }}
                  className="mb-2 inline-block rounded-full bg-app-tag px-3 py-0.5 text-xs font-medium text-app-tag-text"
                >
                  今日推荐
                </motion.span>
                <h2 className="text-xl font-semibold leading-tight text-app-text md:text-2xl">
                  {firstArticle?.title ?? "高阶出图指南"}
                </h2>
                <p className="mt-2 line-clamp-2 text-sm text-app-text-muted">
                  {firstArticle?.summary ?? "精选教程与资源，助你快速上手"}
                </p>
              </div>
              <motion.span
                className="mt-4 inline-flex items-center text-sm font-medium text-app-accent"
                whileHover={{ x: 4 }}
                transition={spring}
              >
                查看详情 →
              </motion.span>
            </div>
          </Link>
        </motion.div>
      </motion.div>

      {/* 右侧小卡片 - 推荐频道 */}
      <motion.div
        variants={staggerItem}
        className="rounded-2xl border border-app-border bg-gradient-to-br from-app-card-hover to-app-card p-4"
      >
        <h3 className="text-sm font-medium text-app-text-muted">
          LinkWord 今日推荐
        </h3>
        <p className="mt-1 text-lg font-semibold text-app-text">
          {firstCategory?.name ?? "精选导航"}
        </p>
        <p className="mt-2 text-sm text-app-text-muted">
          解锁优质网站与工具，发现更多可能
        </p>
        {links.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {links.map((l, i) => (
              <motion.a
                key={l.id}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.04, ...spring }}
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="rounded-lg bg-app-tag px-3 py-1.5 text-xs font-medium text-app-tag-text transition-all hover:bg-app-accent-muted hover:text-app-accent"
              >
                {l.title}
              </motion.a>
            ))}
          </div>
        ) : null}
        <motion.div whileHover={{ x: 2 }}>
          <Link
            href="/nav"
            className="mt-4 inline-block text-sm font-medium text-app-accent transition opacity-90 hover:opacity-100"
          >
            查看全部导航 →
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
