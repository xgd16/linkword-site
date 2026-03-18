export const THEMES = [
  {
    id: "theme-light",
    name: "浅色",
    icon: "ri-sun-line",
    colors: ["#f8faf8", "#ffffff", "#059669", "#0891b2", "#ecfdf5", "#f0fdfa"],
  },
  {
    id: "theme-dark",
    name: "深色",
    icon: "ri-moon-line",
    colors: ["#0f1419", "#1a1f26", "#10b981", "#06b6d4", "#1e293b", "#0f172a"],
  },
  {
    id: "theme-sepia",
    name: "护眼",
    icon: "ri-book-open-line",
    colors: ["#faf6f0", "#fdf8f2", "#c2410c", "#b45309", "#fff7ed", "#fffbeb"],
  },
  {
    id: "theme-ocean",
    name: "海洋",
    icon: "ri-sailboat-line",
    colors: ["#0c1222", "#151d2e", "#38bdf8", "#22d3ee", "#0c4a6e", "#155e75"],
  },
  {
    id: "theme-forest",
    name: "森林",
    icon: "ri-plant-line",
    colors: ["#0a120e", "#0f1a12", "#22c55e", "#4ade80", "#052e16", "#064e3b"],
  },
] as const

export type ThemeId = (typeof THEMES)[number]["id"]
