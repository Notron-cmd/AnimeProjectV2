import { Skeleton } from "@/components/ui/skeleton"

function AnimeCardSkeleton() {
  return (
    <div className="group relative flex flex-col gap-3">
      <Skeleton className="aspect-[2/3] w-full rounded-xl" />
      <div className="flex flex-col gap-2 px-1">
        <Skeleton className="h-4 w-3/4" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-12 rounded-full" />
          <Skeleton className="h-3 w-16 rounded-full" />
        </div>
      </div>
    </div>
  )
}

function AnimeCardGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {Array.from({ length: count }).map((_, i) => (
        <AnimeCardSkeleton key={i} />
      ))}
    </div>
  )
}

export { AnimeCardSkeleton, AnimeCardGridSkeleton }
