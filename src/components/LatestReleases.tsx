"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "motion/react"
import type { ArticleItem } from "@/lib/api"
import { spring, staggerContainer, staggerItem } from "@/lib/motion"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:9901"

function resolveCover(cover: string | undefined): string | null {
  if (!cover?.trim()) return null
  if (cover.startsWith("http")) return cover
  return `${API_BASE.replace(/\/$/, "")}${cover.startsWith("/") ? "" : "/"}${cover}`
}

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
        <h2 className="flex items-center gap-2 text-lg font-semibold text-app-text">
          <i className="ri-article-line text-app-accent" />
          最新发布
        </h2>
        <Link
          href="/articles"
          className="text-sm text-app-text-muted transition hover:text-app-accent"
        >
          全部 →
        </Link>
      </motion.div>

      <motion.div
        variants={staggerContainer(0.03, 0.05)}
        initial="hidden"
        animate="show"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {articles.map((article, i) => (
          <motion.div key={article.id} variants={staggerItem}>
            <Link
              href={`/articles/${article.id}`}
              className="group relative block overflow-hidden rounded-xl border border-app-border bg-app-card transition-all duration-300 hover:border-app-border hover:shadow-md hover:bg-app-card-hover"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-app-gradient-from to-app-gradient-to">
                {article.cover && resolveCover(article.cover) ? (
                  <Image
                    src={resolveCover(article.cover)!}
                    alt=""
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <i className="ri-file-text-line text-4xl text-app-accent/30" />
                  </div>
                )}
                {i < 3 && (
                  <span className="absolute right-3 top-3 rounded-full bg-app-accent/90 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                    New
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="line-clamp-2 font-medium text-app-text transition-colors group-hover:text-app-accent">
                  {article.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm text-app-text-muted">
                  {article.summary || "暂无摘要"}
                </p>
                {article.createTime && (
                  <p className="mt-3 text-xs text-app-text-muted">
                    {new Date(article.createTime).toLocaleDateString("zh-CN")}
                  </p>
                )}
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {articles.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-dashed border-app-border py-16 text-center"
        >
          <i className="ri-article-line mx-auto mb-3 block text-4xl text-app-text-muted/50" />
          <p className="text-app-text-muted">暂无内容，敬请期待</p>
        </motion.div>
      )}

      {total > articles.length && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 rounded-xl border border-app-border bg-app-card px-5 py-2.5 text-sm font-medium text-app-text transition-all hover:border-app-accent/50 hover:bg-app-card-hover"
          >
            加载更多
            <i className="ri-arrow-right-s-line text-base" />
          </Link>
        </motion.div>
      )}
    </div>
  )
}
