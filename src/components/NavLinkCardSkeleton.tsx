"use client"

import { motion } from "motion/react"

export default function NavLinkCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-app-border bg-app-card animate-pulse">
      {/* 顶部占位 */}
      <div className="flex aspect-[2.2/1] items-center justify-center bg-gradient-to-br from-app-gradient-from/50 to-app-gradient-to/50">
        <div className="h-16 w-16 rounded-xl bg-app-border/40" />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 shrink-0 rounded-lg bg-app-border/40" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-4 w-3/4 rounded bg-app-border/40" />
            <div className="h-3 w-1/3 rounded bg-app-border/30" />
          </div>
        </div>
        <div className="mt-3 h-10 rounded-lg bg-app-border/30" />
        <div className="mt-2 space-y-2">
          <div className="h-3 w-full rounded bg-app-border/30" />
          <div className="h-3 w-2/3 rounded bg-app-border/30" />
        </div>
        <div className="mt-3 flex justify-between border-t border-app-border/60 pt-3">
          <div className="h-3 w-16 rounded bg-app-border/30" />
          <div className="h-3 w-12 rounded bg-app-border/30" />
        </div>
      </div>
    </div>
  )
}
