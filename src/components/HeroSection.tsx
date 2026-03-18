"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { staggerContainer, staggerItem } from "@/lib/motion"
import { SITE_NAME } from "@/lib/site"

const quickLinks = [
  { href: "/nav", label: "网站导航", icon: "ri-links-line" },
  { href: "/articles", label: "文章中心", icon: "ri-article-line" },
]

export default function HeroSection() {
  return (
    <motion.section
      variants={staggerContainer(0, 0.06)}
      initial="hidden"
      animate="show"
      className="relative overflow-hidden rounded-2xl border border-app-border bg-gradient-to-br from-app-gradient-from via-app-card to-app-gradient-to px-6 py-10 sm:px-8 sm:py-12 md:px-10 md:py-14"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,var(--app-accent-muted)_0%,transparent_60%)] opacity-60" />
      <div className="relative">
        <motion.h1
          variants={staggerItem}
          className="text-2xl font-semibold tracking-tight text-app-text sm:text-3xl md:text-4xl"
        >
          {SITE_NAME}
        </motion.h1>
        <motion.p
          variants={staggerItem}
          className="mt-2 text-base text-app-text-muted sm:text-lg"
        >
          精选网站导航 · 实用工具与文章
        </motion.p>
        <motion.div
          variants={staggerItem}
          className="mt-6 flex flex-wrap gap-3"
        >
          {quickLinks.map((link) => (
            <span key={link.href}>
              <Link
                href={link.href}
                className="group inline-flex items-center gap-2 rounded-xl border border-app-border bg-app-card px-4 py-2.5 text-sm font-medium text-app-text transition-all duration-200 hover:border-app-accent/50 hover:bg-app-card-hover hover:shadow-sm"
              >
                <i className={`${link.icon} text-base text-app-accent`} />
                {link.label}
              </Link>
            </span>
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}
