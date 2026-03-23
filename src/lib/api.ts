import { normalizeSearchKeyword } from "@/lib/searchKeyword"

const DEFAULT_API = "http://localhost:9901"

/** 客户端请求使用公开 API 地址；服务端渲染（SSR）使用 API_BASE_SERVER（若配置） */
function getApiBase(): string {
  if (typeof window === "undefined" && process.env.API_BASE_SERVER) {
    return process.env.API_BASE_SERVER.replace(/\/$/, "")
  }
  return (process.env.NEXT_PUBLIC_API_BASE || DEFAULT_API).replace(/\/$/, "")
}

/** 与后端约定：zh | en */
export function apiLocale(locale?: string): "zh" | "en" {
  return locale === "en" ? "en" : "zh"
}

export interface NavTreeLink {
  id: number
  title: string
  url: string
  icon: string
  cover: string
  slogan: string
  description: string
}

export interface NavTreeCategory {
  id: number
  name: string
  icon: string
  links: NavTreeLink[]
}

export interface ArticleItem {
  id: number
  title: string
  summary: string
  cover: string
  categoryId: number
  status: number
  slug: string
  viewCount?: number
  createTime?: string
}

interface ApiResponse<T> {
  code: number
  data: T
  message?: string
}

async function request<T>(url: string, init?: RequestInit): Promise<ApiResponse<T>> {
  const base = getApiBase()
  const path = url.startsWith("/") ? url : `/${url}`
  // 服务端默认不缓存，避免与 locale 相关的接口在 SSG/导航后被 Next 数据缓存串单
  const res = await fetch(`${base}${path}`, {
    ...(typeof window === "undefined" && init?.cache === undefined ? { cache: "no-store" as const } : {}),
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  })
  const json = await res.json()
  if (json.code !== 0 && json.code !== undefined) {
    throw new Error(json.message || json.msg || "请求失败")
  }
  return json as ApiResponse<T>
}

export async function getNavTree(locale?: string): Promise<NavTreeCategory[]> {
  const loc = apiLocale(locale)
  const res = await request<{ tree: NavTreeCategory[] }>(`/nav/tree?locale=${loc}`)
  return res.data?.tree ?? []
}

export interface NavCategoryBrief {
  id: number
  name: string
  icon: string
}

export interface NavLinkWithCategory {
  id: number
  categoryId: number
  categoryName: string
  title: string
  url: string
  icon: string
  cover: string
  slogan: string
  description: string
}

export async function getNavCategories(locale?: string): Promise<NavCategoryBrief[]> {
  const loc = apiLocale(locale)
  const res = await request<{ list: NavCategoryBrief[] }>(`/nav/categories?locale=${loc}`)
  const list = res.data?.list ?? []
  return list.map((c) => ({ id: c.id, name: c.name, icon: c.icon }))
}

/** 热门频道：按分类下链接总点击数排序，用于侧边栏 */
export async function getNavCategoriesHot(limit = 5, locale?: string): Promise<NavCategoryBrief[]> {
  const loc = apiLocale(locale)
  const res = await request<{ list: NavCategoryBrief[] }>(
    `/nav/categories/hot?limit=${limit}&locale=${loc}`
  )
  const list = res.data?.list ?? []
  return list.map((c) => ({ id: c.id, name: c.name, icon: c.icon }))
}

/** 上报站点页面访问（浏览器 → 源站 API，适用于 CDN 托管的静态资源） */
export async function reportSiteVisit(params: {
  visitorId: string
  path: string
  locale: string
}): Promise<void> {
  try {
    await fetch(`${(process.env.NEXT_PUBLIC_API_BASE || DEFAULT_API).replace(/\/$/, "")}/site/visit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        visitorId: params.visitorId,
        path: params.path,
        locale: params.locale === "en" ? "en" : "zh",
      }),
      keepalive: true,
    })
  } catch {
    // 静默失败
  }
}

/** 上报链接点击 */
export async function reportNavLinkClick(linkId: number): Promise<void> {
  try {
    await fetch(`${(process.env.NEXT_PUBLIC_API_BASE || DEFAULT_API).replace(/\/$/, "")}/nav/link/click`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ linkId }),
      keepalive: true,
    })
  } catch {
    // 静默失败，不影响用户跳转
  }
}

/** 获取链接详情（公开） */
export async function getNavLinkDetail(id: number, locale?: string): Promise<NavLinkWithCategory | null> {
  const loc = apiLocale(locale)
  const res = await request<{ item: NavLinkWithCategory | null }>(
    `/nav/link/detail?id=${id}&locale=${loc}`
  )
  return res.data?.item ?? null
}

export async function getNavLinksPaginated(params?: {
  pageNum?: number
  pageSize?: number
  categoryId?: number
  keyword?: string
  locale?: string
}): Promise<{ list: NavLinkWithCategory[]; total: number }> {
  const loc = apiLocale(params?.locale)
  const q = new URLSearchParams()
  q.set("locale", loc)
  if (params?.pageNum) q.set("pageNum", String(params.pageNum))
  if (params?.pageSize) q.set("pageSize", String(params.pageSize))
  if (params?.categoryId) q.set("categoryId", String(params.categoryId))
  if (params?.keyword) q.set("keyword", normalizeSearchKeyword(params.keyword))
  const res = await request<{ list: NavLinkWithCategory[]; total: number }>(
    `/nav/links?${q.toString()}`
  )
  return { list: res.data?.list ?? [], total: res.data?.total ?? 0 }
}

export async function getPublishedArticleList(params?: {
  pageNum?: number
  pageSize?: number
  keyword?: string
  categoryId?: number
  locale?: string
}): Promise<{ list: ArticleItem[]; total: number }> {
  const loc = apiLocale(params?.locale)
  const q = new URLSearchParams()
  q.set("locale", loc)
  if (params?.pageNum) q.set("pageNum", String(params.pageNum))
  if (params?.pageSize) q.set("pageSize", String(params.pageSize))
  if (params?.keyword) q.set("keyword", normalizeSearchKeyword(params.keyword))
  if (params?.categoryId) q.set("categoryId", String(params.categoryId))
  const res = await request<{ list: ArticleItem[]; total: number }>(
    `/article/published/list?${q.toString()}`,
    { cache: "no-store" }
  )
  return { list: res.data?.list ?? [], total: res.data?.total ?? 0 }
}

export interface ArticleDetail {
  id: number
  title: string
  content: string
  summary: string
  cover: string
  categoryId: number
  slug: string
  tagNames: string[]
  viewCount?: number
  createTime?: string
  updateTime?: string
}

/** 上报文章阅读 */
export async function reportArticleView(articleId: number): Promise<void> {
  try {
    await fetch(`${(process.env.NEXT_PUBLIC_API_BASE || DEFAULT_API).replace(/\/$/, "")}/article/view`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ articleId }),
      keepalive: true,
    })
  } catch {
    // 静默失败，不影响阅读
  }
}

/** 轮播图列表（公开） */
export async function getBannerList(): Promise<BannerItem[]> {
  const res = await request<{ list: BannerItem[] }>("/banner/list/public")
  return res.data?.list ?? []
}

export interface BannerItem {
  id: number
  title: string
  image: string
  url: string
  sort: number
}

/** 导航点击排行榜 */
export async function getNavLinkClickRank(limit = 10, locale?: string): Promise<NavLinkClickRankItem[]> {
  const loc = apiLocale(locale)
  const res = await request<{ list: NavLinkClickRankItem[] }>(
    `/nav/links/click-rank?limit=${limit}&locale=${loc}`
  )
  return res.data?.list ?? []
}

export interface NavLinkClickRankItem {
  id: number
  categoryId: number
  categoryName: string
  title: string
  url: string
  icon: string
  clickCount: number
}

export async function getPublishedArticleDetail(params: {
  id?: number
  slug?: string
  locale?: string
}): Promise<ArticleDetail | null> {
  const loc = apiLocale(params.locale)
  const q = new URLSearchParams()
  q.set("locale", loc)
  if (params.id) q.set("id", String(params.id))
  if (params.slug) q.set("slug", params.slug)
  const res = await request<ArticleDetail>(`/article/published/detail?${q.toString()}`)
  return res.data ?? null
}
