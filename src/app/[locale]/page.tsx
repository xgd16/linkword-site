import { setRequestLocale } from "next-intl/server"
import { getPublishedArticleList } from "@/lib/api"
import type { ArticleItem } from "@/lib/api"
import { fullLocalizedUrl } from "@/lib/locale-url"
import HeroSection from "@/components/HeroSection"
import FeaturedBanner from "@/components/FeaturedBanner"
import LatestReleases from "@/components/LatestReleases"
import PageMotion from "@/components/PageMotion"

export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return {
    openGraph: {
      url: fullLocalizedUrl(locale, "/"),
    },
  }
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  let articleRes: { list: ArticleItem[]; total: number } = { list: [], total: 0 }
  try {
    articleRes = await getPublishedArticleList({ pageNum: 1, pageSize: 24, locale })
  } catch {
    // 忽略 API 错误
  }

  const articles = articleRes.list

  return (
    <PageMotion className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="mb-10">
        <HeroSection />
      </section>

      <section className="mb-12">
        <FeaturedBanner articles={articles} />
      </section>

      <section>
        <LatestReleases articles={articles} total={articleRes.total} />
      </section>
    </PageMotion>
  )
}
