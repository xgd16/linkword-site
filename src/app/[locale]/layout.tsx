import type { Metadata } from "next"
import { Suspense } from "react"
import { notFound } from "next/navigation"
import { hasLocale, NextIntlClientProvider } from "next-intl"
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server"
import "remixicon/fonts/remixicon.css"
import "../globals.css"
import Sidebar from "@/components/Sidebar"
import SidebarHotChannels from "@/components/SidebarHotChannels"
import SidebarHotChannelsSkeleton from "@/components/SidebarHotChannelsSkeleton"
import Header from "@/components/Header"
import { SearchTransitionProvider } from "@/components/SearchTransitionProvider"
import BackgroundEffects from "@/components/BackgroundEffects"
import { ThemeProvider } from "@/components/ThemeProvider"
import { SettingsProvider } from "@/components/SettingsProvider"
import { SITE_NAME, SITE_URL } from "@/lib/site"
import { routing } from "@/i18n/routing"
import { fullLocalizedUrl } from "@/lib/locale-url"
import SiteVisitReporter from "@/components/SiteVisitReporter"
import { fontMono, fontSans } from "../fonts"

/** 与首页等 ISR 一致，避免布局内 fetch no-store 拖成全站动态 → 主文档 Cache-Control: no-store 阻断 bfcache */
export const revalidate = 120

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "Metadata" })
  const title = t("siteTitle")
  const description = t("siteDescription")
  const keywords = t("siteKeywords")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)

  const canonical = fullLocalizedUrl(locale, "/")
  const ogLocale = locale === "zh" ? "zh_CN" : "en_US"
  const altEn = fullLocalizedUrl("en", "/")
  const altZh = fullLocalizedUrl("zh", "/")

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: `%s - ${SITE_NAME}` },
    description,
    keywords,
    authors: [{ name: SITE_NAME }],
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: ogLocale,
      url: canonical,
      siteName: SITE_NAME,
      title,
      description,
      images: [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical,
      languages: {
        zh: altZh,
        en: altEn,
      },
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)
  const messages = await getMessages()
  const lang = locale === "zh" ? "zh-CN" : "en"

  return (
    <html lang={lang} suppressHydrationWarning>
      <body
        className={`min-h-screen text-app-text antialiased ${fontSans.variable} ${fontMono.variable}`}
      >
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <SettingsProvider>
              <SiteVisitReporter locale={locale} />
              <BackgroundEffects />
              <Sidebar>
                <Suspense fallback={<SidebarHotChannelsSkeleton />}>
                  <SidebarHotChannels locale={locale} />
                </Suspense>
              </Sidebar>
              <SearchTransitionProvider>
                <Suspense
                  fallback={
                    <header className="fixed top-0 right-0 left-0 z-30 h-24 border-b border-app-border/80 bg-app-card/60 sm:h-14 lg:left-55" />
                  }
                >
                  <Header />
                </Suspense>
                <main className="min-h-screen pt-24 sm:pt-14 lg:pl-55">{children}</main>
              </SearchTransitionProvider>
            </SettingsProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
