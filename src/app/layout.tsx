import type { ReactNode } from "react"

type Props = {
  children: ReactNode
}

/** 根布局：实际 html/body 在 [locale]/layout，此处仅透传（next-intl 约定） */
export default function RootLayout({ children }: Props) {
  return children
}
