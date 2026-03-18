import type { NextConfig } from "next";

// SSR/rewrites 时优先使用 API_BASE_SERVER，未配置则用 NEXT_PUBLIC_API_BASE
const apiBase =
  process.env.API_BASE_SERVER ||
  process.env.NEXT_PUBLIC_API_BASE ||
  "http://localhost:9901";

const nextConfig: NextConfig = {
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
  async rewrites() {
    return [{ source: "/sitemap.xml", destination: `${apiBase.replace(/\/$/, "")}/sitemap.xml` }];
  },
};

export default nextConfig;
