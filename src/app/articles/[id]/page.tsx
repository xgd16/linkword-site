import { notFound } from "next/navigation"
import { getPublishedArticleDetail } from "@/lib/api"
import { getFullUrl, resolveImageUrl, truncateForMeta } from "@/lib/site"
import ArticleDetailClient from "./ArticleDetail"
import type { Metadata } from "next"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const article = await getPublishedArticleDetail({ id: parseInt(id, 10) })
  if (!article) {
    return { title: "文章详情" }
  }

  const pageUrl = getFullUrl(`/articles/${id}`)
  const desc = truncateForMeta(article.summary)
  const ogImage = resolveImageUrl(article.cover)

  return {
    title: article.title,
    description: desc || truncateForMeta(article.content, 155),
    openGraph: {
      type: "article",
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
    },
    keywords: [article.title, ...(article.tagNames || [])].filter(Boolean),
  }
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const numId = parseInt(id, 10)
  if (isNaN(numId)) notFound()

  let article: Awaited<ReturnType<typeof getPublishedArticleDetail>>
  try {
    article = await getPublishedArticleDetail({ id: numId })
  } catch {
    article = null
  }

  if (!article) notFound()

  const pageUrl = getFullUrl(`/articles/${article.id}`)
  const ogImage = resolveImageUrl(article.cover)

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
