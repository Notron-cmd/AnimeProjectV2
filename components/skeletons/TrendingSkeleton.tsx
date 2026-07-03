import { Skeleton } from "@/components/ui/skeleton"
import { AnimeCardGridSkeleton } from "@/components/skeletons/AnimeCardSkeleton"

function TrendingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-24 rounded-lg" />
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
      </div>
      <Skeleton className="h-[350px] w-full rounded-2xl md:h-[420px]" />
      <AnimeCardGridSkeleton count={8} />
    </div>
  )
}

function RankingSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-8 w-40" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-2xl" />
        ))}
      </div>
      <div className="space-y-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    </div>
  )
}

export { TrendingSkeleton, RankingSkeleton }
