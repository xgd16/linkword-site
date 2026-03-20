"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { motion, AnimatePresence } from "motion/react"
import { THEMES, type ThemeId } from "@/lib/theme"

function themeKey(id: ThemeId): string {
  return id.replace(/^theme-/, "")
}

export default function ThemeSelector() {
  const t = useTranslations("Theme")
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    queueMicrotask(() => setMounted(true))
  }, [])

  if (!mounted) {
    return (
      <button
        type="button"
        className="rounded-lg p-2 text-app-text-muted"
        aria-label={t("openAria")}
      >
        <i className="ri-contrast-line text-lg" />
      </button>
    )
  }

  const currentTheme = THEMES.find((th) => th.id === (resolvedTheme || theme))
  const displayTheme = currentTheme ?? THEMES[0]

  return (
    <div className="relative">
      <motion.button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg p-2 text-app-text-muted transition-colors hover:bg-app-card-hover hover:text-app-text"
        aria-label={t("chooseAria")}
        aria-expanded={open}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <i className={`text-lg ${displayTheme.icon}`} />
        <span className="hidden text-sm sm:inline">{t(themeKey(displayTheme.id))}</span>
        <i className={`ri-arrow-down-s-line text-sm transition ${open ? "rotate-180" : ""}`} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-40"
              aria-hidden="true"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full z-50 mt-1 min-w-[140px] overflow-hidden rounded-xl border border-app-border bg-app-card py-1 shadow-lg"
            >
              {THEMES.map((th) => (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => {
                    setTheme(th.id as ThemeId)
                    setOpen(false)
                  }}
                  className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition ${
                    (resolvedTheme || theme) === th.id
                      ? "bg-app-accent-muted text-app-accent"
                      : "hover:bg-app-card-hover text-app-text"
                  }`}
                >
                  <i className={th.icon} />
                  {t(themeKey(th.id))}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
