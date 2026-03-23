"use client"

import { useMemo, type ReactNode } from "react"

/** 纯文本关键词高亮（不解析 HTML） */
export default function HighlightPlain({ text, tokens }: { text: string; tokens: string[] }) {
  const nodes = useMemo(() => {
    if (!text || tokens.length === 0) return null
    const escaped = tokens
      .filter((t) => t.length > 0)
      .map((t) => t.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&"))
    if (escaped.length === 0) return null
    const re = new RegExp(`(${escaped.join("|")})`, "giu")
    const out: ReactNode[] = []
    let last = 0
    let m: RegExpExecArray | null
    const r = new RegExp(re.source, re.flags)
    while ((m = r.exec(text)) !== null) {
      if (m.index > last) {
        out.push(text.slice(last, m.index))
      }
      out.push(
        <mark
          key={`${m.index}-${m[0]}`}
          className="rounded-sm bg-app-accent/25 px-0.5 text-inherit"
        >
          {m[0]}
        </mark>
      )
      last = m.index + m[0].length
    }
    if (last < text.length) {
      out.push(text.slice(last))
    }
    return out
  }, [text, tokens])

  if (nodes === null) return text
  return <>{nodes}</>
}
