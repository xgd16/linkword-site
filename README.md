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
| `NEXT_PUBLIC_API_BASE` | Go API 基地址 | `http://localhost:9901` |

生产环境请根据实际部署填写（如 `https://api.example.com`）。

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
