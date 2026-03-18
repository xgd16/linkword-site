"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "motion/react"
import type { NavTreeCategory } from "@/lib/api"

const MAIN_NAV = [
  { name: "网站首页", path: "/", icon: "ri-home-line" },
  { name: "网站导航", path: "/nav", icon: "ri-links-line" },
  { name: "文章列表", path: "/articles", icon: "ri-article-line" },
]

interface SidebarProps {
  navTree?: NavTreeCategory[]
}

export default function Sidebar({ navTree = [] }: SidebarProps) {
  const pathname = usePathname()

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
        <Link
          href="/"
          className="text-lg font-semibold text-app-text"
        >
          LinkWord
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="space-y-1 px-2">
          {MAIN_NAV.map((item, i) => (
            <motion.div
              key={item.path}
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.15 + i * 0.05 }}
            >
              <Link
                href={item.path}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  isActive(item.path)
                    ? "bg-app-card-hover font-medium text-app-text"
                    : "text-app-text-muted hover:bg-app-card-hover hover:text-app-text"
                }`}
              >
                <i className={`${item.icon} text-lg`} />
                {item.name}
              </Link>
            </motion.div>
          ))}
        </div>
        {navTree.length > 0 && (
          <>
            <div className="my-4 border-t border-app-border" />
            <div className="space-y-1 px-2">
              <p className="px-3 py-1 text-xs font-medium uppercase tracking-wider text-app-text-muted">
                热门频道
              </p>
              {navTree.slice(0, 5).map((cat, i) => (
                <motion.div
                  key={cat.id}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.2, delay: 0.3 + i * 0.04 }}
                >
                  <Link
                    href={`/nav?cat=${cat.id}`}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-app-text-muted transition-colors hover:bg-app-card-hover hover:text-app-text"
                  >
                    <i
                      className={`text-lg ${
                        cat.icon?.startsWith("ri-") ? cat.icon : "ri-folder-line"
                      }`}
                    />
                    {cat.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </nav>
    </motion.aside>
  )
}
