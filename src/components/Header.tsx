"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { motion } from "motion/react"
import ThemeSelector from "./ThemeSelector"

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const urlKeyword = searchParams.get("keyword") ?? ""
  const cat = searchParams.get("cat") ?? ""
  const [keyword, setKeyword] = useState(urlKeyword)
  const isNavPage = pathname === "/nav"

  useEffect(() => {
    setKeyword(urlKeyword)
  }, [urlKeyword])

  const getNavUrl = (kw: string) => {
    const params = new URLSearchParams()
    if (kw.trim()) params.set("keyword", kw.trim())
    if (cat) params.set("cat", cat)
    const q = params.toString()
    return q ? `/nav?${q}` : "/nav"
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(getNavUrl(keyword))
  }


  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 right-0 left-0 z-30 flex h-14 items-center justify-between gap-2 border-b border-app-border/80 bg-app-card/60 px-4 shadow-sm backdrop-blur-xl backdrop-saturate-150 lg:left-[220px] lg:pl-4"
    >
      <div className="flex flex-1 items-center gap-4">
        <form onSubmit={handleSearch} className="flex max-w-xl flex-1">
          <div className="relative flex w-full">
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-base text-app-text-muted" />
            <input
              type="search"
              value={keyword}
              onChange={(e) => {
                const v = e.target.value
                setKeyword(v)
                if (isNavPage && !v.trim()) {
                  router.push(getNavUrl(v))
                }
              }}
              placeholder="搜索"
              className="w-full rounded-lg border border-app-border bg-app-card-hover py-2 pl-9 pr-4 text-sm text-app-text placeholder-app-text-muted outline-none transition placeholder:italic focus:border-app-accent focus:ring-2 focus:ring-app-accent/20"
            />
          </div>
        </form>
        <div className="flex items-center gap-2">
          <Link
            href="/nav"
            className="rounded-lg px-3 py-2 text-sm text-app-text-muted transition hover:text-app-text lg:hidden"
          >
            导航
          </Link>
          <Link
            href="/articles"
            className="rounded-lg px-3 py-2 text-sm text-app-text-muted transition hover:text-app-text lg:hidden"
          >
            文章
          </Link>
          <ThemeSelector />
        </div>
      </div>
      <div className="ml-4 flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-app-text">
            LinkWord
          </p>
          <p className="text-xs text-app-text-muted">网站导航 + 文章系统</p>
        </div>
      </div>
    </motion.header>
  )
}
