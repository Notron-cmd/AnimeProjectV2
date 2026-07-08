import { AnimeDetailSkeleton } from "@/components/skeletons/AnimeDetailSkeleton";

export default function AnimeDetailLoading() {
  return (
    <main className="bg-[#121317] min-h-screen pt-16">
      <AnimeDetailSkeleton />
    </main>
  );
}
