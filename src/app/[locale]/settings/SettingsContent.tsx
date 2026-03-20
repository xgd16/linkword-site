"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { motion } from "motion/react"
import { useTheme } from "next-themes"
import { useNavClickMode } from "@/components/SettingsProvider"
import { THEMES, type ThemeId } from "@/lib/theme"
import type { NavClickMode } from "@/lib/settings"

function themeKey(id: ThemeId): string {
  return id.replace(/^theme-/, "")
}

export default function SettingsContent() {
  const t = useTranslations("Settings")
  const tTheme = useTranslations("Theme")
  const { navClickMode, setNavClickMode } = useNavClickMode()
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const navOptions: { value: NavClickMode; labelKey: "detailLabel" | "directLabel"; descKey: "detailDesc" | "directDesc"; icon: string }[] = [
    { value: "detail", labelKey: "detailLabel", descKey: "detailDesc", icon: "ri-file-text-line" },
    { value: "direct", labelKey: "directLabel", descKey: "directDesc", icon: "ri-external-link-line" },
  ]

  useEffect(() => {
    queueMicrotask(() => setMounted(true))
  }, [])

  const currentThemeId = (resolvedTheme || theme) as ThemeId

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div className="rounded-2xl border border-app-border bg-app-card p-6 sm:p-8">
        <h2 className="mb-2 text-lg font-medium text-app-text">{t("themeSection")}</h2>
        <p className="mb-6 text-sm text-app-text-muted">{t("themeHint")}</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 xl:gap-4">
          {THEMES.map((th) => {
            const isActive = mounted && currentThemeId === th.id
            return (
              <button
                key={th.id}
                type="button"
                onClick={() => setTheme(th.id)}
                className={`flex flex-col overflow-hidden rounded-xl border transition xl:min-w-0 ${
                  isActive
                    ? "border-app-accent bg-app-accent-muted"
                    : "border-app-border bg-app-card-hover hover:border-app-border"
                }`}
              >
                <div className="flex h-12 w-full shrink-0">
                  {th.colors.map((c, i) => (
                    <div key={i} className="flex-1" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <div className="flex flex-col items-center gap-1.5 p-3 xl:p-4">
                  <i
                    className={`text-xl ${
                      isActive ? "text-app-accent" : "text-app-text-muted"
                    } ${th.icon}`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      isActive ? "text-app-accent" : "text-app-text"
                    }`}
                  >
                    {tTheme(themeKey(th.id))}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-app-border bg-app-card p-6 sm:p-8">
        <h2 className="mb-2 text-lg font-medium text-app-text">{t("navBehaviorSection")}</h2>
        <p className="mb-6 text-sm text-app-text-muted">{t("navBehaviorHint")}</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:gap-6">
          {navOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setNavClickMode(opt.value)}
              className={`flex items-start gap-4 rounded-xl border p-5 text-left transition xl:p-6 ${
                navClickMode === opt.value
                  ? "border-app-accent bg-app-accent-muted"
                  : "border-app-border bg-app-card-hover hover:border-app-border"
              }`}
            >
              <i
                className={`shrink-0 text-2xl ${
                  navClickMode === opt.value ? "text-app-accent" : "text-app-text-muted"
                } ${opt.icon}`}
              />
              <div className="min-w-0 flex-1">
                <p
                  className={
                    navClickMode === opt.value
                      ? "font-medium text-app-accent"
                      : "font-medium text-app-text"
                  }
                >
                  {t(opt.labelKey)}
                </p>
                <p className="mt-1 text-sm text-app-text-muted">{t(opt.descKey)}</p>
              </div>
              {navClickMode === opt.value && (
                <i className="ri-checkbox-circle-fill shrink-0 text-xl text-app-accent" />
              )}
            </button>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
