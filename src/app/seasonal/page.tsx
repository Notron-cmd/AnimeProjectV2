'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getSeasonalAnime } from '@/lib/anilist';

const SEASONS = ['WINTER', 'SPRING', 'SUMMER', 'FALL'] as const;

export default function SeasonalPage() {
  const now = new Date();
  const currentMonth = now.getMonth();
  let defaultSeason = 'SPRING';
  if (currentMonth >= 11 || currentMonth <= 1) defaultSeason = 'WINTER';
  else if (currentMonth >= 2 && currentMonth <= 4) defaultSeason = 'SPRING';
  else if (currentMonth >= 5 && currentMonth <= 7) defaultSeason = 'SUMMER';
  else if (currentMonth >= 8 && currentMonth <= 10) defaultSeason = 'FALL';

  const [season, setSeason] = useState(defaultSeason);
  const [year, setYear] = useState(now.getFullYear());
  const [animeList, setAnimeList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setLoading(true);
    setPage(1);
    setAnimeList([]);
    setHasMore(true);
    (async () => {
      try {
        const data = await getSeasonalAnime(season, year, 1);
        setAnimeList(data || []);
        setHasMore((data?.length ?? 0) === 24);
      } catch {
        setAnimeList([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [season, year]);

  const loadMore = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const data = await getSeasonalAnime(season, year, nextPage);
      if (data?.length) {
        setAnimeList(prev => [...prev, ...data]);
        setPage(nextPage);
        setHasMore(data.length === 24);
      } else {
        setHasMore(false);
      }
    } catch {
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <main className="flex-grow pt-24 px-4 sm:px-8 max-w-7xl mx-auto w-full pb-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Seasonal Anime</h1>
        <p className="text-sm text-muted-foreground mt-1">Browse anime by season and year.</p>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-8">
        <div className="flex gap-1 bg-card border border-border rounded-lg p-1">
          {SEASONS.map(s => (
            <button
              key={s}
              onClick={() => setSeason(s)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                season === s ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        <select
          value={year}
          onChange={e => setYear(parseInt(e.target.value))}
          className="bg-card border border-border rounded-lg px-3 py-1.5 text-xs font-medium text-foreground focus:ring-1 focus:ring-ring outline-none cursor-pointer"
        >
          {Array.from({ length: 10 }, (_, i) => now.getFullYear() - i).map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] rounded-lg bg-card border border-border/40 animate-pulse" />
          ))}
        </div>
      ) : animeList.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {animeList.map((anime: any) => (
              <Link key={anime.id} href={`/anime/${anime.id}`} className="group block">
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-card border border-border/40 group-hover:ring-2 group-hover:ring-primary transition-all duration-300">
                  <Image
                    src={anime.coverImage?.extraLarge || anime.coverImage?.large}
                    alt={anime.title?.english || anime.title?.romaji}
                    fill
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent flex flex-col justify-end p-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-1 mb-0.5">
                      <span className="material-symbols-outlined text-amber-400 text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="text-[10px] font-semibold text-foreground">{anime.averageScore ?? '--'}</span>
                    </div>
                    <span className="text-[9px] text-muted-foreground">{anime.format} • {anime.episodes ?? '?'} eps</span>
                  </div>
                </div>
                <h3 className="text-xs font-medium text-foreground line-clamp-1 mt-1.5 group-hover:text-primary transition-colors">
                  {anime.title?.english || anime.title?.romaji}
                </h3>
              </Link>
            ))}
          </div>
          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="px-6 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-50"
              >
                {loadingMore ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <span className="material-symbols-outlined text-4xl text-muted-foreground/30 mb-2">search</span>
          <p className="text-sm text-muted-foreground">No anime found for this season.</p>
        </div>
      )}
    </main>
  );
}
