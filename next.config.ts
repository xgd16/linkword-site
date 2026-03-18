import type { NextConfig } from "next";

const apiBase = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:9901";

const nextConfig: NextConfig = {
  // sitemap.xml 由 Go 后端直读数据库生成
  async rewrites() {
    return [{ source: "/sitemap.xml", destination: `${apiBase.replace(/\/$/, "")}/sitemap.xml` }];
  },
};

export default nextConfig;
