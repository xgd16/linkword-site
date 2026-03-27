import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts")

// SSR/rewrites 时优先使用 API_BASE_SERVER，未配置则用 NEXT_PUBLIC_API_BASE
const apiBase =
  process.env.API_BASE_SERVER ||
  process.env.NEXT_PUBLIC_API_BASE ||
  "http://localhost:9901"

const nextConfig: NextConfig = {
  experimental: {
    // 降低 webpack 构建峰值内存，占用会更稳，但构建可能更慢。
    webpackMemoryOptimizations: true,
    serverSourceMaps: false,
    // 站点静态页数量很少，降低静态生成并发，避免小内存机器在 build 时开过多 worker。
    staticGenerationMaxConcurrency: 1,
    staticGenerationMinPagesPerWorker: 50,
    staticGenerationRetryCount: 1,
  },
  productionBrowserSourceMaps: false,
  // 限制 webpack 并行编译线程数，防止低内存机器在 build 时因多进程 OOM
  webpack(config) {
    config.parallelism = 1
    return config
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.linkwordx.xyz", pathname: "/**", port: "" },
      { protocol: "http", hostname: "**.linkwordx.xyz", pathname: "/**", port: "" },
      { protocol: "https", hostname: "www.google.com", pathname: "/**", port: "" },
      { protocol: "http", hostname: "localhost", pathname: "/**", port: "" },
      { protocol: "http", hostname: "127.0.0.1", pathname: "/**", port: "" },
    ],
  },
  // sitemap.xml 由 Go 后端直读数据库生成
  // /proxy-api 同源转发到后端，避免浏览器跨域（如 www.* 站点请求 api.* 域名）
  async rewrites() {
    const base = apiBase.replace(/\/$/, "")
    return [
      { source: "/sitemap.xml", destination: `${base}/sitemap.xml` },
      { source: "/proxy-api/:path*", destination: `${base}/:path*` },
    ]
  },
}

export default withNextIntl(nextConfig)
