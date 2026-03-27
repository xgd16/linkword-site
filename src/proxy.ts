import { NextRequest, NextResponse } from "next/server"
import createMiddleware from "next-intl/middleware"
import { routing } from "./i18n/routing"
import { deriveApiBaseUrlFromHost, getFallbackApiBaseUrl } from "./lib/api-url"

const intlMiddleware = createMiddleware(routing)

/**
 * /proxy-api 按当前访问域名转发到对应后端（如 linkwordx.site → api.linkwordx.site），
 * 不再使用 next.config 里写死的单一 destination。
 */
export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  if (pathname === "/proxy-api" || pathname.startsWith("/proxy-api/")) {
    const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || ""
    const apiBase = deriveApiBaseUrlFromHost(host) || getFallbackApiBaseUrl()
    const rest = pathname === "/proxy-api" ? "/" : pathname.slice("/proxy-api".length) || "/"
    const target = new URL(rest + request.nextUrl.search, apiBase.replace(/\/$/, "") + "/")
    return NextResponse.rewrite(target)
  }
  return intlMiddleware(request)
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
}
