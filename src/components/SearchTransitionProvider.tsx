"use client"

import { createContext, useContext, useEffect, useState, useTransition } from "react"
import { useRouter } from "@/i18n/navigation"

export type SearchNavigationIntent =
  | "search"
  | "ai-search"
  | "clear"
  | "toggle-ai"
  | "filter"
  | "generic"

type SearchTransitionContextValue = {
  isSearchPending: boolean
  pendingIntent: SearchNavigationIntent | null
  navigateToNav: (
    url: string,
    options?: { replace?: boolean; intent?: SearchNavigationIntent }
  ) => void
}

const SearchTransitionContext = createContext<SearchTransitionContextValue | null>(
  null
)

export function SearchTransitionProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [pendingIntent, setPendingIntent] = useState<SearchNavigationIntent | null>(null)

  useEffect(() => {
    if (!isPending) {
      setPendingIntent(null)
    }
  }, [isPending])

  const navigateToNav = (
    url: string,
    options?: { replace?: boolean; intent?: SearchNavigationIntent }
  ) => {
    const replace = options?.replace ?? false
    const intent = options?.intent ?? "generic"
    setPendingIntent(intent)
    startTransition(() => {
      if (replace) {
        router.replace(url)
      } else {
        router.push(url)
      }
    })
  }

  return (
    <SearchTransitionContext.Provider
      value={{ isSearchPending: isPending, pendingIntent, navigateToNav }}
    >
      {children}
    </SearchTransitionContext.Provider>
  )
}

export function useSearchTransition() {
  const ctx = useContext(SearchTransitionContext)
  const router = useRouter()
  if (ctx) return ctx
  return {
    isSearchPending: false,
    pendingIntent: null,
    navigateToNav: (
      url: string,
      options?: { replace?: boolean; intent?: SearchNavigationIntent }
    ) => {
      if (options?.replace) router.replace(url)
      else router.push(url)
    },
  }
}
