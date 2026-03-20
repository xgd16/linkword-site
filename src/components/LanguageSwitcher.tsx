"use client"

import { useLocale, useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"
import { usePathname, useRouter } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"

export default function LanguageSwitcher() {
  const locale = useLocale()
  const t = useTranslations("LanguageSwitcher")
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  const hrefWithQuery = () => {
    const qs = searchParams.toString()
    return qs ? `${pathname}?${qs}` : pathname
  }

  return (
    <div
      className="flex items-center rounded-lg border border-app-border bg-app-card/80 p-0.5 text-xs"
      role="group"
      aria-label={t("aria")}
    >
      {routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => router.replace(hrefWithQuery(), { locale: loc })}
          className={`rounded-md px-2 py-1.5 font-medium transition ${
            locale === loc
              ? "bg-app-accent-muted text-app-accent"
              : "text-app-text-muted hover:text-app-text"
          }`}
          aria-pressed={locale === loc}
          aria-label={t(loc as "zh" | "en")}
        >
          {loc === "zh" ? "中" : "EN"}
        </button>
      ))}
    </div>
  )
}
