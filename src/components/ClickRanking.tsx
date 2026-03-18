"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { motion } from "motion/react"
import Link from "next/link"
import type { NavLinkClickRankItem } from "@/lib/api"
import { getNavLinkClickRank, reportNavLinkClick } from "@/lib/api"
import { spring, staggerContainer, staggerItem } from "@/lib/motion"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:9901"

function getIconSrc(icon: string, url: string): string {
  if (icon?.startsWith("/upload/"))
    return `${API_BASE.replace(/\/$/, "")}${icon}`
  if (icon?.startsWith("http")) return icon
  try {
    const host = new URL(url).hostname.replace(/^www\./, "")
    return `https://www.google.com/s2/favicons?domain=${host}&sz=32`
  } catch {
    return ""
  }
}

const RANK_COLORS = [
  "bg-amber-500/90 text-white",
  "bg-slate-400/90 text-white",
  "bg-amber-700/90 text-white",
  "bg-app-card-hover text-app-text-muted",
  "bg-app-card-hover text-app-text-muted",
]

export default function ClickRanking() {
  const [list, setList] = useState<NavLinkClickRankItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getNavLinkClickRank(10)
      .then(setList)
      .catch(() => setList([]))
      .finally(() => setLoading(false))
  }, [])

  const handleClick = (item: NavLinkClickRankItem) => {
    reportNavLinkClick(item.id)
  }

  const cardClass =
    "flex h-full flex-col overflow-hidden rounded-2xl border border-app-border bg-app-card p-5"

  if (loading) {
    return (
      <div className={cardClass}>
        <div className="flex shrink-0 items-center gap-2">
          <div className="h-5 w-5 animate-pulse rounded bg-app-border/40" />
          <div className="h-5 w-36 animate-pulse rounded bg-app-border/40" />
        </div>
        <div className="mt-4 flex flex-1 flex-col gap-2 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-6 w-6 shrink-0 rounded bg-app-border/30" />
              <div className="h-4 flex-1 rounded bg-app-border/30" />
              <div className="h-4 w-12 shrink-0 rounded bg-app-border/30" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (list.length === 0) {
    return (
      <div className={cardClass}>
        <div className="flex shrink-0 items-center gap-2">
          <i className="ri-bar-chart-box-line text-lg text-app-accent" />
          <h3 className="font-semibold text-app-text">网站点击排行榜</h3>
        </div>
        <p className="mt-4 flex flex-1 items-center justify-center text-sm text-app-text-muted">暂无数据</p>
      </div>
    )
  }

  return (
    <motion.div
      variants={staggerContainer(0, 0.05)}
      initial="hidden"
      animate="show"
      className={cardClass}
    >
      <div className="flex shrink-0 items-center gap-2">
        <i className="ri-bar-chart-box-line text-lg text-app-accent" />
        <h3 className="font-semibold text-app-text">网站点击排行榜</h3>
      </div>
      <p className="mt-1 shrink-0 text-sm text-app-text-muted">按点击量排序</p>
      <div className="mt-3 flex flex-1 flex-col gap-1.5 overflow-y-auto">
        {list.map((item, i) => (
          <motion.a
            key={item.id}
            variants={staggerItem}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleClick(item)}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-app-text transition-colors hover:bg-app-card-hover hover:text-app-accent"
          >
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded text-xs font-semibold ${
                RANK_COLORS[Math.min(i, 4)]
              }`}
            >
              {i + 1}
            </span>
            {item.icon?.startsWith("ri-") ? (
              <i className={`${item.icon} shrink-0 text-base text-app-accent`} />
            ) : getIconSrc(item.icon, item.url) ? (
              <Image
                src={getIconSrc(item.icon, item.url)}
                alt=""
                width={20}
                height={20}
                unoptimized
                className="h-5 w-5 shrink-0 rounded object-contain"
              />
            ) : null}
            <span className="min-w-0 flex-1 truncate">{item.title}</span>
            <span className="shrink-0 text-xs text-app-text-muted">
              {item.clickCount} 次
            </span>
          </motion.a>
        ))}
      </div>
      <Link
        href="/nav"
        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-app-accent transition hover:underline"
      >
        全部导航
        <i className="ri-arrow-right-s-line" />
      </Link>
    </motion.div>
  )
}
