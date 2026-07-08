import { AnimeCardGridSkeleton } from "@/components/skeletons/AnimeCardSkeleton";

export default function ScheduleLoading() {
  return (
    <main className="bg-[#0A0C0F] min-h-screen pt-24 px-8 sm:px-12 md:px-16">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="h-8 w-48 bg-zinc-800/50 animate-pulse rounded" />
        <AnimeCardGridSkeleton count={12} />
      </div>
    </main>
  );
}
