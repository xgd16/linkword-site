import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 可选：同域部署时用 rewrites 代理 /api -> 后端，避免 CORS
  // async rewrites() {
  //   return [{ source: "/api/:path*", destination: "http://localhost:9901/:path*" }];
  // },
};

export default nextConfig;
