const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:9901"

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
  createTime?: string
}

interface ApiResponse<T> {
  code: number
  data: T
  message?: string
}

async function request<T>(url: string, init?: RequestInit): Promise<ApiResponse<T>> {
  const base = API_BASE.replace(/\/$/, "")
  const path = url.startsWith("/") ? url : `/${url}`
  const res = await fetch(`${base}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })
  const json = await res.json()
  if (json.code !== 0 && json.code !== undefined) {
    throw new Error(json.message || json.msg || '请求失败')
  }
  return json as ApiResponse<T>
}

export async function getNavTree(): Promise<NavTreeCategory[]> {
  const res = await request<{ tree: NavTreeCategory[] }>('/nav/tree')
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

export async function getNavCategories(): Promise<NavCategoryBrief[]> {
  const res = await request<{ list: NavCategoryBrief[] }>('/nav/categories')
  const list = res.data?.list ?? []
  return list.map((c) => ({ id: c.id, name: c.name, icon: c.icon }))
}

/** 热门频道：按分类下链接总点击数排序，用于侧边栏 */
export async function getNavCategoriesHot(limit = 5): Promise<NavCategoryBrief[]> {
  const res = await request<{ list: NavCategoryBrief[] }>(`/nav/categories/hot?limit=${limit}`)
  const list = res.data?.list ?? []
  return list.map((c) => ({ id: c.id, name: c.name, icon: c.icon }))
}

/** 上报链接点击 */
export async function reportNavLinkClick(linkId: number): Promise<void> {
  try {
    await fetch(`${API_BASE.replace(/\/$/, '')}/nav/link/click`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ linkId }),
      keepalive: true,
    })
  } catch {
    // 静默失败，不影响用户跳转
  }
}

export async function getNavLinksPaginated(params?: {
  pageNum?: number
  pageSize?: number
  categoryId?: number
  keyword?: string
}): Promise<{ list: NavLinkWithCategory[]; total: number }> {
  const q = new URLSearchParams()
  if (params?.pageNum) q.set('pageNum', String(params.pageNum))
  if (params?.pageSize) q.set('pageSize', String(params.pageSize))
  if (params?.categoryId) q.set('categoryId', String(params.categoryId))
  if (params?.keyword) q.set('keyword', params.keyword)
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
}): Promise<{ list: ArticleItem[]; total: number }> {
  const q = new URLSearchParams()
  if (params?.pageNum) q.set('pageNum', String(params.pageNum))
  if (params?.pageSize) q.set('pageSize', String(params.pageSize))
  if (params?.keyword) q.set('keyword', params.keyword)
  if (params?.categoryId) q.set('categoryId', String(params.categoryId))
  const res = await request<{ list: ArticleItem[]; total: number }>(
    `/article/published/list?${q.toString()}`
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
  createTime?: string
  updateTime?: string
}

export async function getPublishedArticleDetail(params: {
  id?: number
  slug?: string
}): Promise<ArticleDetail | null> {
  const q = new URLSearchParams()
  if (params.id) q.set('id', String(params.id))
  if (params.slug) q.set('slug', params.slug)
  const res = await request<ArticleDetail>(
    `/article/published/detail?${q.toString()}`
  )
  return res.data ?? null
}
