'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCurrentlyAiring } from '@/lib/anilist';

export default function AiringPage() {
  const [animeList, setAnimeList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const data = await getCurrentlyAiring(1);
        setAnimeList(data || []);
        setHasMore((data?.length ?? 0) === 24);
      } catch {
        setAnimeList([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const loadMore = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const data = await getCurrentlyAiring(nextPage);
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

  const formatTimeUntilAiring = (seconds: number) => {
    if (seconds <= 0) return 'Airing now';
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    if (days > 0) return `${days}d ${hours}h`;
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${mins}m`;
  };

  return (
    <main className="flex-grow pt-24 px-4 sm:px-8 max-w-7xl mx-auto w-full pb-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Currently Airing</h1>
        <p className="text-sm text-muted-foreground mt-1">Anime that are currently broadcasting.</p>
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
            {animeList.map((anime: any) => {
              const next = anime.nextAiringEpisode;
              return (
                <Link key={anime.id} href={`/anime/${anime.id}`} className="group block">
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-card border border-border/40 group-hover:ring-2 group-hover:ring-primary transition-all duration-300">
                    <img
                      src={anime.coverImage?.extraLarge || anime.coverImage?.large}
                      alt={anime.title?.english || anime.title?.romaji}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {next && (
                      <div className="absolute top-2 left-2 z-10 px-1.5 py-0.5 rounded bg-emerald-500/90 text-[8px] font-bold text-white uppercase tracking-wider">
                        EP {next.episode}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent flex flex-col justify-end p-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center gap-1 mb-0.5">
                        <span className="material-symbols-outlined text-amber-400 text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="text-[10px] font-semibold text-foreground">{anime.averageScore ?? '--'}</span>
                      </div>
                      <span className="text-[9px] text-muted-foreground">
                        {anime.format} • {anime.episodes ?? '?'} eps
                      </span>
                      {next && (
                        <span className="text-[9px] text-emerald-400 font-semibold mt-0.5">
                          Next: {formatTimeUntilAiring(next.timeUntilAiring)}
                        </span>
                      )}
                    </div>
                  </div>
                  <h3 className="text-xs font-medium text-foreground line-clamp-1 mt-1.5 group-hover:text-primary transition-colors">
                    {anime.title?.english || anime.title?.romaji}
                  </h3>
                </Link>
              );
            })}
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
          <span className="material-symbols-outlined text-4xl text-muted-foreground/30 mb-2">live_tv</span>
          <p className="text-sm text-muted-foreground">No currently airing anime found.</p>
        </div>
      )}
    </main>
  );
}
