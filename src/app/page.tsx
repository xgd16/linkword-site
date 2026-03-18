import { getNavTree, getPublishedArticleList } from "@/lib/api"
import type { NavTreeCategory, ArticleItem } from "@/lib/api"
import { getFullUrl } from "@/lib/site"
import FeaturedBanner from "@/components/FeaturedBanner"
import LatestReleases from "@/components/LatestReleases"
import TodayNews from "@/components/TodayNews"
import PageMotion from "@/components/PageMotion"

export const metadata = {
  openGraph: {
    url: getFullUrl("/"),
  },
}

export default async function HomePage() {
  let navTree: NavTreeCategory[] = []
  let articleRes: { list: ArticleItem[]; total: number } = { list: [], total: 0 }
  try {
    ;[navTree, articleRes] = await Promise.all([
      getNavTree(),
      getPublishedArticleList({ pageNum: 1, pageSize: 24 }),
    ])
  } catch {
    // 忽略 API 错误
  }

  const articles = articleRes.list

  return (
    <PageMotion className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* 特色区 */}
      <section className="mb-8">
        <FeaturedBanner navTree={navTree} articles={articles} />
      </section>

      {/* 今日要闻 */}
      {articles.length > 0 && <TodayNews article={articles[0]} />}

      {/* 最新发布 */}
      <section>
        <LatestReleases articles={articles} total={articleRes.total} />
      </section>
    </PageMotion>
  )
}
