"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { reportSiteVisit } from "@/lib/api"
import { getOrCreateVisitorId } from "@/lib/visitor"

/** 页面浏览上报：走 API 回源，不依赖 CDN 访问日志 */
export default function SiteVisitReporter({ locale }: { locale: string }) {
  const pathname = usePathname()

  useEffect(() => {
    const vid = getOrCreateVisitorId()
    if (!vid || !pathname) return
    void reportSiteVisit({ visitorId: vid, path: pathname, locale })
  }, [pathname, locale])

  return null
}
