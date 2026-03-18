/** 导航卡片点击行为：详情页 | 直接跳转 */
export type NavClickMode = "detail" | "direct"

export const NAV_CLICK_STORAGE_KEY = "linkword_nav_click_mode"

export const NAV_CLICK_DEFAULT: NavClickMode = "detail"

export function getStoredNavClickMode(): NavClickMode {
  if (typeof window === "undefined") return NAV_CLICK_DEFAULT
  const v = localStorage.getItem(NAV_CLICK_STORAGE_KEY)
  if (v === "detail" || v === "direct") return v
  return NAV_CLICK_DEFAULT
}

export function setStoredNavClickMode(mode: NavClickMode): void {
  if (typeof window === "undefined") return
  localStorage.setItem(NAV_CLICK_STORAGE_KEY, mode)
}
