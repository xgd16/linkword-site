"use client"

import { useTranslations } from "next-intl"

export default function NavLoadingFallback() {
  const t = useTranslations("NavPage")
  return (
    <div className="py-12 text-center text-app-text-muted">{t("loading")}</div>
  )
}
