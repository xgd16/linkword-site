const DEFAULT_API = "http://localhost:9901"

/**
 * 根据访问站点域名解析对应 API 根地址（各自站点只走各自 api 子域，不混用）。
 * - *.linkwordx.site → https://api.linkwordx.site
 * - *.linkwordx.xyz → https://api.linkwordx.xyz
 */
export function deriveApiBaseUrlFromHost(hostHeader: string): string | null {
  const raw = hostHeader.split(",")[0]?.trim().toLowerCase() ?? ""
  const host = raw.replace(/:\d+$/, "").replace(/^www\./, "")
  if (host.endsWith("linkwordx.site")) return "https://api.linkwordx.site"
  if (host.endsWith("linkwordx.xyz")) return "https://api.linkwordx.xyz"
  return null
}

export function getFallbackApiBaseUrl(): string {
  return (process.env.API_BASE_SERVER || process.env.NEXT_PUBLIC_API_BASE || DEFAULT_API).replace(/\/$/, "")
}

/** 生产构建下用于同源路径前缀（由 Edge 按 Host 转发）；开发环境为空，直连 NEXT_PUBLIC_API_BASE */
export function browserProxyPathPrefix(): string {
  if (process.env.NODE_ENV !== "production") return ""
  return "/proxy-api"
}

/** 浏览器端是否走 /proxy-api（生产且非本机访问时，避免跨域） */
export function shouldUseBrowserProxyApi(): boolean {
  if (typeof window === "undefined") return false
  if (process.env.NODE_ENV !== "production") return false
  const h = window.location.hostname
  return h !== "localhost" && h !== "127.0.0.1" && h !== "[::1]"
}

/** 用于 OG / canonical：当前请求对应的站点 origin（协议 + 主机） */
export function siteOriginFromHeaders(h: Headers): string | null {
  const hostRaw = h.get("x-forwarded-host") || h.get("host") || ""
  if (!hostRaw) return null
  const host = hostRaw.split(",")[0].trim().replace(/:\d+$/, "")
  const proto = h.get("x-forwarded-proto") || "https"
  return `${proto}://${host}`
}
