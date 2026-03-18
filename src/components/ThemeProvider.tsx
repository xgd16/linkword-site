"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="theme-light"
      enableSystem={false}
      storageKey="linkword-theme"
      themes={["theme-light", "theme-dark", "theme-sepia", "theme-ocean", "theme-forest"]}
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemesProvider>
  )
}
