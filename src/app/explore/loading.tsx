import { ExploreSkeleton } from "@/components/skeletons/ExploreSkeleton";

export default function ExploreLoading() {
  return (
    <main className="flex-grow flex flex-col px-6 py-10 gap-6 max-w-7xl mx-auto w-full pt-24 min-h-screen">
      <ExploreSkeleton />
    </main>
  );
}
