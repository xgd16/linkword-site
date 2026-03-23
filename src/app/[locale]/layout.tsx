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
import BackgroundEffects from "@/components/BackgroundEffects"
import { ThemeProvider } from "@/components/ThemeProvider"
import { SettingsProvider } from "@/components/SettingsProvider"
import { SITE_NAME, SITE_URL } from "@/lib/site"
import { routing } from "@/i18n/routing"
import { fullLocalizedUrl } from "@/lib/locale-url"
import SiteVisitReporter from "@/components/SiteVisitReporter"

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Geist+Mono:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen text-app-text antialiased">
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
              <Suspense
                fallback={
                  <header className="fixed top-0 right-0 left-0 z-30 h-14 border-b border-app-border/80 bg-app-card/60 lg:left-[220px]" />
                }
              >
                <Header />
              </Suspense>
              <main className="min-h-screen pt-14 lg:pl-[220px]">{children}</main>
            </SettingsProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
