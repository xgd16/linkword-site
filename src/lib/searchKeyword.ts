/**
 * 与后端 searchutil 对齐：规范化查询词、拆词（用于高亮等）。
 * 后续接入向量检索时，可在此区分 mode 或追加 query 参数。
 */

const MAX_TOKEN_COUNT = 8

/** 与后端一致：trim、合并空白、长度上限（按 Unicode 码点） */
export function normalizeSearchKeyword(raw: string): string {
  const s = raw.trim().replace(/\s+/g, " ")
  if (!s) return ""
  let out = ""
  let n = 0
  for (const ch of s) {
    if (n >= 128) break
    out += ch
    n++
  }
  return out
}

/** 拆成去重后的词列表（保序），用于高亮 */
export function searchTokensFromKeyword(normalized: string): string[] {
  if (!normalized) return []
  const parts = normalized.split(/\s+/).filter(Boolean)
  const seen = new Set<string>()
  const out: string[] = []
  for (const p of parts) {
    if (seen.has(p)) continue
    seen.add(p)
    out.push(p)
    if (out.length >= MAX_TOKEN_COUNT) break
  }
  return out
}
