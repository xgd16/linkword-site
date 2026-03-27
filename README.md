# LinkWord 前台站点

基于 Next.js 的网站导航与文章前台，深色主题布局，对接 Go 后端 API。

## 技术栈

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器（需先启动 Go API 服务）
npm run dev
```

确保 Go API 已运行在 `http://localhost:9901`。

## 环境变量

| 变量 | 说明 | 默认 |
|-----|------|------|
| `NEXT_PUBLIC_API_BASE` | Go API 基地址（浏览器与 SSR 共用） | `http://localhost:9901` |

生产构建在 `.env.production` 中配置 `NEXT_PUBLIC_API_BASE` 即可。站点 SEO 用绝对地址由代码内 `SITE_URL` 默认值提供，如需覆盖可在本地 `.env.local` 中设置 `NEXT_PUBLIC_SITE_URL`（一般不必）。

## 目录结构

```
src/
├── app/              # App Router 页面
│   ├── page.tsx      # 首页
│   ├── nav/          # 导航页
│   ├── articles/     # 文章列表、详情
│   └── layout.tsx    # 根布局（侧边栏 + Header）
├── components/       # 公共组件
│   ├── Sidebar.tsx   # 左侧导航
│   ├── Header.tsx    # 顶部栏
│   ├── FeaturedBanner.tsx
│   └── LatestReleases.tsx
└── lib/
    └── api.ts        # API 请求
```

## API 对接

- `/nav/tree` - 导航树（公开）
- `/article/published/list` - 已发布文章列表（公开）
- `/article/published/detail` - 文章详情（公开）

后端需启用 CORS 以支持跨域请求。
