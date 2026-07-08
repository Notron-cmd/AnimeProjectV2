import { Skeleton } from "@/components/ui/skeleton";

export default function NotificationsLoading() {
  return (
    <main className="bg-[#121317] min-h-screen pt-24 px-6 sm:px-12 md:px-16 max-w-4xl mx-auto">
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-[#1e2023] rounded-xl border border-[#4a4455]/30 p-5">
            <div className="flex gap-3 items-start">
              <Skeleton className="w-8 h-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
