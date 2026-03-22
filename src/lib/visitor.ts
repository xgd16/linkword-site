const VISITOR_STORAGE_KEY = "lw_site_vid"

/** 持久访客标识，用于源站统计 UV（CDN 静态页亦可在浏览器回源上报） */
export function getOrCreateVisitorId(): string {
  if (typeof window === "undefined") return ""
  try {
    let id = localStorage.getItem(VISITOR_STORAGE_KEY)
    if (!id || id.length < 8) {
      id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`
      localStorage.setItem(VISITOR_STORAGE_KEY, id)
    }
    return id
  } catch {
    return ""
  }
}
