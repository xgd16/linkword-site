import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { getPublishedArticleList } from "@/lib/api"
import type { ArticleItem } from "@/lib/api"
import { fullLocalizedUrl } from "@/lib/locale-url"
import { SITE_NAME } from "@/lib/site"
import HeroSection from "@/components/HeroSection"
import FeaturedBanner from "@/components/FeaturedBanner"
import LatestReleases from "@/components/LatestReleases"
import PageMotion from "@/components/PageMotion"

/** 与文章列表 fetch 的 revalidateSeconds 对齐，便于静态生成与往返缓存 */
export const revalidate = 120

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
  const url = fullLocalizedUrl(locale, "/")

  return {
    description,
    keywords,
    openGraph: {
      url,
      title,
      description,
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: url,
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
  const t = await getTranslations({ locale, namespace: "Home" })

  let articleRes: { list: ArticleItem[]; total: number } = { list: [], total: 0 }
  try {
    articleRes = await getPublishedArticleList({
      pageNum: 1,
      pageSize: 24,
      locale,
      revalidateSeconds: 120,
    })
  } catch {
    // 忽略 API 错误
  }

  const articles = articleRes.list
  const url = fullLocalizedUrl(locale, "/")
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url,
    inLanguage: locale === "zh" ? "zh-CN" : "en",
    description: t("seoDescription"),
    keywords: [
      locale === "zh" ? "AI导航" : "AI directory",
      locale === "zh" ? "科技新闻" : "Tech news",
      locale === "zh" ? "网站推荐" : "Website recommendations",
      locale === "zh" ? "精选文章" : "Curated articles",
    ],
  }

  return (
    <PageMotion className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <section className="mb-10">
        <HeroSection />
      </section>

      <section className="mb-12">
        <FeaturedBanner articles={articles} />
      </section>

      <section className="mb-12 rounded-2xl border border-app-border bg-app-card/80 p-6 sm:p-8">
        <div className="max-w-4xl">
          <h2 className="text-xl font-semibold tracking-tight text-app-text sm:text-2xl">
            {t("seoTitle")}
          </h2>
          <p className="mt-3 text-sm leading-7 text-app-text-muted sm:text-base">
            {t("seoDescription")}
          </p>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            {
              title: t("seoCard1Title"),
              desc: t("seoCard1Desc"),
              icon: "ri-robot-2-line",
            },
            {
              title: t("seoCard2Title"),
              desc: t("seoCard2Desc"),
              icon: "ri-newspaper-line",
            },
            {
              title: t("seoCard3Title"),
              desc: t("seoCard3Desc"),
              icon: "ri-global-line",
            },
          ].map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-app-border bg-app-bg/70 p-5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-app-accent/10 text-app-accent">
                <i className={`${item.icon} text-lg`} />
              </div>
              <h3 className="mt-4 text-base font-semibold text-app-text">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-app-text-muted">{item.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <LatestReleases articles={articles} total={articleRes.total} />
      </section>
    </PageMotion>
  )
}
