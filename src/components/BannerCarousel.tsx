"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
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
  const [items, setItems] = useState<BannerItem[]>([])
  const [index, setIndex] = useState(0)
  const [loading, setLoading] = useState(true)

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
    setIndex((prev) => {
      if (i < 0) return items.length - 1
      if (i >= items.length) return 0
      return i
    })
  }, [items.length])

  useEffect(() => {
    if (items.length <= 1) return
    const t = setInterval(() => goTo(index + 1), 5000)
    return () => clearInterval(t)
  }, [index, items.length, goTo])

  const placeholderOrLoading = (
    <div className="flex h-full items-center justify-center overflow-hidden rounded-2xl border border-app-border bg-gradient-to-br from-app-gradient-from to-app-gradient-to">
      {loading ? (
        <i className="ri-loader-4-line animate-spin text-3xl text-app-accent" />
      ) : (
        <span className="text-app-text-muted">暂无轮播图</span>
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
            className="absolute inset-0"
          >
            {current.url ? (
              <a
                href={current.url}
                target="_blank"
                rel="noopener noreferrer"
                className="relative block h-full w-full"
              >
                {imgUrl ? (
                  <Image
                    src={imgUrl}
                    alt={current.title || ""}
                    fill
                    unoptimized
                    sizes="100vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-app-gradient-from">
                    <i className="ri-image-line text-5xl text-app-accent/40" />
                  </div>
                )}
              </a>
            ) : (
              <>
                {imgUrl ? (
                  <Image
                    src={imgUrl}
                    alt={current.title || ""}
                    fill
                    unoptimized
                    sizes="100vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-app-gradient-from">
                    <i className="ri-image-line text-5xl text-app-accent/40" />
                  </div>
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* 指示器 */}
        {items.length > 1 && (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`第 ${i + 1} 张`}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "w-6 bg-app-accent" : "w-2 bg-white/50 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        )}

        {/* 左右箭头 */}
        {items.length > 1 && (
          <>
            <button
              type="button"
              aria-label="上一张"
              onClick={() => goTo(index - 1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white transition hover:bg-black/50"
            >
              <i className="ri-arrow-left-s-line text-xl" />
            </button>
            <button
              type="button"
              aria-label="下一张"
              onClick={() => goTo(index + 1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white transition hover:bg-black/50"
            >
              <i className="ri-arrow-right-s-line text-xl" />
            </button>
          </>
        )}
      </div>
    </div>
  )
}
