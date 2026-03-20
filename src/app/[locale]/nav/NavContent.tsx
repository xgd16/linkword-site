"use client"

import { useLocale, useTranslations } from "next-intl"
import { Link, useRouter } from "@/i18n/navigation"
import { useCallback, useEffect, useRef, useState, useTransition } from "react"
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
  const t = useTranslations("NavContent")
  const locale = useLocale()
  const [links, setLinks] = useState(initialLinks)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialLinks.length < total)
  const [showBackTop, setShowBackTop] = useState(false)
  const [activeCategoryId, setActiveCategoryId] = useState(categoryId)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    setActiveCategoryId(categoryId)
  }, [categoryId])

  useEffect(() => {
    const onScroll = () => setShowBackTop(window.scrollY > 300)
    window.addEventListener("scroll", onScroll)
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleCategoryClick = useCallback(
    (href: string, targetCat?: string) => (e: React.MouseEvent) => {
      if (targetCat !== undefined && targetCat === categoryId) return
      e.preventDefault()
      setActiveCategoryId(targetCat ?? "")
      startTransition(() => router.push(href))
    },
    [router, categoryId]
  )

  useEffect(() => {
    setLinks(initialLinks)
    setPage(1)
    setHasMore(initialLinks.length < total)
  }, [keyword, categoryId, initialLinks, total])

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return
    setLoading(true)
    try {
      const res = await getNavLinksPaginated({
        pageNum: page + 1,
        pageSize,
        categoryId: categoryId && categoryId !== "all" ? parseInt(categoryId, 10) : undefined,
        keyword: keyword || undefined,
        locale,
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
  }, [loading, hasMore, page, pageSize, categoryId, keyword, links.length, total, locale])

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
        {t("noMatch")}
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
      <div className="pointer-events-none fixed bottom-6 right-6 z-20 hidden flex-col items-end gap-2 sm:flex">
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-app-border/80 bg-app-card/80 px-3 py-2.5 shadow-[0_12px_30px_rgba(0,0,0,0.18)] backdrop-blur-xl"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-app-card-hover text-app-accent">
            <i className={`${loading || isPending ? "ri-loader-4-line animate-spin" : "ri-stack-line"} text-base`} />
          </div>
          <div className="leading-tight">
            <div className="text-[10px] uppercase tracking-[0.18em] text-app-text-muted">
              {t("progress")}
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
            aria-label={t("backToTopAria")}
            className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-app-border/80 bg-app-card/80 text-app-text-muted shadow-[0_10px_24px_rgba(0,0,0,0.16)] backdrop-blur-xl transition hover:bg-app-card-hover hover:text-app-text"
          >
            <i className="ri-arrow-up-line text-lg" />
          </motion.button>
        )}
      </div>
      {categories.length > 0 && (
        <motion.div variants={staggerItem} className="flex flex-wrap gap-2">
          <Link
            href={buildNavHref({ cat: "", keyword }, { categoryId, keyword })}
            prefetch={false}
            onClick={handleCategoryClick(buildNavHref({ cat: "", keyword }, { categoryId, keyword }), "")}
            className={`rounded-lg border px-3 py-2 text-sm transition ${
              !activeCategoryId || activeCategoryId === "all"
                ? "border-app-accent bg-app-accent/10 text-app-accent"
                : "border-app-border text-app-text-muted hover:border-app-border hover:bg-app-card-hover hover:text-app-text"
            }`}
          >
            {t("allCategories")}
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={buildNavHref({ cat: String(cat.id), keyword }, { categoryId, keyword })}
              prefetch={false}
              onClick={handleCategoryClick(
                buildNavHref({ cat: String(cat.id), keyword }, { categoryId, keyword }),
                String(cat.id)
              )}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                activeCategoryId === String(cat.id)
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

      {isPending ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: pageSize }).map((_, i) => (
            <NavLinkCardSkeleton key={`transition-skeleton-${i}`} />
          ))}
        </div>
      ) : (
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
      )}

      <motion.div variants={staggerItem} className="flex flex-col items-center gap-4 py-6">
        {(loading || isPending) && (
          <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: Math.min(4, pageSize) }).map((_, i) => (
              <NavLinkCardSkeleton key={`skeleton-${i}`} />
            ))}
          </div>
        )}

        {hasMore && !loading && !isPending && <div ref={sentinelRef} className="h-1 w-full" />}
      </motion.div>
    </motion.div>
  )
}
