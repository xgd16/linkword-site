import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { getNavCategoriesHot } from "@/lib/api"
import type { Locale } from "@/i18n/routing"

/** 热门频道（服务端异步），供 layout 用 Suspense 包裹 */
export default async function SidebarHotChannels({ locale }: { locale: Locale }) {
  const t = await getTranslations("SidebarHot")
  const list = await getNavCategoriesHot(5, locale, { revalidateSeconds: 120 })
  if (list.length === 0) return null
  return (
    <>
      <div className="my-4 border-t border-app-border" />
      <div className="space-y-1 px-2">
        <p className="px-3 py-1 text-xs font-medium uppercase tracking-wider text-app-text-muted">
          {t("title")}
        </p>
        {list.map((cat) => (
          <Link
            key={cat.id}
            href={`/nav?cat=${cat.id}`}
            prefetch={false}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-app-text-muted transition-colors hover:bg-app-card-hover hover:text-app-text"
          >
            <i
              className={`text-lg ${
                cat.icon?.startsWith("ri-") ? cat.icon : "ri-folder-line"
              }`}
            />
            {cat.name}
          </Link>
        ))}
      </div>
    </>
  )
}
