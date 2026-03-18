"use client"

import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"
import { motion } from "motion/react"
import type { NavCategoryBrief, NavLinkWithCategory } from "@/lib/api"
import { getNavLinksPaginated } from "@/lib/api"
import NavLinkCard from "@/components/NavLinkCard"
import NavLinkCardSkeleton from "@/components/NavLinkCardSkeleton"
import { spring, staggerContainer, staggerItem } from "@/lib/motion"

interface NavContentProps {
  initialLinks: NavLinkWithCategory[]
  categories: NavCategoryBrief[]
  total: number
  pageSize: number
  keyword: string
  categoryId: string
}

function buildNavHref(opts: { cat?: string; keyword?: string }, current: { categoryId: string; keyword: string }) {
  const p = new URLSearchParams()
  const cat = opts.cat !== undefined ? opts.cat : current.categoryId
  const kw = opts.keyword !== undefined ? opts.keyword : current.keyword
  if (cat) p.set("cat", cat)
  if (kw) p.set("keyword", kw)
  const q = p.toString()
  return q ? `/nav?${q}` : "/nav"
}

export default function NavContent({
  initialLinks,
  categories,
  total,
  pageSize,
  keyword,
  categoryId,
}: NavContentProps) {
  const [links, setLinks] = useState<NavLinkWithCategory[]>(initialLinks)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialLinks.length < total)
  const [showBackTop, setShowBackTop] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setShowBackTop(window.scrollY > 300)
    window.addEventListener("scroll", onScroll)
    onScroll() // 初始化
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // 当筛选条件变化时，服务端会传入新的 initialLinks，需要重置
  useEffect(() => {
    setLinks(initialLinks)
    setPage(1)
    setHasMore(initialLinks.length < total)
  }, [keyword, categoryId])

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return
    setLoading(true)
    try {
      const res = await getNavLinksPaginated({
        pageNum: page + 1,
        pageSize,
        categoryId: categoryId && categoryId !== "all" ? parseInt(categoryId, 10) : undefined,
        keyword: keyword || undefined,
      })
      if (res.list.length > 0) {
        setLinks((prev) => [...prev, ...res.list])
        setPage((p) => p + 1)
      }
      setHasMore(links.length + res.list.length < total)
    } catch {
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }, [loading, hasMore, page, pageSize, categoryId, keyword, links.length])

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore()
      },
      { rootMargin: "200px", threshold: 0 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [loadMore])

  if (links.length === 0 && !loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring}
        className="rounded-xl border border-dashed border-app-border py-16 text-center text-app-text-muted"
      >
        暂无匹配的导航
      </motion.div>
    )
  }

  return (
    <motion.div
      variants={staggerContainer(0, 0.06)}
      initial="hidden"
      animate="show"
      className="relative space-y-8"
    >
      {/* 右侧固定：轻量进度条 + 返回顶部 */}
      <div className="pointer-events-none fixed bottom-6 right-6 z-20 hidden flex-col items-end gap-2 sm:flex">
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-app-border/80 bg-app-card/80 px-3 py-2.5 shadow-[0_12px_30px_rgba(0,0,0,0.18)] backdrop-blur-xl"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-app-card-hover text-app-accent">
            <i className={`${loading ? "ri-loader-4-line animate-spin" : "ri-stack-line"} text-base`} />
          </div>
          <div className="leading-tight">
            <div className="text-[10px] uppercase tracking-[0.18em] text-app-text-muted">
              进度
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-base font-semibold text-app-text">{links.length}</span>
              <span className="text-xs text-app-text-muted">/ {total}</span>
            </div>
          </div>
        </motion.div>
        {showBackTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={scrollToTop}
            aria-label="返回顶部"
            className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-app-border/80 bg-app-card/80 text-app-text-muted shadow-[0_10px_24px_rgba(0,0,0,0.16)] backdrop-blur-xl transition hover:bg-app-card-hover hover:text-app-text"
          >
            <i className="ri-arrow-up-line text-lg" />
          </motion.button>
        )}
      </div>
      {/* 分类筛选 */}
      {categories.length > 0 && (
        <motion.div variants={staggerItem} className="flex flex-wrap gap-2">
          <Link
            href={buildNavHref({ cat: "", keyword }, { categoryId, keyword })}
            className={`rounded-lg border px-3 py-2 text-sm transition ${
              !categoryId || categoryId === "all"
                ? "border-app-accent bg-app-accent/10 text-app-accent"
                : "border-app-border text-app-text-muted hover:border-app-border hover:bg-app-card-hover hover:text-app-text"
            }`}
          >
            全部
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={buildNavHref({ cat: String(cat.id), keyword }, { categoryId, keyword })}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                categoryId === String(cat.id)
                  ? "border-app-accent bg-app-accent/10 text-app-accent"
                  : "border-app-border text-app-text-muted hover:border-app-border hover:bg-app-card-hover hover:text-app-text"
              }`}
            >
              {cat.icon?.startsWith("ri-") ? (
                <i className={`${cat.icon} text-base`} />
              ) : (
                cat.icon && <span>{cat.icon}</span>
              )}
              {cat.name}
            </Link>
          ))}
        </motion.div>
      )}

      {/* 链接网格 */}
      <motion.div
        variants={staggerContainer(0.03, 0.03)}
        initial="hidden"
        animate="show"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {links.map((link) => (
          <NavLinkCard
            key={link.id}
            link={{
              id: link.id,
              title: link.title,
              url: link.url,
              icon: link.icon,
              cover: link.cover,
              slogan: link.slogan ?? "",
              description: link.description ?? "",
            }}
            categoryName={link.categoryName}
          />
        ))}
      </motion.div>

      {/* 底部：加载骨架 + 触发点 */}
      <motion.div variants={staggerItem} className="flex flex-col items-center gap-4 py-6">
        {/* 加载骨架 */}
        {loading && (
          <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: Math.min(4, pageSize) }).map((_, i) => (
              <NavLinkCardSkeleton key={`skeleton-${i}`} />
            ))}
          </div>
        )}

        {/* 滚动触发点 */}
        {hasMore && !loading && <div ref={sentinelRef} className="h-1 w-full" />}
      </motion.div>
    </motion.div>
  )
}
