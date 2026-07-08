'use client';

import React, { useState, useEffect } from 'react';
import FeaturedCard from './_components/FeaturedCard';
import FilterBar from './_components/FilterBar';
import AnimeCard from './_components/AnimeCard';
import TrendingSidebar from './_components/TrendingSidebar';
import { getTrendingAnime, getRisingStarsAnime } from '@/lib/anilist';
import type { AniListAnime } from "@/lib/types";

export default function TrendingPage() {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'all'>('week');
  const [selectedGenre, setSelectedGenre] = useState('All Genres');
  const [animeList, setAnimeList] = useState<AniListAnime[]>([]);
  const [risingStars, setRisingStars] = useState<AniListAnime[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  // Mengambil data awal saat Filter Genre atau Timeframe berubah
  useEffect(() => {
    async function fetchInitialData() {
      setLoading(true);
      setPage(1); // Reset kembali ke halaman 1
      try {
        // Menarik data grid kiri dan data sidebar secara paralel
        const [trendingData, risingData] = await Promise.all([
          getTrendingAnime(selectedGenre, timeframe, 1),
          getRisingStarsAnime()
        ]);
        
        setAnimeList(trendingData || []);
        setRisingStars(risingData || []);
      } catch (error) {
        console.error("Failed to fetch trending data:", error);
        setAnimeList([]);
        setRisingStars([]);
      } finally {
        setLoading(false);
      }
    }
    fetchInitialData();
  }, [selectedGenre, timeframe]);

  // Fungsi penangan untuk memuat data halaman berikutnya
  const handleLoadMore = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    
    try {
      const newData = await getTrendingAnime(selectedGenre, timeframe, nextPage);
      if (newData && newData.length > 0) {
        // Gabungkan data lama dengan data baru yang baru saja ditarik
        setAnimeList((prevList) => [...prevList, ...newData]);
        setPage(nextPage);
      }
    } catch (error) {
      console.error("Failed to load more anime:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  const featuredAnime = animeList[0];
  // Grid mengambil seluruh sisa anime dari urutan kedua sampai akhir array
  const gridAnime = animeList.slice(1);

  return (
    <main className="min-h-screen bg-[#0A0C0F] text-[#e2e2e6] pt-24 pb-10 max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12">
      
      {/* HEADER UTAMA */}
      <header className="mb-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-2 text-white font-display">
          Trending Now
        </h1>
        <p className="text-base sm:text-lg text-[#ccc3d8] max-w-2xl">
           Discover the series that are capturing the world&apos;s attention. Real-time popularity data driven by global engagement.
        </p>
      </header>

      {/* SEKSI HIGHLIGHT RANK #1 */}
      {loading ? (
        <div className="h-[420px] sm:h-[500px] w-full rounded-2xl bg-[#14181d]/40 animate-pulse mb-12 border border-[#242b33]/30" />
      ) : (
        featuredAnime && <FeaturedCard anime={featuredAnime} />
      )}

      {/* CORE LAYOUT DENGAN SIDEBAR */}
      <div className="flex flex-col lg:flex-row gap-8 w-full">
        
        {/* KOLOM KIRI: FILTERS & GRID CARDS */}
        <div className="flex-1 w-full min-w-0">
          <FilterBar 
            timeframe={timeframe} 
            setTimeframe={setTimeframe} 
            selectedGenre={selectedGenre} 
            setSelectedGenre={setSelectedGenre} 
          />

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5">
              {[...Array(8)].map((_, idx) => (
                <div key={idx} className="w-full aspect-[2/3] rounded-xl bg-[#14181d]/40 animate-pulse border border-[#242b33]/20" />
              ))}
            </div>
          ) : gridAnime.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5">
                {gridAnime.map((anime, index) => {
                  const displayTitle = anime.title.english || anime.title.romaji;
                  const genresFormatted = anime.genres?.slice(0, 2).join(' • ') || 'Anime';
                  const scoreFormatted = anime.averageScore ? `${anime.averageScore}%` : 'N/A';

                  return (
                    <AnimeCard 
                      key={`${anime.id}-${index}`}
                      id={anime.id.toString()}
                      rank={`#${index + 2}`}
                      title={displayTitle}
                      genre={genresFormatted}
                      views={scoreFormatted}
                      image={anime.coverImage.large || anime.coverImage.extraLarge} 
                    />
                  );
                })}
              </div>

              {/* TOMBOL LOAD MORE DENGAN EVENT CLICK */}
              <div className="mt-8 flex justify-center">
                <button 
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="px-6 py-3 rounded-xl border border-[#4a4455] text-white hover:bg-[#333538] transition-all text-xs font-bold tracking-wider cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed uppercase"
                >
                  {loadingMore ? 'LOADING NEW TRENDING...' : 'LOAD MORE TRENDING'}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-16 text-zinc-500">No anime found for this genre.</div>
          )}
        </div>

        {/* KOLOM KANAN: SIDEBAR */}
        <TrendingSidebar stars={risingStars} loading={loading} />

      </div>
    </main>
  );
}