import { notFound } from "next/navigation"
import { getPublishedArticleDetail } from "@/lib/api"
import ArticleDetailClient from "./ArticleDetail"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const article = await getPublishedArticleDetail({ id: parseInt(id, 10) })
  return {
    title: article?.title
      ? `${article.title} - LinkWord`
      : "文章详情 - LinkWord",
    description: article?.summary,
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

  return <ArticleDetailClient article={article} />
}
