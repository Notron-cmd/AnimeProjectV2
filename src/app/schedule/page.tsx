'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Calendar } from "lucide-react";
import { getScheduleAnime } from '@/lib/anilist';
import type { AniListAnime } from "@/lib/types";

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function getDayName(airingAt: number): string {
  return DAYS[new Date(airingAt * 1000).getDay()];
}

function formatTime(airingAt: number): string {
  return new Date(airingAt * 1000).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });
}

export default function SchedulePage() {
  const today = DAYS[new Date().getDay()];
  const [activeDay, setActiveDay] = useState(today);
  const [animeList, setAnimeList] = useState<AniListAnime[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    (async () => {
      try {
        const data = await getScheduleAnime(1);
        setAnimeList(data || []);
        setHasMore((data?.length ?? 0) === 50);
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
      const data = await getScheduleAnime(nextPage);
      if (data?.length) {
        setAnimeList(prev => [...prev, ...data]);
        setPage(nextPage);
        setHasMore(data.length === 50);
      } else {
        setHasMore(false);
      }
    } catch {
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  };

  const groupedByDay = useMemo(() => {
    const groups: Record<string, AniListAnime[]> = {};
    for (const day of DAYS) groups[day] = [];
    for (const anime of animeList) {
      const next = anime.nextAiringEpisode;
      if (next?.airingAt) {
        const day = getDayName(next.airingAt);
        if (groups[day]) groups[day].push(anime);
      }
    }
    return groups;
  }, [animeList]);

  const activeAnime = groupedByDay[activeDay] || [];

  return (
    <main className="flex-grow pt-24 px-4 sm:px-8 max-w-7xl mx-auto w-full pb-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Airing Schedule</h1>
        <p className="text-sm text-muted-foreground mt-1">Weekly anime broadcast schedule. Times are based on your local timezone.</p>
      </div>

      <div className="flex gap-1.5 mb-8 overflow-x-auto pb-2 scrollbar-none [&::-webkit-scrollbar]:hidden">
        {DAYS.map(day => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all cursor-pointer ${
              activeDay === day
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-card border border-border/40 text-muted-foreground hover:text-foreground hover:border-zinc-500'
            } ${day === today ? 'ring-1 ring-emerald-500/50' : ''}`}
          >
            {day}
            {day === today && <span className="ml-1.5 text-[9px] opacity-70">Today</span>}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] rounded-lg bg-card border border-border/40 animate-pulse" />
          ))}
        </div>
      ) : activeAnime.length > 0 ? (
        <>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{activeDay}</span>
            <span className="text-[10px] text-muted-foreground/50">({activeAnime.length} anime)</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {activeAnime.map((anime: AniListAnime) => {
              const next = anime.nextAiringEpisode;
              return (
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
                        <Star className="text-amber-400 text-xs fill-amber-400" />
                        <span className="text-[10px] font-semibold text-foreground">{anime.averageScore ?? '--'}</span>
                      </div>
                      <span className="text-[9px] text-muted-foreground">{anime.format} • {anime.episodes ?? '?'} eps</span>
                    </div>
                    {next && (
                      <div className="absolute top-2 left-2 z-10 px-1.5 py-0.5 rounded bg-emerald-500/90 text-[8px] font-bold text-white uppercase tracking-wider">
                        EP {next.episode}
                      </div>
                    )}
                  </div>
                  <h3 className="text-xs font-medium text-foreground line-clamp-1 mt-1.5 group-hover:text-primary transition-colors">
                    {anime.title?.english || anime.title?.romaji}
                  </h3>
                  {next && (
                    <p className="text-[10px] text-emerald-400 font-medium mt-0.5">
                      {formatTime(next.airingAt)}
                    </p>
                  )}
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
          <Calendar className="text-4xl text-muted-foreground/30 mb-2" />
          <p className="text-sm text-muted-foreground">No anime scheduled for {activeDay}.</p>
        </div>
      )}
    </main>
  );
}
