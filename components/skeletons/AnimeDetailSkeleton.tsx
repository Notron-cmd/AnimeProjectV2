import { Skeleton } from "@/components/ui/skeleton"

function AnimeDetailSkeleton() {
  return (
    <div className="relative">
      <Skeleton className="h-[300px] w-full md:h-[420px]" />
      <div className="relative mx-auto -mt-32 max-w-7xl px-4 md:-mt-40">
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="flex-shrink-0 md:w-[250px]">
            <Skeleton className="aspect-[2/3] w-full rounded-2xl shadow-xl" />
            <div className="mt-4 flex flex-col gap-2">
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          </div>
          <div className="flex-1 space-y-4 pt-4 md:pt-16">
            <Skeleton className="h-8 w-3/4" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <div className="space-y-2 pt-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 md:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-20 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { AnimeDetailSkeleton }
