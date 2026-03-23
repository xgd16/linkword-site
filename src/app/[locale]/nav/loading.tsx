import NavLinkCardSkeleton from "@/components/NavLinkCardSkeleton"

export default function NavLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="h-7 w-32 animate-pulse rounded-lg bg-app-border/40" />
        <div className="h-5 w-16 animate-pulse rounded bg-app-border/30" />
      </div>
      <div className="mb-8 flex flex-wrap gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-9 w-16 animate-pulse rounded-lg bg-app-border/30" />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <NavLinkCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
