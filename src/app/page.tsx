import React from 'react';
import dynamic from "next/dynamic";
import SearchSection from "@/components/Home/SearchSection";

const HeroSection = dynamic(() => import("@/components/Home/Hero"), { ssr: true });
const TrendingSection = dynamic(() => import("@/components/Home/TrendingSection"), { ssr: true });
import FeatureCards from "@/components/Home/FeatureCards";
import QuickStats from "@/components/Home/QuickStats";
import { getTrendingAnime, searchAnime } from "@/lib/anilist";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/src/lib/auth";
import Link from 'next/link';
import AnimeCard from "@/components/Home/AnimeCard";
import { ArrowLeft, Zap, Sparkles, Heart, Monitor, Compass, Smile, Clapperboard, AlertTriangle, Search, Leaf, Gamepad2, Moon } from "lucide-react";
import type { AniListAnime } from "@/lib/types";

interface PageProps {
  searchParams: Promise<{ q?: string; genre?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = params.q || "";
  const genre = params.genre || "All Genres";

  // Ambil data trending untuk carousel atas
  const trendingData = await getTrendingAnime();

  // Jika user sedang mencari sesuatu, ambil data hasil pencariannya
  const isSearching = query !== "" || genre !== "All Genres";
  const searchResults = isSearching ? await searchAnime(query, [genre]) : [];

  const [userCount, animeCount, bookmarkCount, favoriteCount, currentUser] = await Promise.all([
    prisma.user.count(),
    prisma.anime.count(),
    prisma.bookmark.count(),
    prisma.favorite.count(),
    getCurrentUser(),
  ]);

  return (
    <>
      <main className="bg-[#121317] min-h-screen pb-16">
        {/* 1. Hero Banner Tetap Statis/Dinamis Mendukung */}
        <HeroSection trendingData={trendingData}/>
        
        {/* 2. Komponen Input Pencarian */}
        <SearchSection currentQuery={query} currentGenre={genre} />

        {/* 3. Kondisional Kondisi: Jika Mencari vs Tampilan Normal */}
        {isSearching ? (
          <section className="w-full px-6 sm:px-12 md:px-16 py-8 max-w-[1600px] mx-auto relative z-30">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold tracking-wide text-white flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#c3b4fc] rounded-full inline-block"></span>
                Hasil Pencarian {query && `"${query}"`} {genre !== 'All Genres' && `[${genre}]`}
              </h2>
              <Link
                href="/"
                className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors bg-[#1a1b23] border border-white/5 hover:border-white/20 rounded-lg px-3 py-2"
              >
                <ArrowLeft className="text-sm" />
                Back to Home
              </Link>
            </div>
            
            {searchResults.length === 0 ? (
              <p className="text-zinc-400 text-sm">Anime tidak ditemukan, coba filter atau kata kunci lain.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                {searchResults.map((anime: AniListAnime) => (
                  <Link href={`/anime/${anime.id}`} key={anime.id}>
                    <AnimeCard
                      title={anime.title.english || anime.title.romaji}
                      rating={anime.averageScore ? (anime.averageScore / 10).toFixed(1) : "N/A"}
                      episode={anime.episodes?.toString() || "Ongoing"}
                      type={anime.format || "TV"}
                      image={anime.coverImage.large || anime.coverImage.extraLarge}
                    />
                  </Link>
                ))}
              </div>
            )}
          </section>
        ) : (
          /* Tampilkan Carousel Trending Jika Tidak Sedang Mencari */
          <>
            <TrendingSection animeData={trendingData} />

            {/* Genre Browse */}
            <section className="w-full px-6 sm:px-12 md:px-16 py-10 max-w-[1600px] mx-auto relative z-30">
              <h2 className="text-xl sm:text-2xl font-bold tracking-wide text-white mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-emerald-400 rounded-full inline-block"></span>
                Browse by Genre
              </h2>
              {(() => {
                const genreIcons: Record<string, React.ComponentType<{ className?: string }>> = {
                  bolt: Zap,
                  auto_awesome: Sparkles,
                  favorite: Heart,
                  devices: Monitor,
                  explore: Compass,
                  mood: Smile,
                  theater_comedy: Clapperboard,
                  dangerous: AlertTriangle,
                  search: Search,
                  spa: Leaf,
                  sports_esports: Gamepad2,
                  nights_stay: Moon,
                };
                const genres = [
                  { name: 'Action', icon: 'bolt', gradient: 'from-red-600/30 to-red-900/20' },
                  { name: 'Fantasy', icon: 'auto_awesome', gradient: 'from-purple-600/30 to-purple-900/20' },
                  { name: 'Romance', icon: 'favorite', gradient: 'from-pink-600/30 to-pink-900/20' },
                  { name: 'Sci-Fi', icon: 'devices', gradient: 'from-cyan-600/30 to-cyan-900/20' },
                  { name: 'Adventure', icon: 'explore', gradient: 'from-amber-600/30 to-amber-900/20' },
                  { name: 'Comedy', icon: 'mood', gradient: 'from-yellow-600/30 to-yellow-900/20' },
                  { name: 'Drama', icon: 'theater_comedy', gradient: 'from-blue-600/30 to-blue-900/20' },
                  { name: 'Horror', icon: 'dangerous', gradient: 'from-zinc-600/30 to-zinc-900/20' },
                  { name: 'Mystery', icon: 'search', gradient: 'from-indigo-600/30 to-indigo-900/20' },
                  { name: 'Slice of Life', icon: 'spa', gradient: 'from-rose-600/30 to-rose-900/20' },
                  { name: 'Sports', icon: 'sports_esports', gradient: 'from-orange-600/30 to-orange-900/20' },
                  { name: 'Supernatural', icon: 'nights_stay', gradient: 'from-violet-600/30 to-violet-900/20' },
                ];
                return (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                    {genres.map((g) => {
                      const IconComp = genreIcons[g.icon] || Search;
                      return (
                        <Link
                          key={g.name}
                          href={`/?genre=${g.name}`}
                          className={`bg-gradient-to-br ${g.gradient} border border-white/5 hover:border-white/20 rounded-xl p-4 flex flex-col items-center gap-2 transition-all duration-200 hover:-translate-y-0.5 active:scale-95 group`}
                        >
                          <IconComp className="text-2xl text-zinc-300 group-hover:text-white transition-colors" />
                          <span className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors">{g.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                );
              })()}
            </section>

            <FeatureCards />

            {!currentUser && (
              <section className="w-full px-6 sm:px-12 md:px-16 py-10 max-w-[1600px] mx-auto relative z-30">
                <div className="bg-gradient-to-br from-[#7c3aed]/20 to-[#4c1d95]/10 border border-[#7c3aed]/30 rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Join the Community</h2>
                    <p className="text-sm text-zinc-400 max-w-lg">Create your free account to track anime, build your collection, and never miss a new episode.</p>
                  </div>
                  <div className="flex gap-3 shrink-0">
                    <Link href="/register" className="bg-[#7c3aed] text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#6d28d9] transition-all active:scale-95">Sign Up Free</Link>
                    <Link href="/login" className="bg-white/10 text-white border border-white/15 px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-white/20 transition-all active:scale-95">Login</Link>
                  </div>
                </div>
              </section>
            )}

            <QuickStats animeCount={animeCount} userCount={userCount} bookmarkCount={bookmarkCount} favoriteCount={favoriteCount} />
          </>
        )}
      </main>
    </>
  );
}