import createMiddleware from "next-intl/middleware"
import { routing } from "./i18n/routing"

/** Next.js 16+ 使用 proxy 约定（原 middleware），行为与 i18n 路由一致 */
export const proxy = createMiddleware(routing)

export const config = {
  // proxy-api 为 Next rewrites 同源转发后端，勿经 locale 中间件
  matcher: ["/((?!api|proxy-api|_next|_vercel|.*\\..*).*)"],
}
