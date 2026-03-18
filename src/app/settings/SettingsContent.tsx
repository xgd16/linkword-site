"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { useTheme } from "next-themes"
import { useNavClickMode } from "@/components/SettingsProvider"
import { THEMES, type ThemeId } from "@/lib/theme"
import type { NavClickMode } from "@/lib/settings"

const NAV_CLICK_OPTIONS: { value: NavClickMode; label: string; desc: string; icon: string }[] = [
  {
    value: "detail",
    label: "打开详情页",
    desc: "点击导航卡片时在新标签页打开网站详细介绍",
    icon: "ri-file-text-line",
  },
  {
    value: "direct",
    label: "直接跳转网站",
    desc: "点击导航卡片时直接打开目标网站",
    icon: "ri-external-link-line",
  },
]

export default function SettingsContent() {
  const { navClickMode, setNavClickMode } = useNavClickMode()
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const currentThemeId = (resolvedTheme || theme) as ThemeId

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* 网站主题 */}
      <div className="rounded-2xl border border-app-border bg-app-card p-6 sm:p-8">
        <h2 className="mb-2 text-lg font-medium text-app-text">网站主题</h2>
        <p className="mb-6 text-sm text-app-text-muted">
          选择界面配色与风格
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 xl:gap-4">
          {THEMES.map((t) => {
            const isActive = mounted && (currentThemeId === t.id)
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTheme(t.id)}
                className={`flex flex-col overflow-hidden rounded-xl border transition xl:min-w-0 ${
                  isActive
                    ? "border-app-accent bg-app-accent-muted"
                    : "border-app-border bg-app-card-hover hover:border-app-border"
                }`}
              >
                {/* 颜色范围示例 */}
                <div className="flex h-12 w-full shrink-0">
                  {t.colors.map((c, i) => (
                    <div
                      key={i}
                      className="flex-1"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <div className="flex flex-col items-center gap-1.5 p-3 xl:p-4">
                  <i
                    className={`text-xl ${
                      isActive ? "text-app-accent" : "text-app-text-muted"
                    } ${t.icon}`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      isActive ? "text-app-accent" : "text-app-text"
                    }`}
                  >
                    {t.name}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* 导航点击行为 */}
      <div className="rounded-2xl border border-app-border bg-app-card p-6 sm:p-8">
        <h2 className="mb-2 text-lg font-medium text-app-text">导航点击行为</h2>
        <p className="mb-6 text-sm text-app-text-muted">
          设置点击导航卡片时的行为
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:gap-6">
          {NAV_CLICK_OPTIONS.map((opt) => (
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
                  {opt.label}
                </p>
                <p className="mt-1 text-sm text-app-text-muted">{opt.desc}</p>
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
