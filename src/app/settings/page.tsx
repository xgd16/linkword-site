import Link from "next/link"
import PageMotion from "@/components/PageMotion"
import SettingsContent from "./SettingsContent"

export const metadata = {
  title: "设置",
  description: "个人偏好设置",
  robots: { index: false, follow: false },
}

export default function SettingsPage() {
  return (
    <PageMotion className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="mb-6 inline-block text-sm text-app-text-muted transition hover:text-app-text"
      >
        ← 返回首页
      </Link>
      <h1 className="mb-8 text-2xl font-semibold text-app-text">设置</h1>
      <SettingsContent />
    </PageMotion>
  )
}
