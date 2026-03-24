import { Geist, Geist_Mono } from "next/font/google"

/** 构建时内联打包，运行时走本站静态资源，避免大陆用户访问 Google Fonts CDN */
export const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
})

export const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
})
