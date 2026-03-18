import type { Metadata } from "next"
import { Suspense } from "react"
import { Geist, Geist_Mono } from "next/font/google"
import "remixicon/fonts/remixicon.css"
import "./globals.css"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import BackgroundEffects from "@/components/BackgroundEffects"
import { ThemeProvider } from "@/components/ThemeProvider"
import { SettingsProvider } from "@/components/SettingsProvider"
import { getNavCategoriesHot, type NavTreeCategory } from "@/lib/api"
import { SITE_NAME, SITE_URL, getFullUrl } from "@/lib/site"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const defaultTitle = `${SITE_NAME} - 网站导航与文章`
const defaultDesc = "网站导航 + 文章系统，精选资源与资讯"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: defaultTitle, template: `%s - ${SITE_NAME}` },
  description: defaultDesc,
  keywords: ["网站导航", "精选链接", "工具导航", "文章", "资讯"],
  authors: [{ name: SITE_NAME }],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: getFullUrl("/"),
    siteName: SITE_NAME,
    title: defaultTitle,
    description: defaultDesc,
    images: [],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDesc,
  },
  alternates: {
    canonical: getFullUrl("/"),
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  let navTree: NavTreeCategory[] = []
  try {
    const hotCategories = await getNavCategoriesHot(5)
    navTree = hotCategories.map((c): NavTreeCategory => ({ ...c, links: [] }))
  } catch {
    // 忽略 API 错误，使用空导航
  }

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen text-app-text antialiased`}
      >
        <ThemeProvider>
          <SettingsProvider>
          <BackgroundEffects />
          <Sidebar navTree={navTree} />
          <Suspense fallback={<header className="fixed top-0 right-0 left-0 z-30 h-14 border-b border-app-border/80 bg-app-card/60 lg:left-[220px]" />}>
            <Header />
          </Suspense>
          <main className="min-h-screen pt-14 lg:pl-[220px]">
            {children}
          </main>
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
