import { getPublishedArticleList } from "@/lib/api"
import type { ArticleItem } from "@/lib/api"
import { getFullUrl } from "@/lib/site"
import HeroSection from "@/components/HeroSection"
import FeaturedBanner from "@/components/FeaturedBanner"
import LatestReleases from "@/components/LatestReleases"
import PageMotion from "@/components/PageMotion"

export const metadata = {
  openGraph: {
    url: getFullUrl("/"),
  },
}

export default async function HomePage() {
  let articleRes: { list: ArticleItem[]; total: number } = { list: [], total: 0 }
  try {
    articleRes = await getPublishedArticleList({ pageNum: 1, pageSize: 24 })
  } catch {
    // 忽略 API 错误
  }

  const articles = articleRes.list

  return (
    <PageMotion className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero 区域 */}
      <section className="mb-10">
        <HeroSection />
      </section>

      {/* 特色内容区：轮播图 + 点击排行榜 */}
      <section className="mb-12">
        <FeaturedBanner articles={articles} />
      </section>

      {/* 最新发布 */}
      <section>
        <LatestReleases articles={articles} total={articleRes.total} />
      </section>
    </PageMotion>
  )
}
