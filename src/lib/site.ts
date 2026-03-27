import { browserProxyPathPrefix } from "@/lib/api-url"

/**
 * 站点配置与 SEO 工具
 */
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:9901"
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://linkwordx.xyz"
export const SITE_NAME = "LinkWord"

/** 工信部 ICP 备案公示文案与查询入口 */
export const SITE_ICP_LABEL = "陕ICP备2025083618号-2"
export const SITE_ICP_URL = "https://beian.miit.gov.cn/"

/** 生成完整绝对 URL；siteOrigin 不传则用 NEXT_PUBLIC_SITE_URL（多域名部署时建议在 metadata 里传入当前请求的 origin） */
export function getFullUrl(path: string, siteOrigin?: string): string {
  const base = (siteOrigin || SITE_URL).replace(/\/$/, "")
  const p = path.startsWith("/") ? path : `/${path}`
  return `${base}${p}`
}

/** 将相对图片路径转为绝对 URL（用于 OG 等）；生产走同源代理时与页面一致 */
export function resolveImageUrl(
  url: string | undefined,
  opts?: { siteOrigin?: string }
): string | undefined {
  if (!url?.trim()) return undefined
  if (url.startsWith("http://") || url.startsWith("https://")) return url
  const site = (opts?.siteOrigin || SITE_URL).replace(/\/$/, "")
  const px = browserProxyPathPrefix()
  if (px) {
    return `${site}${px}${url.startsWith("/") ? "" : "/"}${url}`
  }
  const base = API_BASE.replace(/\/$/, "")
  return base ? `${base}${url.startsWith("/") ? "" : "/"}${url}` : undefined
}

/** 简单去除 Markdown 格式，保留纯文本 */
export function stripMarkdown(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // [text](url) -> text
    .replace(/^#+\s*/gm, "") // ## header -> header
    .replace(/\*\*([^*]+)\*\*/g, "$1") // **bold** -> bold
    .replace(/\*([^*]+)\*/g, "$1") // *italic* -> italic
    .replace(/`([^`]+)`/g, "$1") // `code` -> code
    .trim()
}

/** 截断描述用于 meta description（约 150–160 字符合适） */
export function truncateForMeta(text: string | undefined, maxLen = 155): string {
  if (!text?.trim()) return ""
  const stripped = stripMarkdown(text).replace(/\s+/g, " ").trim()
  if (stripped.length <= maxLen) return stripped
  return stripped.slice(0, maxLen - 3) + "..."
}
