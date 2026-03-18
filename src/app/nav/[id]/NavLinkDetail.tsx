"use client"

import Link from "next/link"
import ReactMarkdown from "react-markdown"
import { motion } from "motion/react"
import PageMotion from "@/components/PageMotion"
import type { NavLinkWithCategory } from "@/lib/api"
import { reportNavLinkClick } from "@/lib/api"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:9901"

function getDomain(url: string): string {
  try {
    const u = new URL(url)
    return u.hostname.replace(/^www\./, "")
  } catch {
    return ""
  }
}

function getCoverUrl(cover: string): string {
  if (!cover) return ""
  if (cover.startsWith("http")) return cover
  return `${API_BASE.replace(/\/$/, "")}${cover.startsWith("/") ? "" : "/"}${cover}`
}

interface NavLinkDetailProps {
  item: NavLinkWithCategory
}

export default function NavLinkDetailClient({ item }: NavLinkDetailProps) {
  const domain = getDomain(item.url)
  const faviconUrl = domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=64` : ""

  const handleVisit = () => {
    reportNavLinkClick(item.id)
    window.open(item.url, "_blank", "noopener,noreferrer")
  }

  return (
    <PageMotion className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Link
          href="/nav"
          className="mb-6 inline-block text-sm text-app-text-muted transition hover:text-app-text"
        >
          ← 返回导航列表
        </Link>
      </motion.div>

      <motion.article
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="flex flex-col overflow-hidden rounded-2xl border border-app-border bg-app-card lg:flex-row"
      >
        {/* 左侧：封面 + 元信息（宽屏时固定宽度） */}
        <div className="shrink-0 lg:w-[360px] xl:w-[420px]">
          <div className="relative aspect-[2.2/1] overflow-hidden bg-gradient-to-br from-app-gradient-from to-app-gradient-to lg:aspect-square lg:rounded-l-2xl">
            {item.cover ? (
              <img
                src={getCoverUrl(item.cover)}
                alt={item.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center p-8">
                {item.icon?.startsWith("ri-") ? (
                  <i className={`${item.icon} text-6xl text-app-accent/80`} />
                ) : faviconUrl ? (
                  <img src={faviconUrl} alt="" className="h-24 w-24 object-contain" />
                ) : (
                  <span className="flex h-24 w-24 items-center justify-center rounded-2xl bg-app-accent/20 text-4xl font-bold text-app-accent">
                    {item.title.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="p-4 lg:p-6 lg:pt-4">
            {/* 标题与分类 */}
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-app-card-hover">
                {item.icon?.startsWith("ri-") ? (
                  <i className={`${item.icon} text-xl text-app-accent`} />
                ) : faviconUrl ? (
                  <img src={faviconUrl} alt="" className="h-8 w-8 object-contain" />
                ) : (
                  <span className="text-xl font-semibold text-app-accent">
                    {item.title.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl font-semibold text-app-text">{item.title}</h1>
                <p className="mt-0.5 text-sm text-app-text-muted">{item.categoryName}</p>
              </div>
            </div>

            {/* 核心标语 */}
            {item.slogan && (
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-app-card-hover px-3 py-2.5">
                <i className="ri-flashlight-fill text-base text-[#f59e0b]" />
                <span className="text-sm font-medium text-app-text">{item.slogan}</span>
              </div>
            )}

            {/* 访问按钮（移动端显示在此） */}
            <div className="mt-4 flex flex-col gap-2 lg:hidden">
              <button
                type="button"
                onClick={handleVisit}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-app-accent px-4 py-3 text-sm font-medium text-white transition hover:opacity-90"
              >
                <i className="ri-external-link-line text-lg" />
                访问网站
              </button>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate text-center text-xs text-app-text-muted transition hover:text-app-accent"
              >
                {item.url}
              </a>
            </div>
          </div>
        </div>

        {/* 右侧：详细描述（主内容区，占满剩余空间） */}
        <div className="flex flex-1 flex-col border-t border-app-border lg:border-l lg:border-t-0">
          <div className="flex flex-1 flex-col p-6 sm:p-8">
            {/* 访问按钮（宽屏时显示在顶部） */}
            <div className="mb-6 hidden flex-wrap items-center gap-3 lg:flex">
              <button
                type="button"
                onClick={handleVisit}
                className="inline-flex items-center gap-2 rounded-xl bg-app-accent px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
              >
                <i className="ri-external-link-line text-lg" />
                访问网站
              </button>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-app-text-muted transition hover:text-app-accent"
              >
                {item.url}
              </a>
            </div>

            {/* 详细描述 - Markdown */}
            {item.description ? (
              <div className="prose prose-sm max-w-none prose-headings:text-app-text prose-p:text-app-text-muted prose-a:text-app-accent prose-li:text-app-text-muted prose-code:bg-app-card-hover prose-code:rounded prose-code:px-1 prose-code:py-0.5 prose-pre:bg-app-card-hover">
                <ReactMarkdown>{item.description}</ReactMarkdown>
              </div>
            ) : (
              <p className="text-app-text-muted">暂无详细介绍</p>
            )}
          </div>
        </div>
      </motion.article>
    </PageMotion>
  )
}
