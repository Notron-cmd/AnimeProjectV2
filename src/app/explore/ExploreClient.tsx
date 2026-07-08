"use client";

import React, { useState, useEffect } from "react";
import { SearchBar } from "./_components/SearchBar";
import { FilterSection } from "./_components/FilterSection"; 
import { AnimeGrid } from "./_components/AnimeGrid";
import { searchAnime } from "@/lib/anilist";
import type { AniListAnime } from "@/lib/types";

const ExploreClient = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]); // Array State
  const [selectedFormat, setSelectedFormat] = useState("All");
  const [sortBy, setSortBy] = useState("popularity");
  const [animeList, setAnimeList] = useState<AniListAnime[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  // Fungsi toggle item genre ke dalam/luar array
  const handleGenreToggle = (genre: string) => {
    setSelectedGenres((prev) => 
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleClearGenres = () => setSelectedGenres([]);

  useEffect(() => {
    async function fetchLiveAnime() {
      setLoading(true);
      setPage(1);
      
      try {
        const data = await searchAnime(searchQuery, selectedGenres, selectedFormat, sortBy, 1);
        setAnimeList(data || []);
      } catch (error) {
        console.error("Failed to fetch explore anime:", error);
        setAnimeList([]);
      } finally {
        setLoading(false);
      }
    }

    const delayDebounce = setTimeout(() => {
      fetchLiveAnime();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, selectedGenres, selectedFormat, sortBy]);

  const handleLoadMore = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;

    try {
      const newData = await searchAnime(searchQuery, selectedGenres, selectedFormat, sortBy, nextPage);
      if (newData && newData.length > 0) {
        setAnimeList((prev) => [...prev, ...newData]);
        setPage(nextPage);
      }
    } catch (error) {
      console.error("Failed to load more explore anime:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <main className="flex-grow flex flex-col px-6 py-10 gap-6 max-w-7xl mx-auto w-full pt-24 min-h-screen">
      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      <FilterSection
        selectedGenres={selectedGenres}
        onGenreToggle={handleGenreToggle}
        onClearGenres={handleClearGenres}
        sortBy={sortBy}
        onSortChange={setSortBy}
        selectedFormat={selectedFormat}
        onFormatChange={setSelectedFormat}
      />

      {loading ? (
        <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 w-full">
          {[...Array(12)].map((_, idx) => (
            <div key={idx} className="w-full aspect-[2/3] rounded-lg bg-[#14181d]/40 animate-pulse border border-white/5" />
          ))}
        </section>
      ) : (
        <>
          <AnimeGrid animes={animeList} />
          
          {animeList.length >= 24 && (
            <div className="mt-8 flex justify-center">
              <button 
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="px-6 py-3 rounded-xl border border-white/10 text-white bg-surface-container-high/40 hover:bg-surface-container-high/80 transition-all text-xs font-bold tracking-wider cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed uppercase"
              >
                {loadingMore ? 'Loading More Series...' : 'Load More Results'}
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default ExploreClient;