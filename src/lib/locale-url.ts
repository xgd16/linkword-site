import { routing } from "@/i18n/routing"
import { getFullUrl } from "@/lib/site"

/** 当前语言下的站内路径（默认语言且不强制 prefix 时不加 /zh） */
export function localizedPath(locale: string, pathname: string): string {
  const p = pathname.startsWith("/") ? pathname : `/${pathname}`
  if (locale === routing.defaultLocale) {
    return p
  }
  return `/${locale}${p}`
}

export function fullLocalizedUrl(locale: string, pathname: string, siteOrigin?: string): string {
  return getFullUrl(localizedPath(locale, pathname), siteOrigin)
}
