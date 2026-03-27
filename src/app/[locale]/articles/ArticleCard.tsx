"use client"

import { useLocale, useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { motion } from "motion/react"
import type { ArticleItem } from "@/lib/api"
import { resolveUploadAssetUrl } from "@/lib/api"
import { spring } from "@/lib/motion"

function getCoverUrl(cover: string): string {
  if (!cover) return ""
  if (cover.startsWith("http")) return cover
  return resolveUploadAssetUrl(cover)
}

interface ArticleCardProps {
  item: ArticleItem
  index?: number
}

export default function ArticleCard({ item }: ArticleCardProps) {
  const t = useTranslations("ArticleCard")
  const locale = useLocale()
  const dateLocale = locale === "zh" ? "zh-CN" : "en-US"

  return (
    <motion.div
      whileHover={{ y: -4, transition: spring }}
      className="h-full"
    >
      <Link
        href={`/articles/${item.id}`}
        prefetch={false}
        className="group block overflow-hidden rounded-xl border border-app-border bg-app-card transition-all duration-300 hover:border-app-border hover:shadow-md hover:bg-app-card-hover"
      >
        {item.cover && (
          <div className="aspect-video w-full overflow-hidden bg-app-card-hover">
            <motion.img
              src={getCoverUrl(item.cover)}
              alt=""
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}
        <div className="p-4">
          <h3 className="font-medium text-app-text line-clamp-2 transition-opacity group-hover:opacity-90">
            {item.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-app-text-muted">
            {item.summary || t("noSummary")}
          </p>
          <div className="mt-2 flex items-center gap-3 text-xs text-app-text-muted">
            {item.createTime && (
              <p>{new Date(item.createTime).toLocaleDateString(dateLocale)}</p>
            )}
            {typeof item.viewCount === "number" && (
              <p>{t("views", { count: item.viewCount })}</p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
