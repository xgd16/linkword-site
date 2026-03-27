"use client"

import { useTranslations } from "next-intl"
import { Link, usePathname } from "@/i18n/navigation"
import { motion } from "motion/react"
import { SITE_ICP_LABEL, SITE_ICP_URL } from "@/lib/site"

interface SidebarProps {
  children?: React.ReactNode
}

export default function Sidebar({ children }: SidebarProps) {
  const t = useTranslations("Sidebar")
  const pathname = usePathname()

  const mainNav = [
    { nameKey: "home" as const, path: "/", icon: "ri-home-line" },
    { nameKey: "nav" as const, path: "/nav", icon: "ri-links-line" },
    { nameKey: "articles" as const, path: "/articles", icon: "ri-article-line" },
    { nameKey: "settings" as const, path: "/settings", icon: "ri-settings-3-line" },
  ]

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/"
    return pathname.startsWith(path)
  }

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="fixed left-0 top-0 z-40 hidden h-full w-[220px] flex-col border-r border-app-border/80 bg-app-card/60 shadow-sm backdrop-blur-xl backdrop-saturate-150 lg:flex"
    >
      <div className="flex h-14 items-center border-b border-app-border px-4">
        <Link href="/" className="text-lg font-semibold text-app-text">
          LinkWord
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="space-y-1 px-2">
          {mainNav.map((item, i) => (
            <motion.div
              key={item.path}
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.15 + i * 0.05 }}
            >
              <Link
                href={item.path}
                className={`flex min-h-11 items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  isActive(item.path)
                    ? "bg-app-card-hover font-medium text-app-text"
                    : "text-app-text-muted hover:bg-app-card-hover hover:text-app-text"
                }`}
              >
                <i className={`${item.icon} text-lg`} />
                {t(item.nameKey)}
              </Link>
            </motion.div>
          ))}
        </div>
        {children}
      </nav>
      <footer className="shrink-0 border-t border-app-border/80 px-3 py-2.5 text-center">
        <a
          href={SITE_ICP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-[11px] leading-snug text-app-text-muted transition hover:text-app-text"
        >
          {SITE_ICP_LABEL}
        </a>
      </footer>
    </motion.aside>
  )
}
