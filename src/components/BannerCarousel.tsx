"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { motion, AnimatePresence } from "motion/react"
import type { BannerItem } from "@/lib/api"
import { getBannerList } from "@/lib/api"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:9901"

function resolveImage(img: string): string {
  if (!img?.trim()) return ""
  if (img.startsWith("http")) return img
  return `${API_BASE.replace(/\/$/, "")}${img.startsWith("/") ? "" : "/"}${img}`
}

export default function BannerCarousel() {
  const t = useTranslations("Banner")
  const [items, setItems] = useState<BannerItem[]>([])
  const [index, setIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  useEffect(() => {
    getBannerList()
      .then((list) => {
        setItems(list)
        setIndex(0)
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [])

  const goTo = useCallback((i: number) => {
    setIndex(() => {
      if (i < 0) return items.length - 1
      if (i >= items.length) return 0
      return i
    })
  }, [items.length])

  useEffect(() => {
    if (items.length <= 1 || lightboxOpen) return
    const timer = setInterval(() => goTo(index + 1), 5000)
    return () => clearInterval(timer)
  }, [index, items.length, goTo, lightboxOpen])

  useEffect(() => {
    if (!lightboxOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [lightboxOpen])

  useEffect(() => {
    if (!lightboxOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [lightboxOpen])

  const placeholderOrLoading = (
    <div className="flex h-full flex-col justify-end overflow-hidden rounded-2xl border border-app-border bg-gradient-to-br from-app-gradient-from/80 to-app-gradient-to/80 animate-pulse">
      {loading ? (
        <>
          <div className="flex flex-1 items-center justify-center">
            <div className="h-24 w-40 rounded-xl bg-app-border/30" />
          </div>
          <div className="flex justify-center gap-2 pb-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-2 w-2 rounded-full bg-app-border/50" />
            ))}
          </div>
        </>
      ) : (
        <div className="flex h-full items-center justify-center">
          <span className="text-app-text-muted">{t("empty")}</span>
        </div>
      )}
    </div>
  )

  if (loading || items.length === 0) {
    return placeholderOrLoading
  }

  const current = items[index]
  const imgUrl = resolveImage(current.image)

  return (
    <div className="relative h-full overflow-hidden rounded-2xl border border-app-border bg-app-card">
      <div className="relative h-full w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-0"
          >
            <div className="relative z-0 h-full w-full">
              {imgUrl ? (
                <>
                  <div
                    className="pointer-events-none absolute inset-0 overflow-hidden"
                    aria-hidden
                  >
                    {/* 用 CSS 背景替代 img，避免模糊层被当作 LCP 且带 lazy */}
                    <div
                      className="absolute -inset-10 scale-110 bg-cover bg-center blur-2xl saturate-125"
                      style={{ backgroundImage: `url(${imgUrl})` }}
                    />
                    <div className="absolute inset-0 bg-app-card/40 backdrop-blur-xl ring-1 ring-inset ring-black/4 dark:ring-white/6" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setLightboxOpen(true)}
                    aria-label={t("enlarge")}
                    className="relative z-0 block h-full w-full cursor-zoom-in text-left outline-none focus-visible:ring-2 focus-visible:ring-app-accent focus-visible:ring-offset-2 focus-visible:ring-offset-app-card"
                  >
                    <Image
                      src={imgUrl}
                      alt={current.title || ""}
                      fill
                      priority={index === 0}
                      fetchPriority={index === 0 ? "high" : "low"}
                      unoptimized
                      sizes="(max-width:1024px) 100vw, 66vw"
                      className="object-contain object-center drop-shadow-sm"
                    />
                  </button>
                </>
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-app-gradient-from">
                  <i className="ri-image-line text-5xl text-app-accent/40" />
                </div>
              )}
              {current.url ? (
                <a
                  href={current.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-14 right-3 z-10 flex items-center gap-1 rounded-full bg-black/45 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition hover:bg-black/60"
                  onClick={(e) => e.stopPropagation()}
                >
                  <i className="ri-external-link-line text-sm" aria-hidden />
                  {t("openLink")}
                </a>
              ) : null}
            </div>
          </motion.div>
        </AnimatePresence>

        {items.length > 1 && (
          <div className="pointer-events-auto absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={t("slideN", { n: i + 1 })}
                onClick={(e) => {
                  e.stopPropagation()
                  setIndex(i)
                }}
                className="flex h-9 min-h-9 min-w-9 items-center justify-center rounded-full p-0 touch-manipulation"
              >
                <span
                  className={`block rounded-full transition-all ${
                    i === index ? "h-2 w-6 bg-app-accent" : "h-2 w-2 bg-white/50 hover:bg-white/70"
                  }`}
                />
              </button>
            ))}
          </div>
        )}

        {items.length > 1 && (
          <>
            <button
              type="button"
              aria-label={t("prev")}
              onClick={(e) => {
                e.stopPropagation()
                goTo(index - 1)
              }}
              className="pointer-events-auto absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white transition hover:bg-black/50"
            >
              <i className="ri-arrow-left-s-line text-xl" />
            </button>
            <button
              type="button"
              aria-label={t("next")}
              onClick={(e) => {
                e.stopPropagation()
                goTo(index + 1)
              }}
              className="pointer-events-auto absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white transition hover:bg-black/50"
            >
              <i className="ri-arrow-right-s-line text-xl" />
            </button>
          </>
        )}
      </div>

      {lightboxOpen && imgUrl ? (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/88 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={t("enlarge")}
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            aria-label={t("closeLightbox")}
            className="absolute right-4 top-4 z-102 rounded-full bg-white/10 p-2.5 text-white transition hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation()
              setLightboxOpen(false)
            }}
          >
            <i className="ri-close-line text-2xl" aria-hidden />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element -- 全屏预览用原生 img，避免与 fill 布局耦合 */}
          <img
            src={imgUrl}
            alt={current.title || ""}
            className="max-h-[min(90vh,100%)] max-w-full object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          {current.url ? (
            <a
              href={current.url}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-6 left-1/2 z-102 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/15 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/25"
              onClick={(e) => e.stopPropagation()}
            >
              <i className="ri-external-link-line" aria-hidden />
              {t("openLink")}
            </a>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
