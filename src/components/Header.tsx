"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { Link, useRouter, usePathname } from "@/i18n/navigation"
import { motion } from "motion/react"
import ThemeSelector from "./ThemeSelector"
import LanguageSwitcher from "./LanguageSwitcher"
import { normalizeSearchKeyword } from "@/lib/searchKeyword"

export default function Header() {
  const t = useTranslations("Header")
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const urlKeyword = searchParams.get("keyword") ?? ""
  const cat = searchParams.get("cat") ?? ""
  const urlAi = searchParams.get("ai") === "1"
  const [keyword, setKeyword] = useState(urlKeyword)
  const [aiEnabled, setAiEnabled] = useState(urlAi)
  const isNavPage = pathname === "/nav"
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setKeyword(urlKeyword)
  }, [urlKeyword])

  useEffect(() => {
    setAiEnabled(urlAi)
  }, [urlAi])

  const getNavUrl = (kw: string, useAi = aiEnabled) => {
    const params = new URLSearchParams()
    const n = normalizeSearchKeyword(kw)
    if (n) params.set("keyword", n)
    if (cat) params.set("cat", cat)
    if (useAi) params.set("ai", "1")
    const q = params.toString()
    return q ? `/nav?${q}` : "/nav"
  }

  const navigateToNav = (url: string, replace = false) => {
    if (replace) {
      router.replace(url)
    } else {
      router.push(url)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const targetUrl = getNavUrl(keyword)
    navigateToNav(targetUrl)
  }

  const handleClearSearch = () => {
    setKeyword("")
    if (isNavPage) {
      navigateToNav(getNavUrl(""), true)
    }
    inputRef.current?.focus()
  }

  const handleAiToggle = () => {
    const nextAi = !aiEnabled
    setAiEnabled(nextAi)
    navigateToNav(getNavUrl(keyword, nextAi))
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 right-0 left-0 z-30 border-b border-app-border/80 bg-app-card/60 px-3 py-2 shadow-sm backdrop-blur-xl backdrop-saturate-150 sm:flex sm:h-14 sm:items-center sm:px-4 sm:py-0 lg:left-55 lg:pl-4"
    >
      <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <div className="flex w-full max-w-xl flex-1 items-center gap-2">
          <form onSubmit={handleSearch} className="flex min-w-0 flex-1">
          <div className="group/search flex w-full overflow-hidden rounded-xl border border-app-border bg-app-card-hover shadow-sm transition focus-within:border-app-accent focus-within:shadow-md focus-within:shadow-app-accent/10 focus-within:ring-2 focus-within:ring-app-accent/20">
            <div className="relative min-w-0 flex-1">
              <i className="ri-search-line pointer-events-none absolute left-3 top-1/2 z-1 -translate-y-1/2 text-base text-app-text-muted transition group-focus-within/search:text-app-accent" />
              <input
                ref={inputRef}
                type="search"
                value={keyword}
                onChange={(e) => {
                  const v = e.target.value
                  setKeyword(v)
                  if (isNavPage && !normalizeSearchKeyword(v)) {
                    router.push(getNavUrl(v))
                  }
                }}
                placeholder={aiEnabled ? t("searchPlaceholderAi") : t("searchPlaceholder")}
                enterKeyHint="search"
                className="app-search-input w-full border-0 bg-transparent py-2.5 pl-9 pr-11 text-sm text-app-text placeholder:text-app-text-muted/90 placeholder:italic outline-none focus:ring-0"
              />
              {keyword && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  aria-label={t("searchClearAria")}
                  className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-app-text-muted transition hover:bg-app-card hover:text-app-text"
                >
                  <i className="ri-close-line text-base" aria-hidden />
                </button>
              )}
            </div>
            <motion.button
              type="submit"
              aria-label={t("searchSubmitAria")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative flex shrink-0 items-center gap-1.5 border-l border-app-border/80 bg-linear-to-br from-app-accent/15 via-app-accent/10 to-transparent px-3.5 py-2 text-sm font-medium text-app-accent transition-colors hover:border-app-accent/40 hover:from-app-accent hover:via-app-accent hover:to-app-accent-secondary hover:text-white hover:shadow-inner sm:px-4"
            >
              <i className="ri-search-2-line text-lg leading-none" aria-hidden />
              <span className="hidden sm:inline">{t("searchSubmit")}</span>
            </motion.button>
          </div>
          </form>
          <button
            type="button"
            onClick={handleAiToggle}
            aria-pressed={aiEnabled}
            aria-label={t("aiSearchToggleAria")}
            className={`inline-flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition ${
              aiEnabled
                ? "border-app-accent bg-app-accent/12 text-app-accent"
                : "border-app-border bg-app-card-hover text-app-text-muted hover:text-app-text"
            }`}
          >
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                aiEnabled
                  ? "bg-app-accent shadow-[0_0_12px_rgba(79,70,229,0.55)]"
                  : "bg-app-text-muted/40"
              }`}
            />
            <span className="hidden sm:inline">{t("aiSearch")}</span>
            <span className="sm:hidden">AI</span>
          </button>
        </div>
        <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:flex-1 sm:justify-end">
          <div className="flex items-center gap-1.5 lg:hidden">
            <Link
              href="/nav"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-app-border bg-app-card/70 px-2.5 py-2 text-xs text-app-text-muted transition hover:bg-app-card-hover hover:text-app-text sm:px-3 sm:text-sm"
            >
              <i className="ri-links-line text-base" />
              <span>{t("nav")}</span>
            </Link>
            <Link
              href="/articles"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-app-border bg-app-card/70 px-2.5 py-2 text-xs text-app-text-muted transition hover:bg-app-card-hover hover:text-app-text sm:px-3 sm:text-sm"
            >
              <i className="ri-article-line text-base" />
              <span>{t("articles")}</span>
            </Link>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <LanguageSwitcher />
            <Link
              href="/settings"
              className="rounded-lg p-2 text-app-text-muted transition hover:bg-app-card-hover hover:text-app-text"
              aria-label={t("settingsAria")}
            >
              <i className="ri-settings-3-line text-lg" />
            </Link>
            <ThemeSelector />
          </div>
        </div>
      </div>
    </motion.header>
  )
}
