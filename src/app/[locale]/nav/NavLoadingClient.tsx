"use client"

import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import NavLinkCardSkeleton from "@/components/NavLinkCardSkeleton"

export default function NavLoadingClient() {
  const t = useTranslations("NavContent")
  const searchParams = useSearchParams()
  const isAiSearch = searchParams.get("ai") === "1"

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="h-7 w-32 animate-pulse rounded-lg bg-app-border/40" />
        <div className="h-5 w-16 animate-pulse rounded bg-app-border/30" />
      </div>
      {isAiSearch && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-app-accent/30 bg-app-accent/5 px-4 py-3 text-sm text-app-accent">
          <i className="ri-loader-4-line animate-spin text-base" />
          <span>{t("aiProcessing")}</span>
        </div>
      )}
      {/* 分类骨架 */}
      <div className="mb-8 flex flex-wrap gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-9 w-16 animate-pulse rounded-lg bg-app-border/30" />
        ))}
      </div>
      {/* 卡片骨架 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <NavLinkCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
