"use client"

import Image from "next/image"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { motion, AnimatePresence } from "motion/react"
import { useCallback, useEffect, useState } from "react"
import type { ArticleDetail } from "@/lib/api"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:9901"

function getCoverUrl(cover: string): string {
  if (!cover) return ""
  if (cover.startsWith("http")) return cover
  return `${API_BASE.replace(/\/$/, "")}${cover.startsWith("/") ? "" : "/"}${cover}`
}

function resolveImageSrc(src: string | undefined): string {
  if (!src) return ""
  if (src.startsWith("http")) return src
  return `${API_BASE.replace(/\/$/, "")}${src.startsWith("/") ? "" : "/"}${src}`
}

interface ArticleDetailProps {
  article: ArticleDetail
}

export default function ArticleDetailClient({ article }: ArticleDetailProps) {
  const content = article.content || ""
  const [zoomedSrc, setZoomedSrc] = useState<string | null>(null)

  const closeZoom = useCallback(() => setZoomedSrc(null), [])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeZoom()
    }
    if (zoomedSrc) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
    }
  }, [zoomedSrc, closeZoom])

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
            className="relative mt-4 aspect-video cursor-zoom-in overflow-hidden rounded-xl"
            role="button"
            tabIndex={0}
            onClick={() => setZoomedSrc(getCoverUrl(article.cover))}
            onKeyDown={(e) => e.key === "Enter" && setZoomedSrc(getCoverUrl(article.cover))}
          >
            <Image
              src={getCoverUrl(article.cover)}
              alt={article.title}
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover transition-opacity hover:opacity-90"
            />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="article-body mt-6 prose max-w-none prose-headings:text-app-text prose-p:text-app-text-muted prose-strong:text-app-text prose-a:text-app-accent prose-a:no-underline hover:prose-a:text-app-accent-secondary prose-li:text-app-text-muted prose-code:bg-app-card-hover prose-code:text-app-text prose-pre:bg-app-card-hover prose-pre:text-app-text prose-blockquote:border-app-border prose-blockquote:text-app-text-muted prose-hr:border-app-border prose-th:text-app-text prose-td:text-app-text-muted"
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              ),
              img: ({ src, alt }) => {
                const srcStr = typeof src === "string" ? src : ""
                const fullSrc = resolveImageSrc(srcStr)
                if (!fullSrc) return null
                return (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={fullSrc}
                    alt={alt || ""}
                    className="w-full cursor-zoom-in rounded-xl border border-app-border transition-opacity hover:opacity-90"
                    role="button"
                    tabIndex={0}
                    onClick={() => setZoomedSrc(fullSrc)}
                    onKeyDown={(e) => e.key === "Enter" && setZoomedSrc(fullSrc)}
                  />
                )
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </motion.div>
      </article>

      {/* 点击放大预览 */}
      <AnimatePresence>
        {zoomedSrc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-black/90 p-4"
            onClick={closeZoom}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative max-h-[90vh] max-w-[90vw]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={zoomedSrc}
                alt="放大预览"
                className="max-h-[90vh] max-w-full rounded-lg object-contain shadow-2xl"
              />
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm text-white/70">按 ESC 或点击背景关闭</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
