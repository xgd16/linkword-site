import localFont from "next/font/local"

/**
 * 使用 node_modules 内嵌 woff2，构建不访问 fonts.gstatic.com（适合大陆服务器离线/受限网络）。
 * path 必须为字面量（Next font loader 限制）。
 */
export const fontSans = localFont({
  src: [
    {
      path: "../../node_modules/@fontsource/geist-sans/files/geist-sans-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../node_modules/@fontsource/geist-sans/files/geist-sans-latin-500-normal.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../node_modules/@fontsource/geist-sans/files/geist-sans-latin-600-normal.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../node_modules/@fontsource/geist-sans/files/geist-sans-latin-700-normal.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-geist-sans",
  display: "swap",
})

export const fontMono = localFont({
  src: [
    {
      path: "../../node_modules/@fontsource/geist-mono/files/geist-mono-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../node_modules/@fontsource/geist-mono/files/geist-mono-latin-500-normal.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../node_modules/@fontsource/geist-mono/files/geist-mono-latin-600-normal.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../node_modules/@fontsource/geist-mono/files/geist-mono-latin-700-normal.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-geist-mono",
  display: "swap",
})
