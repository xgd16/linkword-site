"use client"

import Link from "next/link"
import { motion } from "motion/react"
import type { ArticleDetail } from "@/lib/api"

interface ArticleDetailProps {
  article: ArticleDetail
}

export default function ArticleDetailClient({ article }: ArticleDetailProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Link
          href="/articles"
          className="mb-6 inline-block text-sm text-app-text-muted transition hover:text-app-text"
        >
          ← 返回文章列表
        </Link>
      </motion.div>

      <article>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="text-2xl font-semibold text-app-text md:text-3xl"
        >
          {article.title}
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mt-2 flex flex-wrap gap-2 text-sm text-app-text-muted"
        >
          {article.createTime && (
            <time>{new Date(article.createTime).toLocaleString("zh-CN")}</time>
          )}
          {article.tagNames?.length > 0 && (
            <span className="flex gap-1">
              {article.tagNames.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-app-tag px-2.5 py-0.5 text-xs font-medium text-app-tag-text"
                >
                  {t}
                </span>
              ))}
            </span>
          )}
        </motion.div>

        {article.cover && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mt-4 overflow-hidden rounded-xl"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={article.cover} alt="" className="w-full object-cover" />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="article-body mt-6 prose max-w-none prose-headings:text-app-text prose-p:text-app-text-muted prose-a:text-app-accent prose-li:text-app-text-muted prose-code:bg-app-card-hover prose-pre:bg-app-card-hover"
          dangerouslySetInnerHTML={{ __html: article.content || "" }}
        />
      </article>
    </div>
  )
}
