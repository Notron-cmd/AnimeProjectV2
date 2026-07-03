'use client';

import React, { useState, useEffect, useCallback } from 'react';
import PodiumSection from './_components/PodiumSection';
import FilterSection from './_components/FilterSection';
import RankingRow from './_components/RankingRow';
import { getTopAnime } from '@/lib/anilist';

export default function RankingsClient() {
  const [animeList, setAnimeList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const [genre, setGenre] = useState('All');
  const [year, setYear] = useState<number | undefined>(undefined);
  const [status, setStatus] = useState('All');

  const fetchRankings = useCallback(async (pageNum: number, append: boolean) => {
    if (!append) setLoading(true);
    try {
      const data = await getTopAnime(pageNum, 23, {
        genre: genre === 'All' ? undefined : genre,
        year,
        status: status === 'All' ? undefined : status,
      });
      if (append) {
        setAnimeList((prev) => {
          const combined = [...prev, ...data];
          return combined.filter(
            (item, index, self) => self.findIndex((a) => a.id === item.id) === index
          );
        });
      } else {
        setAnimeList(data || []);
        setPage(1);
      }
    } catch {
      if (!append) setAnimeList([]);
    } finally {
      setLoading(false);
    }
  }, [genre, year, status]);

  useEffect(() => {
    fetchRankings(1, false);
  }, [fetchRankings]);

  const handleLoadMore = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    try {
      const newData = await getTopAnime(nextPage, 20, {
        genre: genre === 'All' ? undefined : genre,
        year,
        status: status === 'All' ? undefined : status,
      });
      if (newData && newData.length > 0) {
        setAnimeList((prev) => {
          const combined = [...prev, ...newData];
          return combined.filter(
            (item, index, self) => self.findIndex((a) => a.id === item.id) === index
          );
        });
        setPage(nextPage);
      }
    } catch {
      // ignore
    } finally {
      setLoadingMore(false);
    }
  };

  const topThree = animeList.slice(0, 3);
  const remainingRankings = animeList.slice(3);

  return (
    <main className="bg-[#0A0C0F] text-[#e2e2e6] min-h-screen pt-24 pb-10">
      <section className="relative px-8 sm:px-12 md:px-16 mb-10 min-h-[200px] flex flex-col justify-end pb-4">
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-2">Top Rated Masterpieces</h1>
          <p className="text-base text-zinc-400 leading-relaxed">
            Explore the definitive list of anime excellence. Curated by the global AniVision community, these titles represent the pinnacle of storytelling, animation, and cultural impact.
          </p>
        </div>
      </section>

      {loading ? (
        <div className="px-8 sm:px-12 md:px-16 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-end">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`bg-[#14181d]/60 rounded-xl p-6 ${i === 2 ? 'md:scale-105 md:-translate-y-6' : ''}`}>
                <div className="w-full aspect-[2/3] rounded-lg bg-zinc-800/50 animate-pulse mb-4" />
                <div className="h-5 w-3/4 bg-zinc-800/50 animate-pulse rounded mx-auto mb-3" />
                <div className="h-4 w-1/4 bg-zinc-800/50 animate-pulse rounded mx-auto mb-4" />
                <div className="h-9 w-full bg-zinc-800/50 animate-pulse rounded-lg" />
              </div>
            ))}
          </div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-[#1a1c1f]/50 animate-pulse rounded-lg" />
          ))}
        </div>
      ) : (
        <>
          <PodiumSection topThree={topThree} />

          <section className="px-8 sm:px-12 md:px-16">
            <FilterSection
              genre={genre}
              year={year}
              status={status}
              onGenreChange={setGenre}
              onYearChange={setYear}
              onStatusChange={setStatus}
              total={animeList.length}
            />

            <div className="space-y-2">
              <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-xs font-semibold tracking-wider text-zinc-500 uppercase opacity-80">
                <div className="col-span-1 text-center">Rank</div>
                <div className="col-span-6">Title</div>
                <div className="col-span-2 text-center">Score</div>
                <div className="col-span-2 text-center">Users</div>
                <div className="col-span-1"></div>
              </div>

              {remainingRankings.map((anime, index) => (
                <RankingRow
                  key={`${anime.id}-${index}`}
                  rank={index + 4}
                  anime={anime}
                />
              ))}
            </div>

            <div className="flex justify-center py-10">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[#282a2d] border border-[#4a4455]/30 text-xs font-semibold tracking-wide text-white hover:bg-[#37393d] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingMore ? "Loading More..." : "Load More Results"}
                <span className="material-symbols-outlined text-[18px]">expand_more</span>
              </button>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
