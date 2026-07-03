import { Skeleton } from "@/components/ui/skeleton"
import { AnimeCardGridSkeleton } from "@/components/skeletons/AnimeCardSkeleton"

function ExploreSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Skeleton className="h-10 w-full max-w-md rounded-lg" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24 rounded-lg" />
          <Skeleton className="h-9 w-32 rounded-lg" />
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-full" />
        ))}
      </div>
      <AnimeCardGridSkeleton count={12} />
    </div>
  )
}

export { ExploreSkeleton }
