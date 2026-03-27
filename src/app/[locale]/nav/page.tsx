import { Suspense } from "react"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { getNavCategories, getNavLinksPaginated } from "@/lib/api"
import NavContent from "./NavContent"
import NavLoadingFallback from "./NavLoadingFallback"
import PageMotion from "@/components/PageMotion"
import { fullLocalizedUrl } from "@/lib/locale-url"
import { SITE_URL } from "@/lib/site"
import { siteOriginFromHeaders } from "@/lib/api-url"
import { headers } from "next/headers"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "Metadata" })
  const title = t("navTitle")
  const description = t("navDescription")
  const h = await headers()
  const siteOrigin = siteOriginFromHeaders(h) ?? SITE_URL
  return {
    title,
    description,
    openGraph: {
      url: fullLocalizedUrl(locale, "/nav", siteOrigin),
      title: t("navOgTitle"),
      description,
    },
  }
}

interface PageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ keyword?: string; cat?: string; ai?: string }>
}

export default async function NavPage({ params, searchParams }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  const tMeta = await getTranslations({ locale, namespace: "Metadata" })
  const tCommon = await getTranslations({ locale, namespace: "Common" })

  const sp = await searchParams
  const keyword = sp.keyword ?? ""
  const categoryId = sp.cat ?? ""
  const ai = sp.ai === "1"
  const pageSize = 24

  let categories: Awaited<ReturnType<typeof getNavCategories>> = []
  let linksRes: Awaited<ReturnType<typeof getNavLinksPaginated>> = { list: [], total: 0 }
  try {
    const [catRes, linksResData] = await Promise.all([
      getNavCategories(locale),
      getNavLinksPaginated({
        pageNum: 1,
        pageSize,
        categoryId: categoryId && categoryId !== "all" ? parseInt(categoryId, 10) : undefined,
        keyword: keyword || undefined,
        ai,
        locale,
      }),
    ])
    categories = catRes
    linksRes = linksResData
  } catch {
    // 忽略
  }

  const { list, total } = linksRes

  return (
    <PageMotion className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-app-text">{tMeta("navTitle")}</h1>
        <Link href="/" className="text-sm text-app-text-muted transition hover:text-app-text">
          {tCommon("backHome")}
        </Link>
      </div>

      <Suspense fallback={<NavLoadingFallback />}>
        <NavContent
          initialLinks={list}
          categories={categories}
          total={total}
          pageSize={pageSize}
          keyword={keyword}
          categoryId={categoryId}
          ai={ai}
        />
      </Suspense>
    </PageMotion>
  )
}
