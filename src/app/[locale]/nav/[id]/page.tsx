import { notFound } from "next/navigation"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { getNavLinkDetail } from "@/lib/api"
import { resolveImageUrl, truncateForMeta } from "@/lib/site"
import { fullLocalizedUrl } from "@/lib/locale-url"
import NavLinkDetailClient from "./NavLinkDetail"
import type { Metadata } from "next"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}): Promise<Metadata> {
  const { locale, id } = await params
  const t = await getTranslations({ locale, namespace: "Metadata" })
  const item = await getNavLinkDetail(parseInt(id, 10), locale)
  if (!item) {
    return { title: t("navDetailFallbackTitle") }
  }

  const pageUrl = fullLocalizedUrl(locale, `/nav/${id}`)
  const desc = truncateForMeta(item.slogan || item.description)
  const ogImage = resolveImageUrl(item.cover)
  const fallbackDesc = t("navDetailDescTemplate", {
    title: item.title,
    category: item.categoryName,
  })

  return {
    title: item.title,
    description: desc || fallbackDesc,
    openGraph: {
      type: "website",
      url: pageUrl,
      title: item.title,
      description: desc || item.slogan || `${item.title} - ${item.categoryName}`,
      siteName: "LinkWord",
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: item.title }] : undefined,
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title: item.title,
      description: desc || item.slogan,
    },
    alternates: {
      canonical: pageUrl,
      languages: {
        zh: fullLocalizedUrl("zh", `/nav/${id}`),
        en: fullLocalizedUrl("en", `/nav/${id}`),
      },
    },
    keywords: [item.title, item.categoryName, item.slogan].filter(Boolean),
  }
}

export default async function NavLinkDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  setRequestLocale(locale)

  const numId = parseInt(id, 10)
  if (isNaN(numId)) notFound()

  let item: Awaited<ReturnType<typeof getNavLinkDetail>>
  try {
    item = await getNavLinkDetail(numId, locale)
  } catch {
    item = null
  }

  if (!item) notFound()

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: item.title,
    description: item.slogan || item.description?.slice(0, 200),
    url: fullLocalizedUrl(locale, `/nav/${item.id}`),
    mainEntity: {
      "@type": "WebSite",
      name: item.title,
      url: item.url,
      description: item.slogan,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NavLinkDetailClient item={item} />
    </>
  )
}
