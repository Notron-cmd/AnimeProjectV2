import { TrendingSkeleton } from "@/components/skeletons/TrendingSkeleton";

export default function HomeLoading() {
  return (
    <main className="bg-[#121317] min-h-screen pb-16">
      <div className="w-full h-[600px] bg-[#121317] animate-pulse" />
      <div className="w-full px-6 sm:px-12 md:px-16 py-10 max-w-[1600px] mx-auto">
        <TrendingSkeleton />
      </div>
    </main>
  );
}
