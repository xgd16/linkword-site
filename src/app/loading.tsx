/** 根级 loading，首页等路由加载时显示 */
export default function RootLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero 区域骨架 */}
      <section className="mb-10">
        <div className="overflow-hidden rounded-2xl border border-app-border bg-app-card p-6 sm:p-8 md:p-10 animate-pulse">
          <div className="h-8 w-48 rounded-lg bg-app-border/40" />
          <div className="mt-2 h-5 w-72 rounded bg-app-border/30" />
          <div className="mt-6 flex gap-3">
            <div className="h-10 w-28 rounded-xl bg-app-border/40" />
            <div className="h-10 w-24 rounded-xl bg-app-border/30" />
          </div>
        </div>
      </section>

      {/* 特色内容区：轮播 + 排行榜 */}
      <section className="mb-12">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="h-[260px] animate-pulse rounded-2xl border border-app-border bg-gradient-to-br from-app-gradient-from/50 to-app-gradient-to/50 lg:col-span-2 lg:h-[300px]" />
          <div className="flex h-[260px] flex-col overflow-hidden rounded-2xl border border-app-border bg-app-card p-5 animate-pulse lg:h-[300px]">
            <div className="flex gap-2">
              <div className="h-5 w-5 rounded bg-app-border/40" />
              <div className="h-5 w-32 rounded bg-app-border/40" />
            </div>
            <div className="mt-4 flex flex-1 flex-col gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-6 w-6 shrink-0 rounded bg-app-border/30" />
                  <div className="h-4 flex-1 rounded bg-app-border/30" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 最新发布 */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <div className="h-6 w-24 animate-pulse rounded bg-app-border/40" />
          <div className="h-5 w-14 animate-pulse rounded bg-app-border/30" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col overflow-hidden rounded-xl border border-app-border bg-app-card animate-pulse"
            >
              <div className="aspect-[16/10] bg-app-border/30" />
              <div className="p-4 space-y-2">
                <div className="h-4 w-3/4 rounded bg-app-border/40" />
                <div className="h-3 w-full rounded bg-app-border/30" />
                <div className="h-3 w-2/3 rounded bg-app-border/30" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
