"use client"

import Link from "next/link"
import { motion } from "motion/react"
import type { ArticleItem } from "@/lib/api"
import { spring } from "@/lib/motion"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:9901"

function getCoverUrl(cover: string): string {
  if (!cover) return ""
  if (cover.startsWith("http")) return cover
  return `${API_BASE.replace(/\/$/, "")}${cover.startsWith("/") ? "" : "/"}${cover}`
}

interface ArticleCardProps {
  item: ArticleItem
  index?: number
}

export default function ArticleCard({ item }: ArticleCardProps) {
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
              {item.summary || "暂无摘要"}
            </p>
            {item.createTime && (
              <p className="mt-2 text-xs text-app-text-muted">
                {new Date(item.createTime).toLocaleDateString("zh-CN")}
              </p>
            )}
          </div>
        </Link>
    </motion.div>
  )
}
