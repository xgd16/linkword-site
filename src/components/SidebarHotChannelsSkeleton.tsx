export default function SidebarHotChannelsSkeleton() {
  return (
    <>
      <div className="my-4 border-t border-app-border" />
      <div className="space-y-1 px-2">
        <div className="px-3 py-1">
          <div className="h-3 w-16 animate-pulse rounded bg-app-border/40" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 rounded-lg px-3 py-2.5">
            <div className="h-4 w-4 shrink-0 animate-pulse rounded bg-app-border/40" />
            <div className="h-4 w-20 animate-pulse rounded bg-app-border/30" />
          </div>
        ))}
      </div>
    </>
  )
}
