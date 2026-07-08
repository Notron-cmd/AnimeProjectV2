import { ProfileSkeleton } from "@/components/skeletons/ProfileSkeleton";

export default function ProfileLoading() {
  return (
    <main className="bg-[#121317] min-h-screen pt-24 px-6 sm:px-12 md:px-16 max-w-[1600px] mx-auto">
      <ProfileSkeleton />
    </main>
  );
}
