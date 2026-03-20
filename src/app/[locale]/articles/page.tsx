import { getTranslations, setRequestLocale } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { getPublishedArticleList } from "@/lib/api"
import ArticlesGrid from "./ArticlesGrid"
import PageMotion from "@/components/PageMotion"
import { fullLocalizedUrl } from "@/lib/locale-url"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "Metadata" })
  const title = t("articlesTitle")
  const description = t("articlesDescription")
  return {
    title,
    description,
    openGraph: {
      url: fullLocalizedUrl(locale, "/articles"),
      title: t("articlesOgTitle"),
      description,
    },
  }
}

interface PageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ page?: string; keyword?: string; categoryId?: string }>
}

export default async function ArticlesPage({ params, searchParams }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("ArticlesPage")
  const tMeta = await getTranslations({ locale, namespace: "Metadata" })
  const tCommon = await getTranslations({ locale, namespace: "Common" })

  const sp = await searchParams
  const page = Math.max(1, parseInt(sp.page ?? "1", 10))
  const pageSize = 12

  let res: Awaited<ReturnType<typeof getPublishedArticleList>>
  try {
    res = await getPublishedArticleList({
      pageNum: page,
      pageSize,
      keyword: sp.keyword || undefined,
      categoryId: sp.categoryId ? parseInt(sp.categoryId, 10) : undefined,
      locale,
    })
  } catch {
    res = { list: [], total: 0 }
  }

  const { list, total } = res
  const totalPages = Math.ceil(total / pageSize)

  return (
    <PageMotion className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-app-text">{tMeta("articlesTitle")}</h1>
        <Link href="/" className="text-sm text-app-text-muted transition hover:text-app-text">
          {tCommon("backHome")}
        </Link>
      </div>

      <ArticlesGrid list={list} />

      {list.length === 0 && (
        <div className="rounded-xl border border-dashed border-app-border py-16 text-center text-app-text-muted">
          {t("empty")}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {page > 1 && (
            <Link
              href={`/articles?page=${page - 1}`}
              prefetch={false}
              className="rounded-lg border border-app-border px-4 py-2 text-sm text-app-text-muted transition hover:bg-app-card-hover hover:text-app-text"
            >
              {t("prev")}
            </Link>
          )}
          <span className="px-4 py-2 text-sm text-app-text-muted">
            {page} / {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={`/articles?page=${page + 1}`}
              prefetch={false}
              className="rounded-lg border border-app-border px-4 py-2 text-sm text-app-text-muted transition hover:bg-app-card-hover hover:text-app-text"
            >
              {t("next")}
            </Link>
          )}
        </div>
      )}
    </PageMotion>
  )
}
