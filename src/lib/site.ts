/**
 * 站点配置与 SEO 工具
 */
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:9901"
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://linkwordx.xyz"
export const SITE_NAME = "LinkWord"

/** 生成完整绝对 URL */
export function getFullUrl(path: string): string {
  const base = SITE_URL.replace(/\/$/, "")
  const p = path.startsWith("/") ? path : `/${path}`
  return `${base}${p}`
}

/** 将相对图片路径转为绝对 URL（用于 OG 等） */
export function resolveImageUrl(url: string | undefined): string | undefined {
  if (!url?.trim()) return undefined
  if (url.startsWith("http://") || url.startsWith("https://")) return url
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
