import { notFound } from "next/navigation"
import { getNavLinkDetail } from "@/lib/api"
import { getFullUrl, resolveImageUrl, truncateForMeta } from "@/lib/site"
import NavLinkDetailClient from "./NavLinkDetail"
import type { Metadata } from "next"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const item = await getNavLinkDetail(parseInt(id, 10))
  if (!item) {
    return { title: "网站详情" }
  }

  const pageUrl = getFullUrl(`/nav/${id}`)
  const desc = truncateForMeta(item.slogan || item.description)
  const ogImage = resolveImageUrl(item.cover)

  return {
    title: item.title,
    description: desc || `${item.title} - ${item.categoryName}，精选导航资源`,
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
    },
    keywords: [item.title, item.categoryName, item.slogan].filter(Boolean),
  }
}

export default async function NavLinkDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const numId = parseInt(id, 10)
  if (isNaN(numId)) notFound()

  let item: Awaited<ReturnType<typeof getNavLinkDetail>>
  try {
    item = await getNavLinkDetail(numId)
  } catch {
    item = null
  }

  if (!item) notFound()

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: item.title,
    description: item.slogan || item.description?.slice(0, 200),
    url: getFullUrl(`/nav/${item.id}`),
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
