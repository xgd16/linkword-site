import Link from "next/link"
import { getPublishedArticleList } from "@/lib/api"
import ArticlesGrid from "./ArticlesGrid"
import PageMotion from "@/components/PageMotion"

export const metadata = {
  title: "文章列表 - LinkWord",
  description: "最新文章与资讯",
}

interface PageProps {
  searchParams: Promise<{ page?: string; keyword?: string; categoryId?: string }>
}

export default async function ArticlesPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Math.max(1, parseInt(params.page ?? "1", 10))
  const pageSize = 12

  let res: Awaited<ReturnType<typeof getPublishedArticleList>>
  try {
    res = await getPublishedArticleList({
      pageNum: page,
      pageSize,
      keyword: params.keyword || undefined,
      categoryId: params.categoryId ? parseInt(params.categoryId, 10) : undefined,
    })
  } catch {
    res = { list: [], total: 0 }
  }

  const { list, total } = res
  const totalPages = Math.ceil(total / pageSize)

  return (
    <PageMotion className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-app-text">文章列表</h1>
        <Link href="/" className="text-sm text-app-text-muted transition hover:text-app-text">
          返回首页
        </Link>
      </div>

      <ArticlesGrid list={list} />

      {list.length === 0 && (
        <div className="rounded-xl border border-dashed border-app-border py-16 text-center text-app-text-muted">
          暂无文章
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {page > 1 && (
            <Link
              href={`/articles?page=${page - 1}`}
              className="rounded-lg border border-app-border px-4 py-2 text-sm text-app-text-muted transition hover:bg-app-card-hover hover:text-app-text"
            >
              上一页
            </Link>
          )}
          <span className="px-4 py-2 text-sm text-app-text-muted">
            {page} / {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={`/articles?page=${page + 1}`}
              className="rounded-lg border border-app-border px-4 py-2 text-sm text-app-text-muted transition hover:bg-app-card-hover hover:text-app-text"
            >
              下一页
            </Link>
          )}
        </div>
      )}
    </PageMotion>
  )
}
