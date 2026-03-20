import { getTranslations, setRequestLocale } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import PageMotion from "@/components/PageMotion"
import SettingsContent from "./SettingsContent"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "Metadata" })
  return {
    title: t("settingsTitle"),
    description: t("settingsDescription"),
    robots: { index: false, follow: false },
  }
}

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("SettingsPage")
  const tCommon = await getTranslations({ locale, namespace: "Common" })

  return (
    <PageMotion className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="mb-6 inline-block text-sm text-app-text-muted transition hover:text-app-text"
      >
        {tCommon("backHome")}
      </Link>
      <h1 className="mb-8 text-2xl font-semibold text-app-text">{t("title")}</h1>
      <SettingsContent />
    </PageMotion>
  )
}
