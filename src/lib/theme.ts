export const THEMES = [
  { id: "theme-light", name: "浅色", icon: "ri-sun-line" },
  { id: "theme-dark", name: "深色", icon: "ri-moon-line" },
  { id: "theme-sepia", name: "护眼", icon: "ri-book-open-line" },
  { id: "theme-ocean", name: "海洋", icon: "ri-sailboat-line" },
  { id: "theme-forest", name: "森林", icon: "ri-plant-line" },
] as const

export type ThemeId = (typeof THEMES)[number]["id"]
