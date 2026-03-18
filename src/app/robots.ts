import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/site"

export default function robots(): MetadataRoute.Robots {
  const base = SITE_URL.replace(/\/$/, "")
  return {
    rules: [
      {
        userAgent: ["Googlebot", "Googlebot-Image", "Google-Extended"],
        allow: "/",
      },
      {
        userAgent: "*",
        allow: ["/", "/sitemap.xml"],
        disallow: ["/settings"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  }
}
