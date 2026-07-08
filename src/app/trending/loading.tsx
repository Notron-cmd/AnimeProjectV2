import { TrendingSkeleton } from "@/components/skeletons/TrendingSkeleton";

export default function TrendingLoading() {
  return (
    <main className="bg-[#0A0C0F] min-h-screen pt-24 px-8 sm:px-12 md:px-16">
      <TrendingSkeleton />
    </main>
  );
}
