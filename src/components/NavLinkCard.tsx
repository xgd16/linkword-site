"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import { motion } from "motion/react"
import type { NavTreeLink } from "@/lib/api"
import { reportNavLinkClick } from "@/lib/api"
import { useNavClickMode } from "./SettingsProvider"
import { spring, staggerItem } from "@/lib/motion"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:9901"

function getDomain(url: string): string {
  try {
    const u = new URL(url)
    return u.hostname.replace(/^www\./, "")
  } catch {
    return ""
  }
}

/** 优先后端静态资源，无则用官方 favicon */
function getIconSrc(icon: string, domain: string): { primary: string; fallback: string } {
  const fallback = domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=64` : ""
  if (icon?.startsWith("/upload/")) {
    return { primary: `${API_BASE.replace(/\/$/, "")}${icon}`, fallback }
  }
  if (icon?.startsWith("http")) {
    return { primary: icon, fallback }
  }
  return { primary: fallback, fallback }
}

interface NavLinkCardProps {
  link: NavTreeLink
  categoryName: string
}

export default function NavLinkCard({ link, categoryName }: NavLinkCardProps) {
  const domain = getDomain(link.url)
  const { primary: iconSrc, fallback: faviconUrl } = getIconSrc(link.icon ?? "", domain)
  const [iconError, setIconError] = useState<Record<string, boolean>>({})
  const { navClickMode } = useNavClickMode()

  const isDirect = navClickMode === "direct"

  const handleDirectClick = () => {
    reportNavLinkClick(link.id)
  }

  const cardContent = (
    <motion.div
        variants={staggerItem}
        whileHover={{ y: -4, transition: spring }}
        className="group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border border-app-border bg-app-card transition-all duration-300 hover:border-app-border hover:shadow-md"
      >
      {/* 顶部预览区 - 网页截图或占位 */}
      <div className="relative flex aspect-[2.2/1] items-center justify-center overflow-hidden bg-gradient-to-br from-app-gradient-from to-app-gradient-to">
        <div className="absolute inset-0 bg-white/5" />
          {link.cover ? (
          <Image
            src={link.cover.startsWith("http") ? link.cover : `${API_BASE.replace(/\/$/, "")}${link.cover}`}
            alt=""
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover"
          />
        ) : (
          <div className="relative flex h-full w-full items-center justify-center p-4">
            {link.icon?.startsWith("ri-") ? (
              <i
                className={`${link.icon} text-5xl text-app-accent/90 drop-shadow-sm`}
                style={{ fontSize: "3rem" }}
              />
            ) : (iconSrc || faviconUrl) ? (
              <Image
                src={iconError[link.id] ? faviconUrl : iconSrc || faviconUrl}
                alt=""
                width={64}
                height={64}
                unoptimized
                className="h-16 w-16 rounded-xl object-contain drop-shadow-md"
                onError={() => setIconError((prev) => ({ ...prev, [link.id]: true }))}
              />
            ) : (
              <span className="flex h-16 w-16 items-center justify-center rounded-xl bg-app-accent/20 text-2xl font-bold text-app-accent">
                {link.title.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
        )}
      </div>

      {/* 品牌信息区 */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-app-card-hover">
            {link.icon?.startsWith("ri-") ? (
              <i className={`${link.icon} text-xl text-app-accent`} />
            ) : (iconSrc || faviconUrl) ? (
              <Image
                src={iconError[link.id] ? faviconUrl : iconSrc || faviconUrl}
                alt=""
                width={32}
                height={32}
                unoptimized
                className="h-8 w-8 object-contain"
                onError={() => setIconError((prev) => ({ ...prev, [link.id]: true }))}
              />
            ) : (
              <span className="text-lg font-semibold text-app-accent">
                {link.title.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-app-text transition-opacity group-hover:opacity-90">
              {link.title}
            </h3>
            <p className="mt-0.5 text-xs text-app-text-muted">
              {categoryName}
            </p>
          </div>
        </div>

        {/* 核心功能标语 - 箭头位置，简短即可 */}
        {(link.slogan || link.description || categoryName) && (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-app-card-hover px-3 py-2">
            <i className="ri-flashlight-fill text-base text-[#f59e0b]" />
            <span className="truncate text-sm text-app-text">
              {link.slogan || link.description?.slice(0, 24) || categoryName}
              {!link.slogan && (link.description?.length ?? 0) > 24 ? "..." : ""}
            </span>
          </div>
        )}

        {/* 详细描述 - 支持 Markdown，a 用 span+onClick 避免与卡片外层 <a> 嵌套 */}
        <div className="prose prose-sm mt-2 line-clamp-2 max-w-none text-sm text-app-text-muted [&_*]:!mt-0 [&_*]:!mb-0 [&_h2]:!text-sm [&_h2]:!font-semibold [&_h3]:!text-sm [&_code]:!rounded [&_code]:!bg-app-card-hover [&_code]:!px-1 [&_code]:!py-0.5 [&_code]:!text-xs">
          <ReactMarkdown
            components={{
              p: ({ children }) => <span>{children}</span>,
              h2: ({ children }) => <span className="font-semibold">{children}</span>,
              h3: ({ children }) => <span className="font-semibold">{children}</span>,
              a: ({ href, children }) => (
                <span
                  role="link"
                  tabIndex={0}
                  className="cursor-pointer underline text-app-accent hover:text-app-accent-secondary"
                  onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    if (href) window.open(href, "_blank", "noopener,noreferrer")
                  }}
                  onKeyDown={(e) => {
                    if ((e.key === "Enter" || e.key === " ") && href) {
                      e.stopPropagation()
                      e.preventDefault()
                      window.open(href, "_blank", "noopener,noreferrer")
                    }
                  }}
                >
                  {children}
                </span>
              ),
            }}
          >
            {link.description || link.url || ""}
          </ReactMarkdown>
        </div>

        {/* 底部提示 */}
        <div className="mt-3 flex items-center justify-between border-t border-app-border/60 pt-3">
          <span className="flex items-center gap-1.5 text-xs text-app-text-muted">
            <i className={isDirect ? "ri-external-link-line" : "ri-file-text-line"} />
            {isDirect ? "直达链接" : "详细介绍"}
          </span>
          <span className="text-xs text-app-accent transition-colors group-hover:text-app-accent-secondary">
            {isDirect ? "访问 →" : "查看详情 →"}
          </span>
        </div>
      </div>
    </motion.div>
  )

  if (isDirect) {
    return (
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleDirectClick}
      >
        {cardContent}
      </a>
    )
  }

  return (
    <Link href={`/nav/${link.id}`} prefetch={false} target="_blank" rel="noopener noreferrer">
      {cardContent}
    </Link>
  )
}
