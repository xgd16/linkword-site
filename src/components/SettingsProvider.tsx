"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react"
import {
  getStoredNavClickMode,
  setStoredNavClickMode,
  type NavClickMode,
} from "@/lib/settings"

interface SettingsContextValue {
  navClickMode: NavClickMode
  setNavClickMode: (mode: NavClickMode) => void
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

export function useNavClickMode() {
  const ctx = useContext(SettingsContext)
  if (!ctx) {
    return {
      navClickMode: "detail" as NavClickMode,
      setNavClickMode: () => {},
    }
  }
  return ctx
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [navClickMode, setNavClickModeState] = useState<NavClickMode>("detail")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    queueMicrotask(() => {
      setNavClickModeState(getStoredNavClickMode())
      setMounted(true)
    })
  }, [])

  const setNavClickMode = useCallback((mode: NavClickMode) => {
    setStoredNavClickMode(mode)
    setNavClickModeState(mode)
  }, [])

  return (
    <SettingsContext.Provider
      value={{
        navClickMode: mounted ? navClickMode : "detail",
        setNavClickMode,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}
