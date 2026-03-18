import { Suspense } from "react"
import { getNavCategories, getNavLinksPaginated } from "@/lib/api"
import NavContent from "./NavContent"
import Link from "next/link"
import PageMotion from "@/components/PageMotion"

export const metadata = {
  title: "网站导航 - LinkWord",
  description: "精选网站与工具导航",
}

interface PageProps {
  searchParams: Promise<{ keyword?: string; cat?: string }>
}

export default async function NavPage({ searchParams }: PageProps) {
  const params = await searchParams
  const keyword = params.keyword ?? ""
  const categoryId = params.cat ?? ""
  const pageSize = 24

  let categories: Awaited<ReturnType<typeof getNavCategories>> = []
  let linksRes: Awaited<ReturnType<typeof getNavLinksPaginated>> = { list: [], total: 0 }
  try {
    const [catRes, linksResData] = await Promise.all([
      getNavCategories(),
      getNavLinksPaginated({
        pageNum: 1,
        pageSize,
        categoryId: categoryId && categoryId !== "all" ? parseInt(categoryId, 10) : undefined,
        keyword: keyword || undefined,
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
        <h1 className="text-xl font-semibold text-app-text">网站导航</h1>
        <Link
          href="/"
          className="text-sm text-app-text-muted transition hover:text-app-text"
        >
          返回首页
        </Link>
      </div>

      <Suspense fallback={<div className="py-12 text-center text-app-text-muted">加载中...</div>}>
        <NavContent
          initialLinks={list}
          categories={categories}
          total={total}
          pageSize={pageSize}
          keyword={keyword}
          categoryId={categoryId}
        />
      </Suspense>
    </PageMotion>
  )
}
