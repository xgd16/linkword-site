"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { motion } from "motion/react"
import type { ArticleItem } from "@/lib/api"
import { staggerContainer, staggerItem } from "@/lib/motion"
import BannerCarousel from "./BannerCarousel"
import ClickRanking from "./ClickRanking"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:9901"

function resolveCover(cover: string | undefined): string | null {
  if (!cover?.trim()) return null
  if (cover.startsWith("http")) return cover
  return `${API_BASE.replace(/\/$/, "")}${cover.startsWith("/") ? "" : "/"}${cover}`
}

interface FeaturedBannerProps {
  articles: ArticleItem[]
}

export default function FeaturedBanner({ articles }: FeaturedBannerProps) {
  const t = useTranslations("LatestReleases")
  const secondary = articles.slice(0, 3)

  return (
    <motion.div
      variants={staggerContainer(0, 0.08)}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <motion.div variants={staggerItem} className="h-[260px] lg:col-span-2 lg:h-[300px]">
          <BannerCarousel />
        </motion.div>
        <motion.div variants={staggerItem} className="h-[260px] lg:col-span-1 lg:h-[300px]">
          <ClickRanking />
        </motion.div>
      </div>

      {secondary.length > 0 && (
        <motion.div
          variants={staggerItem}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {secondary.map((article) => (
            <Link
              key={article.id}
              href={`/articles/${article.id}`}
              prefetch={false}
              className="group flex gap-4 overflow-hidden rounded-xl border border-app-border bg-app-card p-4 transition-all duration-200 hover:border-app-border hover:bg-app-card-hover"
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-app-gradient-from">
                {article.cover && resolveCover(article.cover) ? (
                  <Image
                    src={resolveCover(article.cover)!}
                    alt=""
                    fill
                    unoptimized
                    sizes="64px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <i className="ri-file-text-line text-2xl text-app-accent/50" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-medium text-app-text group-hover:text-app-accent">
                  {article.title}
                </h3>
                <p className="mt-0.5 line-clamp-2 text-xs text-app-text-muted">
                  {article.summary || t("noSummary")}
                </p>
              </div>
            </Link>
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}
