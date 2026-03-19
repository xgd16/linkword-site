"use client"

import Image from "next/image"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { motion, AnimatePresence } from "motion/react"
import { createElement, isValidElement, useCallback, useEffect, useMemo, useState } from "react"
import type { HTMLAttributes, ReactNode } from "react"
import { reportArticleView, type ArticleDetail } from "@/lib/api"

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

interface TocHeading {
  id: string
  text: string
  level: number
  line: number
}

function createHeadingId(text: string, counts: Map<string, number>): string {
  const base =
    text
      .toLowerCase()
      .trim()
      .replace(/<[^>]+>/g, "")
      .replace(/[`*_~[\]()]/g, "")
      .replace(/[^\p{L}\p{N}\s-]/gu, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "section"

  const count = counts.get(base) ?? 0
  counts.set(base, count + 1)
  return count === 0 ? base : `${base}-${count + 1}`
}

function extractMarkdownHeadings(markdown: string): TocHeading[] {
  const headings: TocHeading[] = []
  const counts = new Map<string, number>()
  const lines = markdown.split(/\r?\n/)
  let inCodeBlock = false

  for (const [index, line] of lines.entries()) {
    const trimmed = line.trim()

    if (trimmed.startsWith("```")) {
      inCodeBlock = !inCodeBlock
      continue
    }
    if (inCodeBlock) continue

    const match = trimmed.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/)
    if (!match) continue

    const level = match[1].length
    const text = match[2]
      .replace(/!\[(.*?)\]\(.*?\)/g, "$1")
      .replace(/\[(.*?)\]\(.*?\)/g, "$1")
      .replace(/[`*_~]/g, "")
      .replace(/<[^>]+>/g, "")
      .trim()

    if (!text) continue

    headings.push({
      id: createHeadingId(text, counts),
      text,
      level,
      line: index + 1,
    })
  }

  return headings
}

function extractTextFromNode(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node)
  }
  if (Array.isArray(node)) {
    return node.map(extractTextFromNode).join("")
  }
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return extractTextFromNode(node.props.children)
  }
  return ""
}

function TableOfContents({
  headings,
  activeHeadingId,
  className,
  scrollable,
  onItemClick,
}: {
  headings: TocHeading[]
  activeHeadingId: string | null
  className?: string
  scrollable?: boolean
  onItemClick?: () => void
}) {
  if (headings.length === 0) return null

  return (
    <nav
      className={`rounded-2xl border border-app-border bg-app-card/90 p-4 backdrop-blur-sm ${scrollable ? "overflow-y-auto" : ""} ${className || ""}`}
      aria-label="文章目录"
    >
      <p className="text-sm font-semibold text-app-text shrink-0">目录</p>
      <ol className="mt-3 space-y-1.5">
        {headings.map((heading) => {
          const isActive = activeHeadingId === heading.id
          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                onClick={onItemClick}
                className={`block rounded-lg px-3 py-2 text-sm transition ${
                  isActive
                    ? "bg-app-accent-muted text-app-accent"
                    : "text-app-text-muted hover:bg-app-card-hover hover:text-app-text"
                } ${heading.level === 3 ? "ml-3" : heading.level >= 4 ? "ml-6" : ""}`}
              >
                {heading.text}
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default function ArticleDetailClient({ article }: ArticleDetailProps) {
  const content = article.content || ""
  const [zoomedSrc, setZoomedSrc] = useState<string | null>(null)
  const [isMobileTocOpen, setIsMobileTocOpen] = useState(false)
  const markdownHeadings = useMemo(() => extractMarkdownHeadings(content), [content])
  const tocHeadings = useMemo(
    () => markdownHeadings.filter((heading) => heading.level >= 2 && heading.level <= 4),
    [markdownHeadings]
  )
  const [observedHeadingId, setObservedHeadingId] = useState<string | null>(null)
  const activeHeadingId = observedHeadingId ?? tocHeadings[0]?.id ?? null
  const activeHeadingText =
    tocHeadings.find((heading) => heading.id === activeHeadingId)?.text || tocHeadings[0]?.text || "查看目录"

  const closeZoom = useCallback(() => setZoomedSrc(null), [])

  const [displayViewCount, setDisplayViewCount] = useState<number | null>(
    typeof article.viewCount === "number" ? article.viewCount : null
  )
  useEffect(() => {
    reportArticleView(article.id).then(() => {
      setDisplayViewCount((c) => (c !== null ? c + 1 : 1))
    })
  }, [article.id])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeZoom()
        setIsMobileTocOpen(false)
      }
    }
    if (zoomedSrc || isMobileTocOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
    }
  }, [zoomedSrc, isMobileTocOpen, closeZoom])

  useEffect(() => {
    if (tocHeadings.length === 0) return

    const elements = tocHeadings
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => Boolean(element))

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visibleEntries[0]?.target.id) {
          setObservedHeadingId(visibleEntries[0].target.id)
        }
      },
      {
        rootMargin: "0px 0px -70% 0px",
        threshold: [0, 0.25, 0.5, 1],
      }
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [tocHeadings])

  const renderHeading = (tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6", className: string) => {
    return function HeadingComponent({
      children,
      className: extraClassName,
      node,
      ...props
    }: HTMLAttributes<HTMLHeadingElement> & {
      node?: {
        position?: {
          start?: {
            line?: number
          }
        }
      }
    }) {
      const text = extractTextFromNode(children).trim()
      const line = node?.position?.start?.line
      const headingId =
        markdownHeadings.find((heading) => heading.line === line)?.id ||
        createHeadingId(text || "section", new Map<string, number>())

      return createElement(
        tag,
        {
          ...props,
          id: headingId,
          className: `${className} scroll-mt-24 ${extraClassName || ""}`.trim(),
        },
        children
      )
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
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

      <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_260px]">
        <article className="min-w-0">
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
            className="mt-2 flex flex-wrap items-center gap-2 text-sm text-app-text-muted"
          >
            {article.createTime && (
              <time>{new Date(article.createTime).toLocaleString("zh-CN")}</time>
            )}
            {displayViewCount !== null && (
              <span title="阅读次数">{displayViewCount} 次阅读</span>
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

          {tocHeadings.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.18 }}
              className="mt-6 hidden sm:block xl:hidden"
            >
              <TableOfContents
                headings={tocHeadings}
                activeHeadingId={activeHeadingId}
                scrollable
                className="max-h-[min(50vh,400px)]"
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
                h1: renderHeading("h1", "text-3xl font-semibold text-app-text"),
                h2: renderHeading("h2", "text-2xl font-semibold text-app-text"),
                h3: renderHeading("h3", "text-xl font-semibold text-app-text"),
                h4: renderHeading("h4", "text-lg font-semibold text-app-text"),
                h5: renderHeading("h5", "text-base font-semibold text-app-text"),
                h6: renderHeading("h6", "text-sm font-semibold uppercase tracking-wide text-app-text"),
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

        <motion.aside
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.22 }}
          className="hidden xl:block sticky top-24 self-start max-h-[calc(100vh-6rem)] overflow-hidden"
        >
          <TableOfContents
            headings={tocHeadings}
            activeHeadingId={activeHeadingId}
            scrollable
            className="max-h-[calc(100vh-8rem)]"
          />
        </motion.aside>
      </div>

      {tocHeadings.length > 0 && (
        <div className="sm:hidden">
          <button
            type="button"
            aria-expanded={isMobileTocOpen}
            aria-controls="mobile-article-toc-drawer"
            aria-label={isMobileTocOpen ? "收起目录" : "展开目录"}
            onClick={() => setIsMobileTocOpen((open) => !open)}
            className="fixed left-0 top-1/2 z-30 flex -translate-y-1/2 items-center gap-1 rounded-r-xl border border-l-0 border-app-border bg-app-card/92 px-1.5 py-2 shadow-md backdrop-blur-sm"
          >
            <span className="writing-mode-vertical text-[11px] font-medium leading-none text-app-text-muted [writing-mode:vertical-rl]">
              目录
            </span>
            <span
              className={`text-xs text-app-text-muted transition-transform ${isMobileTocOpen ? "rotate-180" : ""}`}
              aria-hidden="true"
            >
              ›
            </span>
          </button>

          <AnimatePresence>
            {isMobileTocOpen && (
              <>
                <motion.button
                  type="button"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 z-30 bg-black/35"
                  aria-label="关闭目录"
                  onClick={() => setIsMobileTocOpen(false)}
                />
                <motion.aside
                  id="mobile-article-toc-drawer"
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ duration: 0.24, ease: "easeOut" }}
                  className="fixed left-0 top-0 z-40 flex h-dvh w-[min(78vw,18rem)] flex-col border-r border-app-border bg-app-bg/98 p-4 shadow-2xl backdrop-blur-md"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-app-text">文章目录</p>
                      <p className="mt-1 truncate text-xs text-app-text-muted">{activeHeadingText}</p>
                    </div>
                    <button
                      type="button"
                      className="rounded-xl border border-app-border px-2.5 py-1 text-sm text-app-text-muted"
                      onClick={() => setIsMobileTocOpen(false)}
                    >
                      关闭
                    </button>
                  </div>

                  <TableOfContents
                    headings={tocHeadings}
                    activeHeadingId={activeHeadingId}
                    scrollable
                    onItemClick={() => setIsMobileTocOpen(false)}
                    className="h-full max-h-none border-none bg-transparent p-0 shadow-none"
                  />
                </motion.aside>
              </>
            )}
          </AnimatePresence>
        </div>
      )}

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
