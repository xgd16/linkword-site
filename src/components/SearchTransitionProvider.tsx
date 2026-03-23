"use client"

import { createContext, useContext, useTransition } from "react"
import { useRouter } from "@/i18n/navigation"

type SearchTransitionContextValue = {
  isSearchPending: boolean
  navigateToNav: (url: string, replace?: boolean) => void
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

  const navigateToNav = (url: string, replace = false) => {
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
      value={{ isSearchPending: isPending, navigateToNav }}
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
    navigateToNav: (url: string, replace = false) => {
      if (replace) router.replace(url)
      else router.push(url)
    },
  }
}
