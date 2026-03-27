import { notFound } from "next/navigation"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { getPublishedArticleDetail } from "@/lib/api"
import { resolveImageUrl, truncateForMeta, SITE_URL } from "@/lib/site"
import { fullLocalizedUrl } from "@/lib/locale-url"
import { siteOriginFromHeaders } from "@/lib/api-url"
import { headers } from "next/headers"
import ArticleDetailClient from "./ArticleDetail"
import type { Metadata } from "next"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}): Promise<Metadata> {
  const { locale, id } = await params
  const t = await getTranslations({ locale, namespace: "Metadata" })
  const article = await getPublishedArticleDetail({ id: parseInt(id, 10), locale })
  if (!article) {
    return { title: t("articleFallbackTitle") }
  }

  const h = await headers()
  const siteOrigin = siteOriginFromHeaders(h) ?? SITE_URL
  const pageUrl = fullLocalizedUrl(locale, `/articles/${id}`, siteOrigin)
  const desc = truncateForMeta(article.summary)
  const ogImage = resolveImageUrl(article.cover, { siteOrigin })
  const ogLocale = locale === "zh" ? "zh_CN" : "en_US"

  return {
    title: article.title,
    description: desc || truncateForMeta(article.content, 155),
    openGraph: {
      type: "article",
      locale: ogLocale,
      url: pageUrl,
      title: article.title,
      description: desc || article.summary,
      siteName: "LinkWord",
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: article.title }] : undefined,
      publishedTime: article.createTime,
      modifiedTime: article.updateTime,
      authors: ["LinkWord"],
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title: article.title,
      description: desc || article.summary,
    },
    alternates: {
      canonical: pageUrl,
      languages: {
        zh: fullLocalizedUrl("zh", `/articles/${id}`, siteOrigin),
        en: fullLocalizedUrl("en", `/articles/${id}`, siteOrigin),
      },
    },
    keywords: [article.title, ...(article.tagNames || [])].filter(Boolean),
  }
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  setRequestLocale(locale)

  const numId = parseInt(id, 10)
  if (isNaN(numId)) notFound()

  let article: Awaited<ReturnType<typeof getPublishedArticleDetail>>
  try {
    article = await getPublishedArticleDetail({ id: numId, locale })
  } catch {
    article = null
  }

  if (!article) notFound()

  const hdrs = await headers()
  const siteOrigin = siteOriginFromHeaders(hdrs) ?? SITE_URL
  const pageUrl = fullLocalizedUrl(locale, `/articles/${article.id}`, siteOrigin)
  const ogImage = resolveImageUrl(article.cover, { siteOrigin })

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.summary || truncateForMeta(article.content, 200),
    image: ogImage ? [ogImage] : undefined,
    url: pageUrl,
    datePublished: article.createTime,
    dateModified: article.updateTime || article.createTime,
    author: {
      "@type": "Organization",
      name: "LinkWord",
    },
    publisher: {
      "@type": "Organization",
      name: "LinkWord",
    },
    ...(article.tagNames?.length ? { keywords: article.tagNames.join(", ") } : {}),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleDetailClient article={article} />
    </>
  )
}
